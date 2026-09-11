<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\UserSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class SystemAdminSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_system_admin_is_seeded_from_configuration(): void
    {
        config()->set('system_admin', [
            'username' => 'ADMIN-ENV-001',
            'name' => 'Configured Administrator',
            'email' => 'configured.admin@example.test',
            'phone' => '+94770000000',
            'department' => 'Information Technology',
            'password' => 'ConfiguredPassword123!',
        ]);

        $this->app->make(UserSeeder::class)->run();

        $systemAdmin = User::query()->where('email', 'configured.admin@example.test')->firstOrFail();

        $this->assertSame('ADMIN-ENV-001', $systemAdmin->employee_id);
        $this->assertSame('Configured Administrator', $systemAdmin->name);
        $this->assertSame('+94770000000', $systemAdmin->phone);
        $this->assertSame('Information Technology', $systemAdmin->department);
        $this->assertSame('system_admin', $systemAdmin->role);
        $this->assertTrue(Hash::check('ConfiguredPassword123!', $systemAdmin->password));
    }
}
