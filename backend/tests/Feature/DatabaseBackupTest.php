<?php

namespace Tests\Feature;

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

        foreach (['employee', 'subject_officer', 'secretary'] as $role) {
            $this->actingAs(User::factory()->create(['role' => $role, 'status' => 'active']))
                ->postJson('/api/system/database-backups')
                ->assertForbidden();
        }

        $this->actingAs(User::factory()->create([
            'role' => 'deputy_secretary',
            'status' => 'inactive',
        ]))->postJson('/api/system/database-backups')->assertForbidden();
    }
}
