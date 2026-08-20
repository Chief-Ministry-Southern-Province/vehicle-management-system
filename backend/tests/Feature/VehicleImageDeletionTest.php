<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Vehicle;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Tests\TestCase;

class VehicleImageDeletionTest extends TestCase
{
    use RefreshDatabase;

    private array $createdImagePaths = [];

    protected function tearDown(): void
    {
        foreach ($this->createdImagePaths as $path) {
            File::delete(public_path($path));
        }

        parent::tearDown();
    }

    public function test_subject_officer_can_delete_a_persisted_vehicle_image(): void
    {
        $deletedPath = $this->createImageFile();
        $keptPath = $this->createImageFile();
        $vehicle = $this->createVehicle([
            'image_path' => $deletedPath,
            'image_paths' => [$keptPath],
        ]);
        $subjectOfficer = User::factory()->create([
            'role' => 'subject_officer',
            'status' => 'active',
        ]);

        $this->actingAs($subjectOfficer)
            ->post("/api/vehicles/{$vehicle->registration_number}", [
                ...$this->updatePayload($vehicle),
                'removed_image_paths' => [$deletedPath],
            ])
            ->assertOk()
            ->assertJsonPath('data.vehicle.image_path', null)
            ->assertJsonPath('data.vehicle.image_paths', [$keptPath]);

        $this->assertTrue(File::exists(public_path($keptPath)));
        $this->assertFalse(File::exists(public_path($deletedPath)));
        $this->assertSame([$keptPath], $vehicle->fresh()->image_paths);
    }

    public function test_non_subject_officer_cannot_delete_a_vehicle_image(): void
    {
        $imagePath = $this->createImageFile();
        $vehicle = $this->createVehicle(['image_path' => $imagePath]);
        $deputySecretary = User::factory()->create([
            'role' => 'deputy_secretary',
            'status' => 'active',
        ]);

        $this->actingAs($deputySecretary)
            ->post("/api/vehicles/{$vehicle->registration_number}", [
                ...$this->updatePayload($vehicle),
                'removed_image_paths' => [$imagePath],
            ])
            ->assertForbidden();

        $this->assertTrue(File::exists(public_path($imagePath)));
        $this->assertSame($imagePath, $vehicle->fresh()->image_path);
    }

    public function test_vehicle_image_deletion_requires_authentication(): void
    {
        $imagePath = $this->createImageFile();
        $vehicle = $this->createVehicle(['image_path' => $imagePath]);

        $this->postJson("/api/vehicles/{$vehicle->registration_number}", [
            ...$this->updatePayload($vehicle),
            'removed_image_paths' => [$imagePath],
        ])->assertUnauthorized();

        $this->assertTrue(File::exists(public_path($imagePath)));
        $this->assertSame($imagePath, $vehicle->fresh()->image_path);
    }

    private function createVehicle(array $attributes = []): Vehicle
    {
        return Vehicle::create([
            'registration_number' => 'IMG-'.Str::upper(Str::random(6)),
            'vehicle_type' => 'Car',
            'make' => 'Toyota',
            'model' => 'Corolla',
            'status' => 'available',
            'fuel_level' => 50,
            ...$attributes,
        ]);
    }

    private function updatePayload(Vehicle $vehicle): array
    {
        return [
            'registration_number' => $vehicle->registration_number,
            'vehicle_type' => $vehicle->vehicle_type,
            'make' => $vehicle->make,
            'model' => $vehicle->model,
            'status' => $vehicle->status,
            'fuel_level' => $vehicle->fuel_level,
        ];
    }

    private function createImageFile(): string
    {
        $path = 'vehicle-images/test-'.Str::uuid().'.jpg';
        File::ensureDirectoryExists(dirname(public_path($path)));
        File::put(public_path($path), 'test image');
        $this->createdImagePaths[] = $path;

        return $path;
    }
}
