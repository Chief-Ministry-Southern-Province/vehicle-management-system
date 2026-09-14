<?php

namespace Tests\Feature;

use App\Models\PredefinedJourney;
use App\Models\User;
use App\Services\WorkflowNotificationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PredefinedJourneyTest extends TestCase
{
    use RefreshDatabase;

    public function test_system_admin_can_manage_predefined_journeys_and_users_can_list_them(): void
    {
        $systemAdmin = User::factory()->create(['role' => 'system_admin', 'status' => 'active']);
        $employee = User::factory()->create(['role' => 'employee', 'status' => 'active']);

        $created = $this->actingAs($systemAdmin)->postJson('/api/predefined-journeys', [
            'name' => 'Galle to Colombo Secretariat',
            'starting_location' => 'Dakshinapaya, Galle',
            'destination' => 'Colombo Secretariat',
            'distance_km' => 125.5,
        ])->assertCreated()
            ->assertJsonPath('data.journey.name', 'Galle to Colombo Secretariat');

        $journeyId = $created->json('data.journey.id');

        $this->actingAs($employee)->getJson('/api/predefined-journeys')
            ->assertOk()
            ->assertJsonPath('data.journeys.0.id', $journeyId);

        $this->actingAs($employee)->postJson('/api/predefined-journeys', [
            'name' => 'Unauthorised route',
            'starting_location' => 'Galle',
            'destination' => 'Matara',
            'distance_km' => 45,
        ])->assertForbidden();
    }

    public function test_request_uses_the_saved_journey_locations_and_manual_distance(): void
    {
        $employee = User::factory()->create(['role' => 'employee', 'status' => 'active']);
        $journey = PredefinedJourney::create([
            'name' => 'Official Galle to Colombo route',
            'starting_location' => 'Dakshinapaya, Galle',
            'destination' => 'Colombo Secretariat',
            'distance_km' => 125.5,
            'created_by' => User::factory()->create(['role' => 'system_admin', 'status' => 'active'])->id,
        ]);

        $this->mock(WorkflowNotificationService::class, function ($mock): void {
            $mock->shouldReceive('requestSubmitted')->once();
        });

        $this->actingAs($employee)->postJson('/api/vehicle-requests', [
            'purpose' => 'Official meeting',
            'predefined_journey_id' => $journey->id,
            'starting_location' => 'Spoofed location',
            'destination' => 'Spoofed destination',
            'departure_at' => '2026-10-01T09:00',
            'expected_return_at' => '2026-10-01T17:00',
            'passenger_count' => 2,
        ])->assertCreated()
            ->assertJsonPath('data.vehicle_request.starting_location', 'Dakshinapaya, Galle')
            ->assertJsonPath('data.vehicle_request.destination', 'Colombo Secretariat')
            ->assertJsonPath('data.vehicle_request.distance_km', 125.5);

        $this->assertDatabaseHas('vehicle_requests', [
            'predefined_journey_id' => $journey->id,
            'starting_location' => 'Dakshinapaya, Galle',
            'destination' => 'Colombo Secretariat',
            'distance_km' => 125.5,
        ]);
    }
}
