<?php

namespace Tests\Feature;

use App\Models\Driver;
use App\Models\User;
use App\Services\SmsService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Mockery;
use Tests\TestCase;

class DriverLicenceExpiryReminderTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        Carbon::setTestNow();

        parent::tearDown();
    }

    public function test_due_driver_licences_notify_linked_drivers_and_active_fleet_officers_once_via_notifications_and_sms(): void
    {
        Carbon::setTestNow(Carbon::parse('2026-09-28 00:00:00', 'Asia/Colombo'));

        $subjectOfficer = User::factory()->create([
            'role' => 'subject_officer',
            'status' => 'active',
            'phone' => '0771234567',
        ]);
        $assistantSecretary = User::factory()->create([
            'role' => 'deputy_secretary',
            'status' => 'active',
            'phone' => '0771234568',
        ]);
        $inactiveAssistantSecretary = User::factory()->create([
            'role' => 'deputy_secretary',
            'status' => 'inactive',
        ]);
        $monthDriverUser = User::factory()->create([
            'role' => 'driver',
            'status' => 'active',
            'employee_id' => 'NIC-DRV-MONTH-001',
            'phone' => '0771234569',
        ]);
        $weekDriverUser = User::factory()->create([
            'role' => 'driver',
            'status' => 'active',
            'employee_id' => 'NIC-DRV-WEEK-001',
            'phone' => '0771234570',
        ]);
        $this->makeDriver('DRV-MONTH-001', '2026-10-28');
        $this->makeDriver('DRV-WEEK-001', '2026-10-05');
        $this->makeDriver('DRV-IGNORE-001', '2027-01-01');

        $sms = Mockery::mock(SmsService::class);
        $sms->shouldReceive('sendSms')
            ->twice()
            ->withArgs(function (string $phone, string $message): bool {
                return $phone === '0771234567'
                    && str_contains($message, 'VMS - Licence Alert:')
                    && str_contains($message, 'Please arrange renewal.')
                    && (str_contains($message, 'one month from today') || str_contains($message, 'one week from today'));
            })
            ->andReturnTrue();
        $sms->shouldReceive('sendSms')
            ->twice()
            ->withArgs(fn (string $phone, string $message): bool => $phone === '0771234568'
                && str_contains($message, 'VMS - Licence Alert:')
                && str_contains($message, 'Please arrange renewal.'))
            ->andReturnTrue();
        $sms->shouldReceive('sendSms')
            ->once()
            ->withArgs(fn (string $phone, string $message): bool => $phone === '0771234569'
                && str_contains($message, 'DRV-MONTH-001')
                && str_contains($message, 'one month from today'))
            ->andReturnTrue();
        $sms->shouldReceive('sendSms')
            ->once()
            ->withArgs(fn (string $phone, string $message): bool => $phone === '0771234570'
                && str_contains($message, 'DRV-WEEK-001')
                && str_contains($message, 'one week from today'))
            ->andReturnTrue();
        $this->app->instance(SmsService::class, $sms);

        $this->artisan('drivers:send-licence-expiry-reminders')->assertSuccessful();
        $this->artisan('drivers:send-licence-expiry-reminders')->assertSuccessful();

        $this->assertSame(2, $subjectOfficer->fresh()->notifications()->count());
        $this->assertSame(2, $assistantSecretary->fresh()->notifications()->count());
        $this->assertSame(0, $inactiveAssistantSecretary->fresh()->notifications()->count());
        $this->assertSame(1, $monthDriverUser->fresh()->notifications()->count());
        $this->assertSame(1, $weekDriverUser->fresh()->notifications()->count());
        $this->assertDatabaseCount('driver_licence_expiry_reminders', 6);
        $this->assertDatabaseHas('driver_licence_expiry_reminders', [
            'driver_id' => Driver::query()->where('driver_id', 'DRV-MONTH-001')->value('id'),
            'user_id' => $subjectOfficer->id,
            'expiry_date' => '2026-10-28',
            'reminder_type' => 'one_month',
        ]);
        $this->assertDatabaseHas('driver_licence_expiry_reminders', [
            'driver_id' => Driver::query()->where('driver_id', 'DRV-WEEK-001')->value('id'),
            'user_id' => $assistantSecretary->id,
            'expiry_date' => '2026-10-05',
            'reminder_type' => 'one_week',
        ]);
        $this->assertDatabaseHas('driver_licence_expiry_reminders', [
            'driver_id' => Driver::query()->where('driver_id', 'DRV-MONTH-001')->value('id'),
            'user_id' => $monthDriverUser->id,
            'expiry_date' => '2026-10-28',
            'reminder_type' => 'one_month',
        ]);
        $this->assertDatabaseHas('driver_licence_expiry_reminders', [
            'driver_id' => Driver::query()->where('driver_id', 'DRV-WEEK-001')->value('id'),
            'user_id' => $weekDriverUser->id,
            'expiry_date' => '2026-10-05',
            'reminder_type' => 'one_week',
        ]);

        $messages = $subjectOfficer->fresh()->notifications->pluck('data.message');
        $this->assertTrue($messages->contains(fn (string $message): bool => str_contains($message, 'DRV-MONTH-001') && str_contains($message, 'one month from today')));
        $this->assertTrue($messages->contains(fn (string $message): bool => str_contains($message, 'DRV-WEEK-001') && str_contains($message, 'one week from today')));
    }

    private function makeDriver(string $driverId, string $licenceRenewalDate): Driver
    {
        return Driver::create([
            'driver_id' => $driverId,
            'full_name' => "Driver {$driverId}",
            'date_of_birth' => '1990-01-01',
            'nic' => "NIC-{$driverId}",
            'address' => 'Test Road',
            'contact_number' => '0771234567',
            'licence_number' => "LIC-{$driverId}",
            'licence_type' => 'B',
            'licence_renewal_date' => $licenceRenewalDate,
            'status' => 'active',
        ]);
    }
}
