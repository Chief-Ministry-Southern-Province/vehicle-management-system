<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\VehicleRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeputySecretaryVehicleRequestWorkflowTest extends TestCase
{
    use RefreshDatabase;

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
