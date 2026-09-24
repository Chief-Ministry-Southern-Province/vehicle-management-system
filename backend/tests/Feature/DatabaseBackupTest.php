<?php

namespace Tests\Feature;

use App\Models\DatabaseBackup;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class DatabaseBackupTest extends TestCase
{
    use RefreshDatabase;

    #[DataProvider('backupAdministrators')]
    public function test_administrators_can_create_and_download_a_database_backup(string $role): void
    {
        $administrator = User::factory()->create(['role' => $role, 'status' => 'active']);
        $sourcePath = storage_path('app/database-backup-test-source.sqlite');
        File::delete($sourcePath);
        $source = new \PDO('sqlite:'.$sourcePath);
        $source->exec('CREATE TABLE backup_test (id INTEGER PRIMARY KEY, name TEXT NOT NULL)');
        $source->exec("INSERT INTO backup_test (name) VALUES ('Vehicle Management System')");
        $source->exec('CREATE TABLE database_backups (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NULL, filename TEXT NOT NULL, size_bytes INTEGER NOT NULL, database_driver TEXT NOT NULL, created_at DATETIME NULL)');
        config(['database.connections.sqlite.database' => $sourcePath]);

        $response = $this->actingAs($administrator)
            ->post('/api/system/database-backups')
            ->assertOk()
            ->assertDownload();

        $filename = str($response->headers->get('content-disposition'))
            ->after('filename=')
            ->trim('"')
            ->toString();

        $this->assertStringStartsWith('vms-gov-backup-', $filename);
        $this->assertStringEndsWith('.sqlite', $filename);
        $this->assertDatabaseHas('database_backups', [
            'user_id' => $administrator->id,
            'filename' => $filename,
            'database_driver' => 'sqlite',
        ]);
        File::delete(storage_path('app/backups'.DIRECTORY_SEPARATOR.$filename));
        File::delete($sourcePath);
    }

    public static function backupAdministrators(): array
    {
        return [['deputy_secretary'], ['system_admin']];
    }

    public function test_database_backups_require_an_active_deputy_secretary(): void
    {
        $this->postJson('/api/system/database-backups')->assertUnauthorized();
        $this->getJson('/api/system/database-backups')->assertUnauthorized();

        foreach (['employee', 'subject_officer', 'secretary'] as $role) {
            $this->actingAs(User::factory()->create(['role' => $role, 'status' => 'active']))
                ->postJson('/api/system/database-backups')
                ->assertForbidden();
            $this->actingAs(User::factory()->create(['role' => $role, 'status' => 'active']))
                ->getJson('/api/system/database-backups')
                ->assertForbidden();
        }

        $this->actingAs(User::factory()->create([
            'role' => 'deputy_secretary',
            'status' => 'inactive',
        ]))->postJson('/api/system/database-backups')->assertForbidden();
    }

    public function test_administrators_can_read_persistent_backup_history(): void
    {
        $administrator = User::factory()->create(['role' => 'system_admin', 'status' => 'active']);
        $creator = User::factory()->create(['role' => 'deputy_secretary', 'status' => 'active']);
        $backup = DatabaseBackup::create([
            'user_id' => $creator->id,
            'filename' => 'vms-gov-backup-20260924-120000.sqlite',
            'size_bytes' => 2048,
            'database_driver' => 'sqlite',
        ]);

        $this->actingAs($administrator)
            ->getJson('/api/system/database-backups')
            ->assertOk()
            ->assertJsonPath('data.backups.0.id', $backup->id)
            ->assertJsonPath('data.backups.0.filename', $backup->filename)
            ->assertJsonPath('data.backups.0.size_bytes', 2048)
            ->assertJsonPath('data.backups.0.creator.id', $creator->id);
    }
}
