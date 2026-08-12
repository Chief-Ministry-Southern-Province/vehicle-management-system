<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\Http;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Http::preventStrayRequests();
        Http::fake([
            '*/route/v1/driving/*' => Http::response([
                'code' => 'Ok',
                'routes' => [[
                    'distance' => 104500,
                    'duration' => 7200,
                    'geometry' => ['type' => 'LineString', 'coordinates' => [[80.22, 6.0535], [80.0, 6.5], [79.8612, 6.9271]]],
                ]],
            ]),
        ]);
    }
}
