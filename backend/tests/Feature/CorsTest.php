<?php

namespace Tests\Feature;

use Closure;
use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;
use RuntimeException;
use Tests\TestCase;

class CorsTest extends TestCase
{
    private const FRONTEND_ORIGIN = 'https://frontend.example.test';

    protected function setUp(): void
    {
        parent::setUp();

        config([
            'cors.allowed_origins' => [self::FRONTEND_ORIGIN],
            'cors.supports_credentials' => true,
        ]);
    }

    public function test_preflight_request_allows_the_configured_frontend_origin(): void
    {
        $this->withHeaders([
            'Origin' => self::FRONTEND_ORIGIN,
            'Access-Control-Request-Method' => 'POST',
            'Access-Control-Request-Headers' => 'content-type',
        ])->options('/api/login')
            ->assertNoContent()
            ->assertHeader('Access-Control-Allow-Origin', self::FRONTEND_ORIGIN)
            ->assertHeader('Access-Control-Allow-Credentials', 'true');
    }

    public function test_early_rendered_api_exception_keeps_cors_headers_for_the_configured_origin(): void
    {
        $this->app->make(Kernel::class)->prependMiddleware(ThrowBeforeCorsMiddleware::class);

        $this->withHeader('Origin', self::FRONTEND_ORIGIN)
            ->getJson('/api/testing/cors-exception')
            ->assertInternalServerError()
            ->assertHeader('Access-Control-Allow-Origin', self::FRONTEND_ORIGIN)
            ->assertHeader('Access-Control-Allow-Credentials', 'true');
    }

    public function test_early_rendered_api_exception_does_not_echo_an_unknown_origin(): void
    {
        $this->app->make(Kernel::class)->prependMiddleware(ThrowBeforeCorsMiddleware::class);

        $response = $this->withHeader('Origin', 'https://untrusted.example.test')
            ->getJson('/api/testing/cors-exception')
            ->assertInternalServerError()
            ->assertHeader('Access-Control-Allow-Origin', self::FRONTEND_ORIGIN);

        $this->assertNotSame(
            'https://untrusted.example.test',
            $response->headers->get('Access-Control-Allow-Origin'),
        );
    }
}

class ThrowBeforeCorsMiddleware
{
    public function handle(Request $request, Closure $next): never
    {
        throw new RuntimeException('Deliberate early CORS test exception.');
    }
}
