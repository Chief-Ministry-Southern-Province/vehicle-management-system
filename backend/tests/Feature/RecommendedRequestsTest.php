<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\VehicleRequest;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RecommendedRequestsTest extends TestCase
{
    use RefreshDatabase;

    public function test_recommended_requests_include_the_requester_profile_picture_path(): void
    {
        $subjectOfficer = User::factory()->create([
            'role' => 'subject_officer',
            'status' => 'active',
        ]);
        $requester = User::factory()->create([
            'role' => 'employee',
            'profile_picture_path' => 'profile-pictures/recommended-requester.png',
        ]);
        $request = VehicleRequest::create([
            'user_id' => $requester->id,
            'requester_name' => $requester->name,
            'purpose' => 'Official meeting',
            'destination' => 'Galle',
            'departure_at' => '2026-08-10 09:00:00',
            'expected_return_at' => '2026-08-10 12:00:00',
            'passenger_count' => 1,
            'status' => 'recommended',
            'recommendation_status' => 'recommended',
        ]);

        $this->actingAs($subjectOfficer)
            ->getJson('/api/recommended-requests')
            ->assertOk()
            ->assertJsonPath('data.requests.0.id', $request->id)
            ->assertJsonPath('data.requests.0.user.profile_picture_path', $requester->profile_picture_path);
    }
}
