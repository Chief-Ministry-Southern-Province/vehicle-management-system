<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\VehicleRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DepartmentOfficerVehicleRequestWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_department_officer_request_is_recommended_only_by_deputy_secretary(): void
    {
        $requester = User::factory()->create([
            'role' => 'department_officer',
            'department' => 'IT',
            'status' => 'active',
        ]);
        $departmentOfficer = User::factory()->create([
            'role' => 'department_officer',
            'department' => 'IT',
            'status' => 'active',
        ]);
        $deputySecretary = User::factory()->create([
            'role' => 'deputy_secretary',
            'department' => 'Secretariat',
            'status' => 'active',
        ]);

        $this->actingAs($requester)
            ->postJson('/api/vehicle-requests', [
                'purpose' => 'Official inspection',
                'destination' => 'Matara',
                'departure_at' => '2026-08-01 09:00',
                'expected_return_at' => '2026-08-01 12:00',
                'passenger_count' => 1,
            ])
            ->assertCreated();

        $vehicleRequest = VehicleRequest::firstOrFail();

        $this->actingAs($departmentOfficer)
            ->getJson('/api/department/vehicle-requests?status=pending')
            ->assertOk()
            ->assertJsonCount(0, 'data.requests');

        $this->actingAs($departmentOfficer)
            ->patchJson("/api/department/vehicle-requests/{$vehicleRequest->id}/recommendation", [
                'decision' => 'recommended',
            ])
            ->assertNotFound();

        $this->actingAs($deputySecretary)
            ->getJson('/api/approvals/vehicle-requests?status=pending')
            ->assertOk()
            ->assertJsonPath('data.requests.0.id', $vehicleRequest->id);

        $this->actingAs($deputySecretary)
            ->patchJson("/api/approvals/vehicle-requests/{$vehicleRequest->id}/recommendation", [
                'decision' => 'recommended',
                'department_priority' => 'high',
            ])
            ->assertOk();

        $this->assertDatabaseHas('vehicle_requests', [
            'id' => $vehicleRequest->id,
            'status' => 'recommended',
            'recommendation_status' => 'recommended',
            'recommended_by' => $deputySecretary->id,
        ]);
    }

    public function test_deputy_secretary_cannot_recommend_an_employee_request(): void
    {
        $employee = User::factory()->create(['role' => 'employee']);
        $deputySecretary = User::factory()->create(['role' => 'deputy_secretary']);
        $vehicleRequest = VehicleRequest::create([
            'user_id' => $employee->id,
            'requester_name' => $employee->name,
            'purpose' => 'Meeting',
            'destination' => 'Galle',
            'departure_at' => '2026-08-01 09:00:00',
            'expected_return_at' => '2026-08-01 10:00:00',
            'passenger_count' => 1,
            'status' => 'submitted',
        ]);

        $this->actingAs($deputySecretary)
            ->patchJson("/api/approvals/vehicle-requests/{$vehicleRequest->id}/recommendation", [
                'decision' => 'recommended',
            ])
            ->assertUnprocessable();
    }
}
