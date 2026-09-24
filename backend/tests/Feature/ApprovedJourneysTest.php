<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\VehicleRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ApprovedJourneysTest extends TestCase
{
    use RefreshDatabase;

    public function test_approved_journeys_include_the_requester_profile_picture_path(): void
    {
        $subjectOfficer = User::factory()->create([
            'role' => 'subject_officer',
            'status' => 'active',
        ]);
        $requester = User::factory()->create([
            'role' => 'employee',
            'profile_picture_path' => 'profile-pictures/approved-journey-requester.png',
        ]);
        $journey = VehicleRequest::create([
            'user_id' => $requester->id,
            'requester_name' => $requester->name,
            'purpose' => 'Official meeting',
            'destination' => 'Galle',
            'departure_at' => '2026-08-10 09:00:00',
            'expected_return_at' => '2026-08-10 12:00:00',
            'passenger_count' => 1,
            'status' => 'approved',
            'approved_at' => '2026-08-01 10:00:00',
        ]);

        $this->actingAs($subjectOfficer)
            ->getJson('/api/approved-journeys')
            ->assertOk()
            ->assertJsonPath('data.requests.0.id', $journey->id)
            ->assertJsonPath('data.requests.0.user.profile_picture_path', $requester->profile_picture_path);
    }
}
