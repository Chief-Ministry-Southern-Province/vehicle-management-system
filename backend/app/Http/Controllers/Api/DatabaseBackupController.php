<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DatabaseBackup;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class DatabaseBackupController extends Controller
{
    /** Return persistent backup audit records; downloadable files are never retained. */
    public function index(): JsonResponse
    {
        $backups = DatabaseBackup::query()
            ->with('creator:id,name,employee_id')
            ->latest('id')
            ->limit(50)
            ->get()
            ->map(fn (DatabaseBackup $backup): array => [
                'id' => $backup->id,
                'filename' => $backup->filename,
                'size_bytes' => $backup->size_bytes,
                'database_driver' => $backup->database_driver,
                'operation' => $backup->operation ?? 'export',
                'created_at' => $backup->created_at?->toISOString(),
                'creator' => $backup->creator ? [
                    'id' => $backup->creator->id,
                    'name' => $backup->creator->name,
                    'employee_id' => $backup->creator->employee_id,
                ] : null,
            ]);

        return response()->json([
            'success' => true,
            'data' => ['backups' => $backups],
        ]);
    }

    /** Create a private database dump and return it directly to the deputy secretary. */
    public function store(Request $request): BinaryFileResponse|JsonResponse
    {
        $connectionName = config('database.default');
        $connection = config("database.connections.{$connectionName}");
        $directory = storage_path('app/backups');

        File::ensureDirectoryExists($directory);

        $timestamp = now()->format('Ymd-His');
        $extension = $connection['driver'] === 'sqlite' ? 'sqlite' : 'sql';
        $filename = "vms-gov-backup-{$timestamp}.{$extension}";
        $backupPath = $directory.DIRECTORY_SEPARATOR.$filename;

        try {
            match ($connection['driver']) {
                'sqlite' => $this->backupSqlite($connection, $backupPath),
                'mysql', 'mariadb' => $this->backupMySql($connection, $backupPath),
                default => throw new \RuntimeException('The configured database driver is not supported for backups.'),
            };
        } catch (\Throwable $exception) {
            File::delete($backupPath);
            Log::warning('Database backup failed.', ['exception' => $exception->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'Unable to create the database backup. Please contact the system administrator.',
            ], 500);
        }

        if (! File::isFile($backupPath) || File::size($backupPath) === 0) {
            File::delete($backupPath);

            return response()->json([
                'success' => false,
                'message' => 'The database backup could not be created.',
            ], 500);
        }

        try {
            DatabaseBackup::create([
                'user_id' => $request->user()->id,
                'filename' => $filename,
                'size_bytes' => File::size($backupPath),
                'database_driver' => $connection['driver'],
            ]);
        } catch (\Throwable $exception) {
            File::delete($backupPath);
            Log::warning('Database backup audit record failed.', ['exception' => $exception->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'Unable to record the database backup. Please contact the system administrator.',
            ], 500);
        }

        return response()->download($backupPath, $filename, [
            'Content-Type' => 'application/octet-stream',
        ])->deleteFileAfterSend(true);
    }

    /** Restore a complete, driver-matching database backup after an explicit destructive confirmation. */
    public function restore(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'backup_file' => ['required', 'file', 'max:'.config('database.backup_import_max_kb')],
            'confirmation' => ['required', 'string', Rule::in(['RESTORE'])],
        ]);

        $connectionName = (string) config('database.default');
        $connection = config("database.connections.{$connectionName}");
        $backupFile = $request->file('backup_file');

        if (! is_array($connection) || ! $backupFile instanceof UploadedFile || ! $backupFile->isValid()) {
            throw ValidationException::withMessages([
                'backup_file' => 'The uploaded backup could not be read.',
            ]);
        }

        $stagedBackupPath = null;
        $maintenanceEnabled = false;

        try {
            $extension = $this->validateRestoreFile($backupFile, $connection);
            $stagedBackupPath = $this->stageRestoreFile($backupFile, $extension);

            if (Artisan::call('down') !== 0) {
                throw new \RuntimeException('Unable to enable maintenance mode for the database restore.');
            }
            $maintenanceEnabled = true;

            match ($connection['driver']) {
                'sqlite' => $this->restoreSqlite($connectionName, $connection, $stagedBackupPath),
                'mysql', 'mariadb' => $this->restoreMySql($connectionName, $connection, $stagedBackupPath),
                default => throw new \RuntimeException('The configured database driver is not supported for restoration.'),
            };

            $filename = 'vms-gov-import-'.now()->format('Ymd-His').'.'.$extension;
            $this->recordImportedBackup(
                (int) $request->user()->id,
                $filename,
                File::size($stagedBackupPath),
                (string) $connection['driver'],
            );
        } catch (ValidationException $exception) {
            throw $exception;
        } catch (\Throwable $exception) {
            Log::error('Database restore failed.', ['exception' => $exception->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'Unable to restore the database backup. The previous database was retained when recovery was possible.',
            ], 500);
        } finally {
            if ($stagedBackupPath) {
                File::delete($stagedBackupPath);
            }

            if ($maintenanceEnabled) {
                try {
                    Artisan::call('up');
                } catch (\Throwable $exception) {
                    Log::critical('Database restore completed but maintenance mode could not be disabled.', [
                        'exception' => $exception->getMessage(),
                    ]);
                }
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Database backup restored. Sign in again to continue.',
            'data' => ['requires_reauthentication' => true],
        ]);
    }

    private function validateRestoreFile(UploadedFile $backupFile, array $connection): string
    {
        $driver = $connection['driver'] ?? null;
        if (! in_array($driver, ['sqlite', 'mysql', 'mariadb'], true)) {
            $this->invalidBackup('The configured database driver is not supported for restoration.');
        }

        $extension = strtolower(pathinfo($backupFile->getClientOriginalName(), PATHINFO_EXTENSION));
        $expectedExtension = $driver === 'sqlite' ? 'sqlite' : 'sql';
        if ($extension !== $expectedExtension) {
            $this->invalidBackup("Upload a .{$expectedExtension} backup for the configured database.");
        }

        $path = $backupFile->getRealPath();
        if (! is_string($path) || ! File::isFile($path) || File::size($path) === 0) {
            $this->invalidBackup('The uploaded backup is empty or unreadable.');
        }

        if ($driver === 'sqlite') {
            $databasePath = $connection['database'] ?? null;
            if (! is_string($databasePath) || $databasePath === '' || $databasePath === ':memory:' || ! File::isFile($databasePath)) {
                $this->invalidBackup('SQLite restoration requires a configured file-backed database.');
            }

            $this->assertValidSqliteBackup($path);
        } else {
            $this->assertValidSqlBackup($path);
        }

        return $expectedExtension;
    }

    private function invalidBackup(string $message): never
    {
        throw ValidationException::withMessages(['backup_file' => $message]);
    }

    private function stageRestoreFile(UploadedFile $backupFile, string $extension): string
    {
        $directory = storage_path('app/backup-imports');
        $path = $directory.DIRECTORY_SEPARATOR.Str::uuid().'.'.$extension;
        $sourcePath = $backupFile->getRealPath();

        File::ensureDirectoryExists($directory);
        if (! is_string($sourcePath) || ! File::copy($sourcePath, $path)) {
            throw new \RuntimeException('Unable to securely stage the uploaded database backup.');
        }

        return $path;
    }

    private function assertValidSqliteBackup(string $backupPath): void
    {
        $handle = fopen($backupPath, 'rb');
        $header = $handle === false ? false : fread($handle, 16);
        if (is_resource($handle)) {
            fclose($handle);
        }

        if ($header !== "SQLite format 3\0") {
            $this->invalidBackup('The uploaded file is not a valid SQLite database backup.');
        }

        try {
            $pdo = new \PDO('sqlite:'.$backupPath, null, null, [\PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION]);
            $quickCheck = $pdo->query('PRAGMA quick_check')?->fetchColumn();
            $tables = $pdo->query("SELECT name FROM sqlite_master WHERE type = 'table'")?->fetchAll(\PDO::FETCH_COLUMN) ?? [];
            $pdo = null;
        } catch (\PDOException) {
            $this->invalidBackup('The uploaded SQLite backup could not be verified.');
        }

        if ($quickCheck !== 'ok') {
            $this->invalidBackup('The uploaded SQLite backup failed its integrity check.');
        }

        $missingTables = array_diff(['migrations', 'users', 'vehicle_requests'], $tables);
        if ($missingTables !== []) {
            $this->invalidBackup('The uploaded SQLite file is not a compatible VMS-GOV database backup.');
        }
    }

    private function assertValidSqlBackup(string $backupPath): void
    {
        $handle = fopen($backupPath, 'rb');
        $sample = $handle === false ? false : fread($handle, 4096);
        if (is_resource($handle)) {
            fclose($handle);
        }

        if (! is_string($sample) || trim($sample) === '' || str_contains($sample, "\0")) {
            $this->invalidBackup('The uploaded SQL backup is empty or invalid.');
        }
    }

    private function restoreSqlite(string $connectionName, array $connection, string $backupPath): void
    {
        $databasePath = (string) $connection['database'];
        $directory = dirname($databasePath);
        $candidatePath = $directory.DIRECTORY_SEPARATOR.'.vms-gov-restore-'.Str::uuid().'.sqlite';
        $rollbackPath = storage_path('app/backup-imports'.DIRECTORY_SEPARATOR.'vms-gov-pre-restore-'.Str::uuid().'.sqlite');
        $targetChanged = false;

        try {
            $this->backupSqlite($connection, $rollbackPath);
            if (! File::copy($backupPath, $candidatePath)) {
                throw new \RuntimeException('Unable to prepare the SQLite database replacement.');
            }
            $this->assertValidSqliteBackup($candidatePath);

            DB::disconnect($connectionName);
            DB::purge($connectionName);
            $targetChanged = true;
            File::delete($databasePath);
            if (! File::move($candidatePath, $databasePath)) {
                throw new \RuntimeException('Unable to replace the SQLite database.');
            }

            $this->migrateAndVerify($connectionName);
        } catch (\Throwable $exception) {
            if ($targetChanged && File::isFile($rollbackPath)) {
                try {
                    DB::disconnect($connectionName);
                    DB::purge($connectionName);
                    File::delete($databasePath);
                    if (! File::copy($rollbackPath, $databasePath)) {
                        throw new \RuntimeException('Unable to restore the SQLite rollback copy.');
                    }
                    DB::purge($connectionName);
                } catch (\Throwable $rollbackException) {
                    Log::critical('SQLite database restore rollback failed.', [
                        'exception' => $rollbackException->getMessage(),
                    ]);

                    throw new \RuntimeException('The database restore failed and requires manual recovery from the backup.', 0, $exception);
                }
            }

            throw $exception;
        } finally {
            File::delete($candidatePath);
            File::delete($rollbackPath);
        }
    }

    private function restoreMySql(string $connectionName, array $connection, string $backupPath): void
    {
        $directory = storage_path('app/backup-imports');
        $rollbackPath = $directory.DIRECTORY_SEPARATOR.'vms-gov-pre-restore-'.Str::uuid().'.sql';
        $restoreStarted = false;

        try {
            $this->backupMySql($connection, $rollbackPath);
            $restoreStarted = true;
            $this->importMySql($connection, $backupPath);
            $this->migrateAndVerify($connectionName);
        } catch (\Throwable $exception) {
            if ($restoreStarted && File::isFile($rollbackPath)) {
                try {
                    $this->importMySql($connection, $rollbackPath);
                    DB::purge($connectionName);
                } catch (\Throwable $rollbackException) {
                    Log::critical('MySQL database restore rollback failed.', [
                        'exception' => $rollbackException->getMessage(),
                    ]);

                    throw new \RuntimeException('The database restore failed and requires manual recovery from the backup.', 0, $exception);
                }
            }

            throw $exception;
        } finally {
            File::delete($rollbackPath);
        }
    }

    private function importMySql(array $connection, string $backupPath): void
    {
        $input = fopen($backupPath, 'rb');
        if ($input === false) {
            throw new \RuntimeException('Unable to read the SQL backup for restoration.');
        }

        $command = [
            $this->restoreBinary(),
            '--host='.(string) ($connection['host'] ?? '127.0.0.1'),
            '--port='.(string) ($connection['port'] ?? '3306'),
            '--user='.(string) ($connection['username'] ?? ''),
            '--default-character-set=utf8mb4',
            '--database='.(string) ($connection['database'] ?? ''),
        ];
        $environment = array_filter(getenv(), 'is_string');
        $environment['MYSQL_PWD'] = (string) ($connection['password'] ?? '');

        try {
            $result = Process::timeout(300)
                ->env($environment)
                ->input($input)
                ->run($command);
        } finally {
            fclose($input);
        }

        if (! $result->successful()) {
            throw new \RuntimeException('The database restore process failed: '.str($result->errorOutput())->limit(1000));
        }
    }

    private function migrateAndVerify(string $connectionName): void
    {
        DB::disconnect($connectionName);
        DB::purge($connectionName);

        if (Artisan::call('migrate', ['--database' => $connectionName, '--force' => true]) !== 0) {
            throw new \RuntimeException('The restored database could not be migrated to the current application version.');
        }

        DB::purge($connectionName);
        $schema = Schema::connection($connectionName);
        foreach (['migrations', 'users', 'vehicle_requests', 'database_backups'] as $table) {
            if (! $schema->hasTable($table)) {
                throw new \RuntimeException('The restored database does not contain the required application schema.');
            }
        }
    }

    private function recordImportedBackup(int $actorId, string $filename, int $sizeBytes, string $driver): void
    {
        try {
            DatabaseBackup::create([
                'user_id' => User::query()->whereKey($actorId)->exists() ? $actorId : null,
                'filename' => $filename,
                'size_bytes' => $sizeBytes,
                'database_driver' => $driver,
                'operation' => 'import',
            ]);
        } catch (\Throwable $exception) {
            Log::warning('Database restore completed but its audit record could not be saved.', [
                'exception' => $exception->getMessage(),
            ]);
        }
    }

    private function backupSqlite(array $connection, string $backupPath): void
    {
        $databasePath = $connection['database'] ?? null;

        if (! is_string($databasePath) || $databasePath === '') {
            throw new \RuntimeException('The SQLite database path is not configured.');
        }

        if ($databasePath !== ':memory:') {
            File::copy($databasePath, $backupPath);

            return;
        }

        $pdo = app('db')->connection()->getPdo();
        $pdo->exec('VACUUM INTO '.$pdo->quote($backupPath));
    }

    private function backupMySql(array $connection, string $backupPath): void
    {
        $command = [
            $this->dumpBinary(),
            '--single-transaction',
            '--quick',
            '--routines',
            '--triggers',
            '--default-character-set=utf8mb4',
            '--host='.(string) ($connection['host'] ?? '127.0.0.1'),
            '--port='.(string) ($connection['port'] ?? '3306'),
            '--user='.(string) ($connection['username'] ?? ''),
            '--result-file='.$backupPath,
            (string) ($connection['database'] ?? ''),
        ];

        $environment = array_filter(getenv(), 'is_string');
        $environment['MYSQL_PWD'] = (string) ($connection['password'] ?? '');

        $result = Process::timeout(120)
            ->env($environment)
            ->run($command);

        if (! $result->successful()) {
            throw new \RuntimeException('The database dump process failed: '.str($result->errorOutput())->limit(1000));
        }
    }

    private function dumpBinary(): string
    {
        $configured = config('database.dump_binary', 'mysqldump');

        if ($configured !== 'mysqldump') {
            return $configured;
        }

        $mysqlBinaries = glob('C:'.DIRECTORY_SEPARATOR.'Program Files'.DIRECTORY_SEPARATOR.'MySQL'.DIRECTORY_SEPARATOR.'MySQL Server *'.DIRECTORY_SEPARATOR.'bin'.DIRECTORY_SEPARATOR.'mysqldump.exe') ?: [];

        foreach ($mysqlBinaries as $mysqlBinary) {
            if (File::isFile($mysqlBinary)) {
                return $mysqlBinary;
            }
        }

        $xamppBinary = realpath(dirname(PHP_BINARY).DIRECTORY_SEPARATOR.'..'.DIRECTORY_SEPARATOR.'mysql'.DIRECTORY_SEPARATOR.'bin'.DIRECTORY_SEPARATOR.'mysqldump.exe');

        return $xamppBinary && File::isFile($xamppBinary) ? $xamppBinary : $configured;
    }

    private function restoreBinary(): string
    {
        $configured = config('database.restore_binary', 'mysql');

        if ($configured !== 'mysql') {
            return $configured;
        }

        $mysqlBinaries = glob('C:'.DIRECTORY_SEPARATOR.'Program Files'.DIRECTORY_SEPARATOR.'MySQL'.DIRECTORY_SEPARATOR.'MySQL Server *'.DIRECTORY_SEPARATOR.'bin'.DIRECTORY_SEPARATOR.'mysql.exe') ?: [];

        foreach ($mysqlBinaries as $mysqlBinary) {
            if (File::isFile($mysqlBinary)) {
                return $mysqlBinary;
            }
        }

        $dumpBinary = $this->dumpBinary();
        $siblingBinary = dirname($dumpBinary).DIRECTORY_SEPARATOR.'mysql.exe';

        return File::isFile($siblingBinary) ? $siblingBinary : $configured;
    }
}
