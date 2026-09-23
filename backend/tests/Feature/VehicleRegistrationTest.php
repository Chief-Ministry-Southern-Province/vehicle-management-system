<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class VehicleRegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_subject_officer_can_register_a_vehicle_with_a_custom_type(): void
    {
        $subjectOfficer = User::factory()->create([
            'role' => 'subject_officer',
            'status' => 'active',
        ]);

        $this->actingAs($subjectOfficer)
            ->postJson('/api/vehicles', [
                'registration_number' => 'CUSTOM-TYPE-001',
                'vehicle_type' => 'Ambulance',
                'make' => 'Toyota',
                'model' => 'HiAce',
                'status' => 'available',
                'fuel_level' => 0,
            ])
            ->assertCreated()
            ->assertJsonPath('data.vehicle.vehicle_type', 'Ambulance');

        $this->assertDatabaseHas('vehicles', [
            'registration_number' => 'CUSTOM-TYPE-001',
            'vehicle_type' => 'Ambulance',
        ]);
    }
}
