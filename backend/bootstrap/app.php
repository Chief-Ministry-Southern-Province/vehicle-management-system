<?php

use App\Http\Middleware\RoleMiddleware;
use Fruitcake\Cors\CorsService;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Required for SPA cookie-based auth if you switch from token-only later.
        $middleware->statefulApi();

        // Register the alias used in routes: middleware('role:secretary')
        $middleware->alias([
            'role' => RoleMiddleware::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // A failure raised before HandleCors runs bypasses its normal response
        // decoration. Reapply the configured policy to those rendered API
        // errors so an allowed SPA can read the real HTTP error response.
        $exceptions->respond(function (Response $response, Throwable $exception, Request $request): Response {
            if (! $request->is('api/*') && ! $request->is('sanctum/csrf-cookie')) {
                return $response;
            }

            $cors = new CorsService(config('cors', []));

            return $cors->addActualRequestHeaders($response, $request);
        });
    })->create();
