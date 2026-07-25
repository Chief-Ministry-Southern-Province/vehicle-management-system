<?php

namespace Tests\Feature;

use App\Models\Driver;
use App\Models\User;
use App\Models\VehicleRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;
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
            'status' => 'active',
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

        $this->actingAs($driverUser)->getJson('/api/driver/scheduled-journeys')
            ->assertOk()
            ->assertJsonCount(0, 'data.trips');

        $this->actingAs($driverUser)->getJson('/api/driver/trip-history')
            ->assertOk()
            ->assertJsonCount(0, 'data.trips');

        $this->actingAs($driverUser)->getJson('/api/driver/assigned-vehicle')
            ->assertOk()
            ->assertJsonPath('data.vehicle', null);

        $this->actingAs($driverUser)->postJson('/api/driver/issue-reports', [
            'issue_type' => 'journey_delay',
            'details' => 'Heavy traffic is delaying the journey.',
        ])->assertUnprocessable();
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

    public function test_deputy_secretary_can_view_approved_journeys(): void
    {
        $deputySecretary = User::factory()->create([
            'role' => 'deputy_secretary',
            'status' => 'active',
        ]);

        $this->actingAs($deputySecretary)
            ->getJson('/api/approved-journeys')
            ->assertOk()
            ->assertJsonPath('data.total', 0)
            ->assertJsonCount(0, 'data.requests');
    }

    public function test_vehicle_request_local_times_are_stored_as_utc(): void
    {
        $employee = User::factory()->create([
            'role' => 'employee',
            'status' => 'active',
        ]);

        $this->actingAs($employee)->postJson('/api/vehicle-requests', [
            'purpose' => 'Annual General Meeting',
            'destination' => 'Chief Secretary office',
            'departure_at' => '2026-07-26T10:00',
            'expected_return_at' => '2026-07-26T14:00',
            'passenger_count' => 4,
            'passenger_names' => 'Thisara, Chathura, Anupama, Gunathilaka',
        ])->assertCreated()
            ->assertJsonPath('data.vehicle_request.departure_at', '2026-07-26T04:30:00.000000Z')
            ->assertJsonPath('data.vehicle_request.expected_return_at', '2026-07-26T08:30:00.000000Z');

        $this->assertDatabaseHas('vehicle_requests', [
            'user_id' => $employee->id,
            'departure_at' => '2026-07-26 04:30:00',
            'expected_return_at' => '2026-07-26 08:30:00',
        ]);
    }

    public function test_driver_is_unavailable_only_inside_an_assigned_journey_time_slot(): void
    {
        Carbon::setTestNow('2026-07-23 09:00:00');

        try {
            $driverUser = User::factory()->create([
                'employee_id' => '200012345679',
                'role' => 'driver',
            ]);
            $requester = User::factory()->create();
            $driver = Driver::create([
                'driver_id' => 'DRV-TIME-1',
                'full_name' => $driverUser->name,
                'date_of_birth' => '2000-01-01',
                'nic' => $driverUser->employee_id,
                'address' => 'Test Road',
                'contact_number' => '0712345678',
                'licence_number' => 'TIME-LIC-1',
                'licence_type' => 'B',
                'licence_renewal_date' => '2028-01-01',
                'status' => 'active',
            ]);

            VehicleRequest::create([
                'user_id' => $requester->id,
                'requester_name' => $requester->name,
                'purpose' => 'Scheduled journey',
                'destination' => 'Galle',
                'departure_at' => '2026-07-23 10:00:00',
                'expected_return_at' => '2026-07-23 13:30:00',
                'passenger_count' => 1,
                'status' => 'approved',
                'allocated_driver_id' => $driver->id,
            ]);

            $this->assertSame('available', $driver->fresh()->status);

            Carbon::setTestNow('2026-07-23 11:00:00');
            $this->assertSame('unavailable', $driver->fresh()->status);

            Carbon::setTestNow('2026-07-23 13:30:00');
            $this->assertSame('available', $driver->fresh()->status);

            $driver->update(['status' => 'inactive']);
            $this->assertSame('unavailable', $driver->fresh()->status);
            $this->assertFalse($driver->fresh()->isActive());
        } finally {
            Carbon::setTestNow();
        }
    }

    public function test_driver_can_start_complete_and_report_the_vehicle_for_a_journey(): void
    {
        Carbon::setTestNow('2026-07-24 12:00:00');

        try {
            $driverUser = User::factory()->create([
                'employee_id' => '200012345680',
                'role' => 'driver',
            ]);
            $requester = User::factory()->create();
            $driver = Driver::create([
                'driver_id' => 'DRV-JOURNEY-1',
                'full_name' => $driverUser->name,
                'date_of_birth' => '2000-01-01',
                'nic' => $driverUser->employee_id,
                'address' => 'Test Road',
                'contact_number' => '0712345678',
                'licence_number' => 'JOURNEY-LIC-1',
                'licence_type' => 'B',
                'licence_renewal_date' => '2028-01-01',
            ]);

            $vehicle = \App\Models\Vehicle::create([
                'registration_number' => 'TEST-1001',
                'vehicle_type' => 'Van',
                'make' => 'Toyota',
                'model' => 'Hiace',
                'fuel_type' => 'Diesel',
                'fuel_capacity' => 70,
                'fuel_level' => 75,
                'seat_capacity' => 12,
                'revenue_license_expiry' => '2027-07-24',
            ]);

            $makeTrip = fn (string $purpose, string $departure, string $return, string $journeyStatus) => VehicleRequest::create([
                'user_id' => $requester->id,
                'requester_name' => $requester->name,
                'purpose' => $purpose,
                'destination' => 'Colombo',
                'departure_at' => $departure,
                'expected_return_at' => $return,
                'passenger_count' => 2,
                'passenger_names' => 'Passenger One, Passenger Two',
                'status' => 'approved',
                'journey_status' => $journeyStatus,
                'allocated_driver_id' => $driver->id,
                'allocated_vehicle_id' => $vehicle->id,
            ]);

            $makeTrip('Completed journey', '2026-07-23 08:00:00', '2026-07-23 10:00:00', 'completed');
            $ongoing = $makeTrip('Ongoing journey', '2026-07-24 10:00:00', '2026-07-24 14:00:00', 'ongoing');
            $future = $makeTrip('Future journey', '2026-07-26 08:00:00', '2026-07-26 10:00:00', 'scheduled');

            $this->actingAs($driverUser)->getJson('/api/driver/scheduled-journeys')
                ->assertOk()
                ->assertJsonCount(2, 'data.trips')
                ->assertJsonPath('data.trips.0.purpose', 'Ongoing journey')
                ->assertJsonPath('data.trips.0.status', 'Ongoing')
                ->assertJsonPath('data.trips.0.passenger_count', 2)
                ->assertJsonPath('data.trips.0.vehicle.registration_number', 'TEST-1001')
                ->assertJsonPath('data.trips.1.purpose', 'Future journey')
                ->assertJsonMissing(['purpose' => 'Completed journey']);

            $this->actingAs($driverUser)->getJson('/api/driver/trip-history')
                ->assertOk()
                ->assertJsonCount(1, 'data.trips')
                ->assertJsonPath('data.trips.0.purpose', 'Completed journey')
                ->assertJsonPath('data.trips.0.status', 'Completed')
                ->assertJsonMissing(['purpose' => 'Ongoing journey']);

            $this->actingAs($driverUser)->postJson('/api/driver/issue-reports', [
                'vehicle_request_id' => $ongoing->id,
                'issue_type' => 'mechanical_issue',
                'details' => 'Engine warning light is on.',
            ])->assertCreated()
                ->assertJsonPath('data.report.vehicle_id', $vehicle->id)
                ->assertJsonPath('data.report.vehicle_request_id', $ongoing->id)
                ->assertJsonPath('data.report.journey.journey_status', 'issue');

            $this->assertDatabaseHas('vehicle_requests', [
                'id' => $ongoing->id,
                'journey_status' => 'issue',
            ]);

            $subjectOfficer = User::factory()->create([
                'role' => 'subject_officer',
                'status' => 'active',
            ]);

            $this->actingAs($subjectOfficer)->getJson('/api/issue-reports')
                ->assertOk()
                ->assertJsonPath('data.reports.0.issue_type', 'mechanical_issue')
                ->assertJsonPath('data.reports.0.journey.journey_status', 'issue');

            $this->actingAs($driverUser)->patchJson("/api/driver/journeys/{$future->id}/status", [
                'action' => 'start',
            ])->assertOk()
                ->assertJsonPath('data.trip.status', 'Ongoing')
                ->assertJsonPath('data.driver_status', 'ongoing');

            $this->actingAs($driverUser)->patchJson("/api/driver/journeys/{$future->id}/status", [
                'action' => 'complete',
            ])->assertOk()
                ->assertJsonPath('data.trip.status', 'Completed')
                ->assertJsonPath('data.driver_status', 'available');

            $this->actingAs($driverUser)->getJson('/api/driver/scheduled-journeys')
                ->assertOk()
                ->assertJsonCount(1, 'data.trips')
                ->assertJsonMissing(['purpose' => 'Future journey']);

            $this->actingAs($driverUser)->getJson('/api/driver/trip-history')
                ->assertOk()
                ->assertJsonCount(2, 'data.trips')
                ->assertJsonFragment(['purpose' => 'Future journey']);
        } finally {
            Carbon::setTestNow();
        }
    }
}
