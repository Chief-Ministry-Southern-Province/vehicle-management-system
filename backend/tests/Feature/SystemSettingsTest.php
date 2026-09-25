<?php

namespace Tests\Feature;

use App\Models\SystemSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SystemSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_an_active_system_admin_can_read_and_persist_the_odometer_requirement(): void
    {
        $administrator = User::factory()->create([
            'role' => 'system_admin',
            'status' => 'active',
        ]);

        $this->actingAs($administrator)
            ->getJson('/api/system/odometer-settings')
            ->assertOk()
            ->assertJsonPath('data.settings.odometer_readings_required', true);

        $this->patchJson('/api/system/odometer-settings', [
            'odometer_readings_required' => false,
        ])->assertOk()
            ->assertJsonPath('data.settings.odometer_readings_required', false);

        $this->assertDatabaseHas('system_settings', [
            'key' => SystemSetting::ODOMETER_READINGS_REQUIRED,
            'value' => false,
            'updated_by' => $administrator->id,
        ]);

        $this->getJson('/api/system/odometer-settings')
            ->assertOk()
            ->assertJsonPath('data.settings.odometer_readings_required', false);
    }

    public function test_only_active_system_admins_can_access_odometer_settings(): void
    {
        $this->getJson('/api/system/odometer-settings')->assertUnauthorized();
        $this->patchJson('/api/system/odometer-settings', [
            'odometer_readings_required' => false,
        ])->assertUnauthorized();

        foreach (['employee', 'driver', 'deputy_secretary'] as $role) {
            $user = User::factory()->create(['role' => $role, 'status' => 'active']);

            $this->actingAs($user)
                ->getJson('/api/system/odometer-settings')
                ->assertForbidden();
            $this->patchJson('/api/system/odometer-settings', [
                'odometer_readings_required' => false,
            ])->assertForbidden();
        }

        $inactiveAdministrator = User::factory()->create([
            'role' => 'system_admin',
            'status' => 'inactive',
        ]);

        $this->actingAs($inactiveAdministrator)
            ->getJson('/api/system/odometer-settings')
            ->assertForbidden();
        $this->patchJson('/api/system/odometer-settings', [
            'odometer_readings_required' => false,
        ])->assertForbidden();
    }

    public function test_odometer_requirement_must_be_boolean(): void
    {
        $administrator = User::factory()->create([
            'role' => 'system_admin',
            'status' => 'active',
        ]);

        $this->actingAs($administrator)
            ->patchJson('/api/system/odometer-settings', [
                'odometer_readings_required' => 'not-a-boolean',
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('odometer_readings_required');
    }
}
