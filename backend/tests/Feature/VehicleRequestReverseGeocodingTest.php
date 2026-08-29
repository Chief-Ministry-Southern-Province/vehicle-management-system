<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class VehicleRequestReverseGeocodingTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_requester_can_resolve_a_selected_map_point_to_an_address(): void
    {
        config()->set('services.geocoding.reverse_url', 'https://geocoding.test/reverse');
        config()->set('services.geocoding.user_agent', 'VMS-GOV tests');

        Http::fake([
            'https://geocoding.test/reverse*' => Http::response([
                'display_name' => 'Kurunegala M.C. Limit, Kurunegala District, North Western Province, Sri Lanka',
            ]),
        ]);

        $employee = User::factory()->create(['role' => 'employee', 'status' => 'active']);

        $this->actingAs($employee)->getJson('/api/vehicle-requests/reverse-geocode?latitude=7.474109&longitude=80.369114&language=en')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.address', 'Kurunegala M.C. Limit, Kurunegala District, North Western Province, Sri Lanka');

        Http::assertSent(fn ($request): bool => $request->url() === 'https://geocoding.test/reverse?lat=7.474109&lon=80.369114&format=jsonv2&zoom=18&addressdetails=1'
            && $request->hasHeader('Accept-Language', 'en,en')
            && $request->hasHeader('User-Agent', 'VMS-GOV tests'));
    }

    public function test_reverse_geocoding_requires_authentication_and_valid_sri_lankan_coordinates(): void
    {
        $this->getJson('/api/vehicle-requests/reverse-geocode?latitude=7.474109&longitude=80.369114')
            ->assertUnauthorized();

        $employee = User::factory()->create(['role' => 'employee', 'status' => 'active']);

        $this->actingAs($employee)->getJson('/api/vehicle-requests/reverse-geocode?latitude=0&longitude=0')
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['latitude', 'longitude']);

        Http::assertNothingSent();
    }

    public function test_reverse_geocoding_returns_a_clear_error_when_the_provider_fails(): void
    {
        config()->set('services.geocoding.reverse_url', 'https://geocoding.test/reverse');
        Http::fake([
            'https://geocoding.test/reverse*' => Http::response([], 503),
        ]);

        $employee = User::factory()->create(['role' => 'employee', 'status' => 'active']);

        $this->actingAs($employee)->getJson('/api/vehicle-requests/reverse-geocode?latitude=7.474109&longitude=80.369114')
            ->assertUnprocessable()
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'A readable address could not be found for the selected location.');
    }
}
