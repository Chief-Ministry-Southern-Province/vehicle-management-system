<?php

$frontendUrl = env('FRONTEND_URL', 'http://localhost:5174/vms');
$frontendScheme = parse_url($frontendUrl, PHP_URL_SCHEME);
$frontendHost = parse_url($frontendUrl, PHP_URL_HOST);
$frontendPort = parse_url($frontendUrl, PHP_URL_PORT);

// The browser's Origin header never contains the SPA's deployment path.
$frontendOrigin = $frontendScheme && $frontendHost
    ? $frontendScheme.'://'.$frontendHost.($frontendPort ? ':'.$frontendPort : '')
    : rtrim($frontendUrl, '/');

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Replace with your actual frontend URL(s) in production.
    'allowed_origins' => [
        $frontendOrigin,
        'http://localhost:3000',
        'https://vehicle-management-system-lilac-alpha.vercel.app',                     // CRA default, if used instead
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // Must be true so cookies/credentials can flow if you ever
    // switch to Sanctum's SPA cookie auth mode.
    'supports_credentials' => true,

];
