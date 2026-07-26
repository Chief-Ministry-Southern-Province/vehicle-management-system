<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\VehicleRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class VehicleRequestRecommendationTest extends TestCase
{
    use RefreshDatabase;

    public function test_recommendation_updates_audit_time_without_changing_requested_trip_times(): void
    {
        Carbon::setTestNow('2026-07-25 10:00:00');

        $employee = User::factory()->create([
            'department' => 'IT',
            'role' => 'employee',
            'status' => 'active',
        ]);
        $officer = User::factory()->create([
            'department' => 'IT',
            'role' => 'department_officer',
            'status' => 'active',
        ]);

        $vehicleRequest = VehicleRequest::create([
            'user_id' => $employee->id,
            'requester_name' => $employee->name,
            'purpose' => 'Annual General Meeting',
            'destination' => 'Administrative Office, Matara',
            'departure_at' => '2026-07-25 11:30:00',
            'expected_return_at' => '2026-07-25 14:30:00',
            'passenger_count' => 1,
            'status' => 'submitted',
        ]);
        $originalUpdatedAt = $vehicleRequest->updated_at;

        Carbon::setTestNow('2026-07-25 10:01:00');

        $this->actingAs($officer)
            ->patchJson("/api/department/vehicle-requests/{$vehicleRequest->id}/recommendation", [
                'decision' => 'recommended',
                'department_priority' => 'medium',
            ])
            ->assertOk()
            ->assertJsonPath('data.vehicle_request.departure_at', '2026-07-25T11:30:00.000000Z')
            ->assertJsonPath('data.vehicle_request.expected_return_at', '2026-07-25T14:30:00.000000Z');

        $vehicleRequest->refresh();

        $this->assertSame('2026-07-25 11:30:00', $vehicleRequest->getRawOriginal('departure_at'));
        $this->assertSame('2026-07-25 14:30:00', $vehicleRequest->getRawOriginal('expected_return_at'));
        $this->assertTrue($vehicleRequest->updated_at->greaterThan($originalUpdatedAt));
        $this->assertSame('2026-07-25 10:01:00', $vehicleRequest->updated_at->format('Y-m-d H:i:s'));

        $deputySecretary = User::factory()->create([
            'role' => 'deputy_secretary',
            'status' => 'active',
        ]);

        $this->actingAs($deputySecretary)
            ->getJson('/api/approvals/department-recommendations')
            ->assertOk()
            ->assertJsonPath('data.requests.0.id', $vehicleRequest->id)
            ->assertJsonPath('data.requests.0.recommender.id', $officer->id)
            ->assertJsonPath('data.requests.0.recommendation_status', 'recommended');
    }
}
