<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class VehicleRequestGeocodingSearchTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_requester_can_choose_from_multiple_sri_lankan_place_matches(): void
    {
        Cache::flush();
        config()->set('services.geocoding.search_url', 'https://geocoding.test/search');
        config()->set('services.geocoding.search_limit', 8);
        config()->set('services.geocoding.user_agent', 'VMS-GOV tests');

        Http::fake([
            'https://geocoding.test/search*' => Http::response([
                [
                    'place_id' => 101,
                    'lat' => '6.165302',
                    'lon' => '80.201578',
                    'display_name' => 'Baddegama Bus Stand, Baddegama, Galle District, Southern Province, Sri Lanka',
                    'class' => 'amenity',
                    'type' => 'bus_station',
                ],
                [
                    'place_id' => 102,
                    'lat' => '6.166000',
                    'lon' => '80.202000',
                    'display_name' => 'Baddegama, Galle District, Southern Province, Sri Lanka',
                    'class' => 'place',
                    'type' => 'town',
                ],
                [
                    'place_id' => 103,
                    'lat' => '0',
                    'lon' => '0',
                    'display_name' => 'Outside Sri Lanka',
                    'class' => 'place',
                    'type' => 'town',
                ],
            ]),
        ]);

        $employee = User::factory()->create(['role' => 'employee', 'status' => 'active']);

        $this->actingAs($employee)->getJson('/api/vehicle-requests/geocode?query=Baddegama%20bus%20stand&language=en')
            ->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonCount(2, 'data.results')
            ->assertJsonPath('data.results.0.id', '101')
            ->assertJsonPath('data.results.0.label', 'Baddegama Bus Stand, Baddegama, Galle District, Southern Province, Sri Lanka')
            ->assertJsonPath('data.results.0.latitude', 6.165302)
            ->assertJsonPath('data.results.0.longitude', 80.201578)
            ->assertJsonPath('data.results.0.category', 'amenity')
            ->assertJsonPath('data.results.0.type', 'bus_station');

        Http::assertSent(function ($request): bool {
            parse_str((string) parse_url($request->url(), PHP_URL_QUERY), $query);

            return str_starts_with($request->url(), 'https://geocoding.test/search?')
                && $query === [
                    'q' => 'Baddegama bus stand, Sri Lanka',
                    'format' => 'jsonv2',
                    'countrycodes' => 'lk',
                    'limit' => '8',
                    'addressdetails' => '1',
                    'dedupe' => '1',
                    'namedetails' => '1',
                ]
                && $request->hasHeader('Accept-Language', 'en,en')
                && $request->hasHeader('User-Agent', 'VMS-GOV tests');
        });
    }

    public function test_location_search_requires_an_eligible_authenticated_requester_and_a_valid_query(): void
    {
        $this->getJson('/api/vehicle-requests/geocode?query=Baddegama')
            ->assertUnauthorized();

        $systemAdmin = User::factory()->create(['role' => 'system_admin', 'status' => 'active']);

        $this->actingAs($systemAdmin)->getJson('/api/vehicle-requests/geocode?query=Baddegama')
            ->assertForbidden();

        $employee = User::factory()->create(['role' => 'employee', 'status' => 'active']);

        $this->actingAs($employee)->getJson('/api/vehicle-requests/geocode?query=ab')
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['query']);

        Http::assertNothingSent();
    }

    public function test_location_search_returns_a_clear_error_when_the_provider_fails(): void
    {
        Cache::flush();
        config()->set('services.geocoding.search_url', 'https://geocoding.test/search');
        Http::fake([
            'https://geocoding.test/search*' => Http::response([], 503),
        ]);

        $employee = User::factory()->create(['role' => 'employee', 'status' => 'active']);

        $this->actingAs($employee)->getJson('/api/vehicle-requests/geocode?query=Baddegama')
            ->assertUnprocessable()
            ->assertJsonPath('success', false)
            ->assertJsonPath('message', 'A location search could not be completed.');
    }
}
