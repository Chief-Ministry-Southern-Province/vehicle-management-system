<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    // Replace with your actual frontend URL(s) in production.
    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:5173'), // Vite default
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
