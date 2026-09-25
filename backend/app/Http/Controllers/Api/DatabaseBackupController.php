<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DatabaseBackup;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Process;
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
}
