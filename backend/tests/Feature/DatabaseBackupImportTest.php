<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Tests\TestCase;

class DatabaseBackupImportTest extends TestCase
{
    use RefreshDatabase;

    private string $originalDefaultConnection;

    private ?string $originalWebpushConnection;

    /** @var array<int, string> */
    private array $temporaryFiles = [];

    protected function setUp(): void
    {
        parent::setUp();

        $this->originalDefaultConnection = (string) config('database.default');
        $this->originalWebpushConnection = config('webpush.database_connection');
    }

    protected function tearDown(): void
    {
        DB::purge('restore_test');
        config(['database.default' => $this->originalDefaultConnection]);
        config(['webpush.database_connection' => $this->originalWebpushConnection]);

        foreach ($this->temporaryFiles as $path) {
            File::delete($path);
        }

        parent::tearDown();
    }

    public function test_only_an_active_system_admin_can_import_a_database_backup(): void
    {
        $this->withHeader('Accept', 'application/json')
            ->post('/api/system/database-backups/import')
            ->assertUnauthorized();

        foreach (['employee', 'driver', 'deputy_secretary', 'subject_officer', 'secretary'] as $role) {
            $user = User::factory()->create(['role' => $role, 'status' => 'active']);

            $this->actingAs($user)
                ->withHeader('Accept', 'application/json')
                ->post('/api/system/database-backups/import')
                ->assertForbidden();
        }

        $inactiveAdministrator = User::factory()->create([
            'role' => 'system_admin',
            'status' => 'inactive',
        ]);

        $this->actingAs($inactiveAdministrator)
            ->withHeader('Accept', 'application/json')
            ->post('/api/system/database-backups/import')
            ->assertForbidden();
    }

    public function test_import_requires_an_explicit_confirmation_and_a_driver_matching_file(): void
    {
        $administrator = User::factory()->create(['role' => 'system_admin', 'status' => 'active']);

        $this->actingAs($administrator)
            ->withHeader('Accept', 'application/json')
            ->post('/api/system/database-backups/import', [
                'backup_file' => UploadedFile::fake()->createWithContent('backup.sqlite', 'not-a-database'),
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('confirmation');

        $this->withHeader('Accept', 'application/json')
            ->post('/api/system/database-backups/import', [
            'backup_file' => UploadedFile::fake()->createWithContent('backup.sql', 'SELECT 1;'),
            'confirmation' => 'RESTORE',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('backup_file');

        $this->withHeader('Accept', 'application/json')
            ->post('/api/system/database-backups/import', [
            'backup_file' => UploadedFile::fake()->createWithContent('backup.sqlite', 'not-a-database'),
            'confirmation' => 'restore',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('confirmation');
    }

    public function test_system_admin_can_restore_a_valid_file_backed_sqlite_backup(): void
    {
        [$connectionName, $targetPath] = $this->configureFileBackedRestoreDatabase();
        $administrator = User::factory()->create(['role' => 'system_admin', 'status' => 'active']);
        $sourcePath = $this->temporarySqlitePath('database-restore-source');

        DB::disconnect($connectionName);
        DB::purge($connectionName);
        File::copy($targetPath, $sourcePath);

        $source = new \PDO('sqlite:'.$sourcePath);
        $source->exec('CREATE TABLE restore_probe (marker TEXT NOT NULL)');
        $source->exec("INSERT INTO restore_probe (marker) VALUES ('from-backup')");
        $source = null;

        $target = new \PDO('sqlite:'.$targetPath);
        $target->exec('CREATE TABLE restore_probe (marker TEXT NOT NULL)');
        $target->exec("INSERT INTO restore_probe (marker) VALUES ('target-only')");
        $target = null;

        $response = $this->actingAs($administrator)
            ->withHeader('Accept', 'application/json')
            ->post('/api/system/database-backups/import', [
                'backup_file' => UploadedFile::fake()->createWithContent('vms-gov-backup.sqlite', File::get($sourcePath)),
                'confirmation' => 'RESTORE',
            ])
            ->assertOk()
            ->assertJsonPath('data.requires_reauthentication', true);

        DB::purge($connectionName);
        $restored = new \PDO('sqlite:'.$targetPath);
        $marker = $restored->query('SELECT marker FROM restore_probe')->fetchColumn();
        $restored = null;

        $this->assertSame('from-backup', $marker);
        $this->assertDatabaseHas('database_backups', [
            'operation' => 'import',
            'database_driver' => 'sqlite',
        ]);
        $this->assertFalse(File::isFile(storage_path('framework/down')));
        $this->assertSame('Database backup restored. Sign in again to continue.', $response->json('message'));
    }

    private function configureFileBackedRestoreDatabase(): array
    {
        $connectionName = 'restore_test';
        $targetPath = $this->temporarySqlitePath('database-restore-target');
        $connection = config('database.connections.sqlite');
        $connection['database'] = $targetPath;

        config([
            "database.connections.{$connectionName}" => $connection,
            'database.default' => $connectionName,
            'webpush.database_connection' => $connectionName,
        ]);
        DB::purge($connectionName);

        $this->assertSame(0, Artisan::call('migrate:fresh', [
            '--database' => $connectionName,
            '--force' => true,
        ]));

        return [$connectionName, $targetPath];
    }

    private function temporarySqlitePath(string $prefix): string
    {
        $path = storage_path('app/'.$prefix.'-'.Str::uuid().'.sqlite');
        $this->temporaryFiles[] = $path;

        File::delete($path);

        return $path;
    }
}
