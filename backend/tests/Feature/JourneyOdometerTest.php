<?php

namespace Tests\Feature;

use App\Models\Driver;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class JourneyOdometerTest extends TestCase
{
    use RefreshDatabase;

    private function assignment(): array
    {
        $user = User::factory()->create(['role' => 'driver', 'employee_id' => '200012345699']);
        $driver = Driver::create([
            'driver_id' => 'DRV-METER', 'full_name' => $user->name, 'nic' => $user->employee_id,
            'date_of_birth' => '2000-01-01', 'address' => 'Office', 'contact_number' => '0712345699',
            'licence_number' => 'METER-LIC', 'licence_type' => 'B', 'licence_renewal_date' => '2028-01-01',
        ]);
        $vehicle = Vehicle::create([
            'registration_number' => 'METER-1001', 'vehicle_type' => 'Car', 'make' => 'Toyota',
            'model' => 'Corolla', 'fuel_level' => 75, 'seat_capacity' => 4, 'status' => 'scheduled_trip',
        ]);
        $trip = VehicleRequest::create([
            'user_id' => User::factory()->create()->id, 'requester_name' => 'Requester',
            'purpose' => 'Meeting', 'destination' => 'Galle', 'distance_km' => 10,
            'departure_at' => '2026-09-08 09:00:00', 'expected_return_at' => '2026-09-08 12:00:00',
            'passenger_count' => 1, 'status' => 'approved', 'journey_status' => 'scheduled',
            'allocated_driver_id' => $driver->id, 'allocated_vehicle_id' => $vehicle->id,
        ]);

        return [$user, $trip];
    }

    public function test_readings_are_required_validated_immutable_and_calculate_actual_distance(): void
    {
        [$user, $trip] = $this->assignment();
        $url = "/api/driver/journeys/{$trip->id}/status";
        $this->actingAs($user)->patchJson($url, ['action' => 'start'])->assertUnprocessable()->assertJsonValidationErrors('start_odometer_km');
        foreach ([-1, 'invalid', 1.234, 100000000] as $reading) {
            $this->patchJson($url, ['action' => 'start', 'start_odometer_km' => $reading])->assertUnprocessable();
        }
        $this->patchJson($url, ['action' => 'complete', 'start_odometer_km' => 100, 'end_odometer_km' => 120])->assertUnprocessable();
        $this->assertSame('scheduled', $trip->fresh()->journey_status);
        $this->patchJson($url, ['action' => 'start', 'start_odometer_km' => 100.25])->assertOk()->assertJsonPath('data.trip.start_odometer_km', 100.25);
        $startedAt = $trip->fresh()->journey_started_at;
        $this->patchJson($url, ['action' => 'start', 'start_odometer_km' => 200])->assertUnprocessable();
        $this->patchJson($url, ['action' => 'complete'])->assertUnprocessable()->assertJsonValidationErrors('end_odometer_km');
        $this->patchJson($url, ['action' => 'complete', 'end_odometer_km' => 99])->assertUnprocessable()->assertJsonValidationErrors('end_odometer_km');
        $this->patchJson($url, ['action' => 'complete', 'start_odometer_km' => 0, 'end_odometer_km' => 145.75])->assertUnprocessable();
        $this->assertSame('ongoing', $trip->fresh()->journey_status);
        $this->patchJson($url, ['action' => 'complete', 'end_odometer_km' => 145.75, 'actual_distance_km' => 999])->assertOk()
            ->assertJsonPath('data.trip.actual_distance_km', 45.5)->assertJsonPath('data.trip.distance_km', 10);
        $this->assertTrue($startedAt->equalTo($trip->fresh()->journey_started_at));
        $this->patchJson($url, ['action' => 'complete', 'end_odometer_km' => 150])->assertNotFound();
        $this->getJson('/api/driver/trip-history')->assertOk()->assertJsonPath('data.trips.0.actual_distance_km', 45.5)
            ->assertJsonPath('data.trips.0.start_odometer_km', 100.25)->assertJsonPath('data.trips.0.end_odometer_km', 145.75);
    }

    public function test_legacy_issue_journey_requires_missing_start_and_accepts_zero_distance(): void
    {
        [$user, $trip] = $this->assignment();
        $trip->update(['journey_status' => 'issue', 'journey_started_at' => now()]);
        $url = "/api/driver/journeys/{$trip->id}/status";
        $this->actingAs($user)->patchJson($url, ['action' => 'complete', 'end_odometer_km' => 0])->assertUnprocessable();
        $this->patchJson($url, ['action' => 'complete', 'start_odometer_km' => 0, 'end_odometer_km' => 0])->assertOk()->assertJsonPath('data.trip.actual_distance_km', 0);
    }

    public function test_only_the_active_assigned_driver_can_record_readings(): void
    {
        [$user, $trip] = $this->assignment();
        $url = "/api/driver/journeys/{$trip->id}/status";
        $payload = ['action' => 'start', 'start_odometer_km' => 100];
        $this->patchJson($url, $payload)->assertUnauthorized();
        $this->actingAs(User::factory()->create(['role' => 'employee']))->patchJson($url, $payload)->assertForbidden();
        $this->actingAs(User::factory()->create(['role' => 'driver']))->patchJson($url, $payload)->assertNotFound();
        $user->update(['status' => 'inactive']);
        $this->actingAs($user)->patchJson($url, $payload)->assertForbidden();
        $this->assertNull($trip->fresh()->start_odometer_km);
    }
}
