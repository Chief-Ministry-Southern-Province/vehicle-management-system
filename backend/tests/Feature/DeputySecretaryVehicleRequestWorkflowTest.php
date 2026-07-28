<?php

namespace Tests\Feature;

use App\Models\Driver;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeputySecretaryVehicleRequestWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_allocating_a_vehicle_marks_it_as_a_scheduled_trip(): void
    {
        $deputy = User::factory()->create([
            'role' => 'deputy_secretary',
            'status' => 'active',
        ]);
        $requester = User::factory()->create(['role' => 'employee']);
        $vehicle = Vehicle::create([
            'registration_number' => 'SCHEDULE-1001',
            'vehicle_type' => 'Van',
            'make' => 'Toyota',
            'model' => 'Hiace',
            'status' => 'available',
            'fuel_level' => 80,
        ]);
        $driver = Driver::create([
            'driver_id' => 'DRV-SCHEDULE-1',
            'full_name' => 'Scheduled Driver',
            'date_of_birth' => '1990-01-01',
            'nic' => '901234567V',
            'address' => 'Test Road',
            'contact_number' => '0712345678',
            'licence_number' => 'LIC-SCHEDULE-1',
            'licence_type' => 'B',
            'licence_renewal_date' => '2028-01-01',
            'status' => 'active',
        ]);
        $vehicleRequest = VehicleRequest::create([
            'user_id' => $requester->id,
            'requester_name' => $requester->name,
            'purpose' => 'Scheduled inspection',
            'destination' => 'Galle',
            'departure_at' => '2026-08-10 09:00:00',
            'expected_return_at' => '2026-08-10 12:00:00',
            'passenger_count' => 2,
            'status' => 'recommended',
            'recommendation_status' => 'recommended',
        ]);

        $this->actingAs($deputy)
            ->patchJson("/api/approvals/vehicle-requests/{$vehicleRequest->id}/allocate", [
                'vehicle_id' => $vehicle->id,
                'driver_id' => $driver->id,
            ])
            ->assertOk()
            ->assertJsonPath('data.vehicle_request.allocated_vehicle.status', 'scheduled_trip');

        $this->assertDatabaseHas('vehicles', [
            'id' => $vehicle->id,
            'status' => 'scheduled_trip',
        ]);
    }

    public function test_vehicle_can_be_reallocated_before_start_with_a_reason_and_fresh_approval(): void
    {
        $deputy = User::factory()->create(['role' => 'deputy_secretary']);
        $approver = User::factory()->create(['role' => 'senior_deputy_secretary']);
        $requester = User::factory()->create(['role' => 'employee']);
        $oldVehicle = Vehicle::create([
            'registration_number' => 'REALLOC-OLD',
            'vehicle_type' => 'Car',
            'make' => 'Toyota',
            'model' => 'Corolla',
            'status' => 'scheduled_trip',
            'fuel_level' => 75,
        ]);
        $newVehicle = Vehicle::create([
            'registration_number' => 'REALLOC-NEW',
            'vehicle_type' => 'Car',
            'make' => 'Honda',
            'model' => 'Civic',
            'status' => 'available',
            'fuel_level' => 80,
        ]);
        $driver = Driver::create([
            'driver_id' => 'DRV-REALLOC-1',
            'full_name' => 'Reallocation Driver',
            'date_of_birth' => '1990-01-01',
            'nic' => '901234568V',
            'address' => 'Test Road',
            'contact_number' => '0712345679',
            'licence_number' => 'LIC-REALLOC-1',
            'licence_type' => 'B',
            'licence_renewal_date' => '2028-01-01',
            'allocated_vehicle' => $oldVehicle->registration_number,
            'status' => 'active',
        ]);
        $newDriver = Driver::create([
            'driver_id' => 'DRV-REALLOC-2',
            'full_name' => 'Replacement Driver',
            'date_of_birth' => '1991-01-01',
            'nic' => '911234568V',
            'address' => 'Replacement Road',
            'contact_number' => '0712345680',
            'licence_number' => 'LIC-REALLOC-2',
            'licence_type' => 'B',
            'licence_renewal_date' => '2028-01-01',
            'status' => 'active',
        ]);
        $vehicleRequest = VehicleRequest::create([
            'user_id' => $requester->id,
            'requester_name' => $requester->name,
            'purpose' => 'Official visit',
            'destination' => 'Matara',
            'departure_at' => '2026-08-10 09:00:00',
            'expected_return_at' => '2026-08-10 12:00:00',
            'passenger_count' => 2,
            'status' => 'approved',
            'journey_status' => 'scheduled',
            'recommendation_status' => 'recommended',
            'allocated_vehicle_id' => $oldVehicle->id,
            'allocated_driver_id' => $driver->id,
            'allocated_by' => $deputy->id,
            'allocated_at' => now(),
            'approved_by' => $approver->id,
            'approved_at' => now(),
            'driver_notified_at' => now(),
        ]);

        $this->actingAs($deputy)
            ->patchJson("/api/approvals/vehicle-requests/{$vehicleRequest->id}/reallocate", [
                'vehicle_id' => $newVehicle->id,
                'driver_id' => $newDriver->id,
            ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('reason');

        $this->actingAs($deputy)
            ->patchJson("/api/approvals/vehicle-requests/{$vehicleRequest->id}/reallocate", [
                'vehicle_id' => $newVehicle->id,
                'driver_id' => $newDriver->id,
                'reason' => 'The original vehicle developed a brake-system fault.',
            ])
            ->assertOk()
            ->assertJsonPath('data.vehicle_request.status', 'vehicle_allocated')
            ->assertJsonPath('data.vehicle_request.reallocation_reason', 'The original vehicle developed a brake-system fault.')
            ->assertJsonPath('data.vehicle_request.previous_allocated_vehicle.registration_number', 'REALLOC-OLD')
            ->assertJsonPath('data.vehicle_request.allocated_vehicle.registration_number', 'REALLOC-NEW')
            ->assertJsonPath('data.vehicle_request.previous_allocated_driver.driver_id', 'DRV-REALLOC-1')
            ->assertJsonPath('data.vehicle_request.allocated_driver.driver_id', 'DRV-REALLOC-2');

        $this->assertDatabaseHas('vehicle_requests', [
            'id' => $vehicleRequest->id,
            'status' => 'vehicle_allocated',
            'previous_allocated_vehicle_id' => $oldVehicle->id,
            'allocated_vehicle_id' => $newVehicle->id,
            'previous_allocated_driver_id' => $driver->id,
            'allocated_driver_id' => $newDriver->id,
            'approved_by' => null,
            'approved_at' => null,
        ]);
        $this->assertDatabaseHas('vehicles', ['id' => $oldVehicle->id, 'status' => 'available']);
        $this->assertDatabaseHas('vehicles', ['id' => $newVehicle->id, 'status' => 'scheduled_trip']);
        $this->assertDatabaseHas('drivers', [
            'id' => $driver->id,
            'allocated_vehicle' => null,
            'current_assignment' => null,
        ]);
        $this->assertDatabaseHas('drivers', [
            'id' => $newDriver->id,
            'allocated_vehicle' => 'REALLOC-NEW',
        ]);
    }

    public function test_senior_deputy_recommends_deputy_request_before_allocation(): void
    {
        $deputy = User::factory()->create([
            'role' => 'deputy_secretary',
            'status' => 'active',
        ]);
        $seniorDeputy = User::factory()->create([
            'role' => 'senior_deputy_secretary',
            'status' => 'active',
        ]);

        $this->actingAs($deputy)
            ->postJson('/api/vehicle-requests', [
                'purpose' => 'Official meeting',
                'destination' => 'Colombo',
                'departure_at' => '2026-08-10 09:00',
                'expected_return_at' => '2026-08-10 15:00',
                'passenger_count' => 2,
            ])
            ->assertCreated();

        $vehicleRequest = VehicleRequest::firstOrFail();

        $this->actingAs($seniorDeputy)
            ->getJson('/api/senior-recommendations/vehicle-requests')
            ->assertOk()
            ->assertJsonPath('data.requests.0.id', $vehicleRequest->id);

        $this->actingAs($seniorDeputy)
            ->patchJson("/api/senior-recommendations/vehicle-requests/{$vehicleRequest->id}", [
                'decision' => 'recommended',
                'department_priority' => 'high',
                'recommendation_notes' => 'Recommended for the official meeting.',
            ])
            ->assertOk();

        $this->assertDatabaseHas('vehicle_requests', [
            'id' => $vehicleRequest->id,
            'status' => 'recommended',
            'recommendation_status' => 'recommended',
            'recommended_by' => $seniorDeputy->id,
        ]);

        $this->actingAs($deputy)
            ->getJson('/api/approvals/vehicle-requests?status=pending')
            ->assertOk()
            ->assertJsonPath('data.requests.0.id', $vehicleRequest->id);
    }

    public function test_senior_deputy_cannot_recommend_an_employee_request(): void
    {
        $employee = User::factory()->create(['role' => 'employee']);
        $seniorDeputy = User::factory()->create(['role' => 'senior_deputy_secretary']);
        $vehicleRequest = VehicleRequest::create([
            'user_id' => $employee->id,
            'requester_name' => $employee->name,
            'purpose' => 'Meeting',
            'destination' => 'Galle',
            'departure_at' => '2026-08-10 09:00:00',
            'expected_return_at' => '2026-08-10 10:00:00',
            'passenger_count' => 1,
            'status' => 'submitted',
        ]);

        $this->actingAs($seniorDeputy)
            ->getJson("/api/senior-recommendations/vehicle-requests/{$vehicleRequest->id}")
            ->assertNotFound();

        $this->actingAs($seniorDeputy)
            ->patchJson("/api/senior-recommendations/vehicle-requests/{$vehicleRequest->id}", [
                'decision' => 'recommended',
            ])
            ->assertUnprocessable();
    }
}
