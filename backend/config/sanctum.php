<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Sanctum Configuration
    |--------------------------------------------------------------------------
    |
    | Configure Sanctum for stateless, token-based authentication.
    | This is used for SPA and mobile app authentication.
    |
    */

    'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', sprintf(
        '%s%s',
        'localhost,localhost:3000,localhost:8000,localhost:8080,127.0.0.1,127.0.0.1:8000,127.0.0.1:3000,127.0.0.1:8080',
        env('APP_URL') ? ','.parse_url(env('APP_URL'), PHP_URL_HOST) : ''
    ))),

    /*
    |--------------------------------------------------------------------------
    | Sanctum Guards
    |--------------------------------------------------------------------------
    |
    | This array contains the authentication guards that will be checked when
    | Sanctum is trying to authenticate requests. If none of these guards
    | are able to authenticate the request, the request is rejected.
    |
    */

    'guard' => ['web'],

    /*
    |--------------------------------------------------------------------------
    | Expiration Minutes
    |--------------------------------------------------------------------------
    |
    | This value controls the number of minutes until an issued token will be
    | considered expired. If this value is null, personal access tokens do
    | not expire. This won't tweak the lifetime of first-party sessions.
    |
    */

    'expiration' => null,

    /*
    |--------------------------------------------------------------------------
    | Token Prefix
    |--------------------------------------------------------------------------
    |
    | Sanctum can prefix new tokens with a given value to help identify tokens
    | issued by the application. This can make it easier to revoke or inspect
    | tokens when using tools like "grep". This won't affect revocation.
    |
    */

    'token_prefix' => env('SANCTUM_TOKEN_PREFIX', ''),

];
