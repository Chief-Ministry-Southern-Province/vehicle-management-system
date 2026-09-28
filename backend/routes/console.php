<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('vehicles:send-licence-expiry-reminders')
    ->dailyAt('08:00')
    ->timezone(config('app.local_timezone'))
    ->withoutOverlapping(30);

Schedule::command('drivers:send-licence-expiry-reminders')
    ->dailyAt('08:00')
    ->timezone(config('app.local_timezone'))
    ->withoutOverlapping(30);
