<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class DriverRegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_deputy_secretary_creating_driver_also_creates_directory_record(): void
    {
        $deputySecretary = User::factory()->create([
            'role' => 'deputy_secretary',
            'status' => 'active',
        ]);

        $response = $this->actingAs($deputySecretary)->postJson('/api/register', [
            'nic' => '200012345678',
            'name' => 'Test Driver',
            'email' => 'test.driver@example.com',
            'phone' => '0712345678',
            'role' => 'driver',
            'date_of_birth' => '2000-01-01',
            'address' => '123 Test Road',
            'licence_number' => 'B1234567',
            'licence_type' => 'B, B1',
            'licence_renewal_date' => '2028-01-01',
            'blood_group' => 'O+',
            'password' => 'Password123',
            'password_confirmation' => 'Password123',
        ]);

        $response->assertCreated()
            ->assertJsonPath('data.user.role', 'driver')
            ->assertJsonPath('data.driver.nic', '200012345678');

        $this->assertDatabaseHas('drivers', [
            'full_name' => 'Test Driver',
            'nic' => '200012345678',
            'contact_number' => '0712345678',
            'status' => 'available',
        ]);

        $driverUser = User::where('email', 'test.driver@example.com')->firstOrFail();
        $this->actingAs($driverUser)->getJson('/api/profile')
            ->assertOk()
            ->assertJsonPath('data.user.driver.licence_number', 'B1234567')
            ->assertJsonPath('data.user.driver.blood_group', 'O+');

        $this->actingAs($driverUser)->getJson('/api/driver/dashboard-stats')
            ->assertOk()
            ->assertJsonPath('data.stats.total_trips', 0)
            ->assertJsonPath('data.stats.today_trips', 0)
            ->assertJsonPath('data.stats.scheduled_trips', 0)
            ->assertJsonPath('data.stats.completed_trips', 0);

        $this->actingAs($driverUser)->getJson('/api/driver/today-schedule')
            ->assertOk()
            ->assertJsonCount(0, 'data.trips');
    }

    public function test_password_changes_only_when_current_password_is_valid(): void
    {
        $user = User::factory()->create(['password' => 'OldPassword123']);

        $this->actingAs($user)->putJson('/api/profile/password', [
            'current_password' => 'WrongPassword123',
            'password' => 'NewPassword123',
            'password_confirmation' => 'NewPassword123',
        ])->assertUnprocessable();

        $this->assertTrue(Hash::check('OldPassword123', $user->fresh()->password));

        $this->actingAs($user)->putJson('/api/profile/password', [
            'current_password' => 'OldPassword123',
            'password' => 'NewPassword123',
            'password_confirmation' => 'NewPassword123',
        ])->assertOk();

        $this->assertTrue(Hash::check('NewPassword123', $user->fresh()->password));
    }
}
