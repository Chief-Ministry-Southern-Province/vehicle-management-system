<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'directions' => [
        'url' => env('DIRECTIONS_API_URL', 'https://router.project-osrm.org'),
        'profile' => env('DIRECTIONS_PROFILE', 'driving'),
        'timeout' => (int) env('DIRECTIONS_TIMEOUT', 15),
    ],

    'geocoding' => [
        'reverse_url' => env('GEOCODING_REVERSE_API_URL', 'https://nominatim.openstreetmap.org/reverse'),
        'timeout' => (int) env('GEOCODING_TIMEOUT', 10),
        'user_agent' => env('GEOCODING_USER_AGENT', 'VMS-GOV/1.0 ('.env('APP_URL', 'http://localhost').')'),
    ],

    'textit' => [
        'enabled' => env('TEXTIT_ENABLED', false),
        'api_key' => env('TEXTIT_API_KEY'),
        'endpoint' => env('TEXTIT_ENDPOINT', 'https://api.textit.biz/'),
        'api_version' => env('TEXTIT_API_VERSION', 'v1'),
        'id' => env('TEXTIT_USER_ID'),
        'pw' => env('TEXTIT_PASSWORD'),
        'url' => env('TEXTIT_URL', 'https://textit.biz/sendmsg/'),
        'timeout' => (int) env('TEXTIT_TIMEOUT', 15),
        'retry_attempts' => (int) env('TEXTIT_RETRY_ATTEMPTS', 3),
        'retry_delay_ms' => (int) env('TEXTIT_RETRY_DELAY_MS', 500),
    ],

];
