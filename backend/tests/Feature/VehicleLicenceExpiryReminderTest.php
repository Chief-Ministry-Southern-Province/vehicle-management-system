<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Vehicle;
use App\Services\SmsService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Mockery;
use Tests\TestCase;

class VehicleLicenceExpiryReminderTest extends TestCase
{
    use RefreshDatabase;

    protected function tearDown(): void
    {
        Carbon::setTestNow();

        parent::tearDown();
    }

    public function test_due_revenue_licences_notify_active_fleet_officers_once_at_each_reminder_interval(): void
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
        $inactiveSubjectOfficer = User::factory()->create([
            'role' => 'subject_officer',
            'status' => 'inactive',
        ]);
        $secretary = User::factory()->create([
            'role' => 'secretary',
            'status' => 'active',
        ]);

        $this->makeVehicle('LIC-MONTH-001', '2026-10-28');
        $this->makeVehicle('LIC-WEEK-001', '2026-10-05');
        $this->makeVehicle('LIC-IGNORE-001', '2027-01-01', '2026-10-05');

        $sms = Mockery::mock(SmsService::class);
        $sms->shouldReceive('sendSms')
            ->times(4)
            ->withArgs(function (string $phone, string $message): bool {
                return in_array($phone, ['0771234567', '0771234568'], true)
                    && str_contains($message, 'VMS - Licence Alert:')
                    && str_contains($message, 'Please arrange renewal.')
                    && (str_contains($message, 'one month from today') || str_contains($message, 'one week from today'));
            })
            ->andReturnTrue();
        $this->app->instance(SmsService::class, $sms);

        $this->artisan('vehicles:send-licence-expiry-reminders')->assertSuccessful();
        $this->artisan('vehicles:send-licence-expiry-reminders')->assertSuccessful();

        $this->assertSame(2, $subjectOfficer->fresh()->notifications()->count());
        $this->assertSame(2, $assistantSecretary->fresh()->notifications()->count());
        $this->assertSame(0, $inactiveSubjectOfficer->fresh()->notifications()->count());
        $this->assertSame(0, $secretary->fresh()->notifications()->count());
        $this->assertDatabaseCount('vehicle_licence_expiry_reminders', 4);
        $this->assertDatabaseHas('vehicle_licence_expiry_reminders', [
            'vehicle_id' => Vehicle::query()->where('registration_number', 'LIC-MONTH-001')->value('id'),
            'user_id' => $subjectOfficer->id,
            'expiry_date' => '2026-10-28',
            'reminder_type' => 'one_month',
        ]);
        $this->assertDatabaseHas('vehicle_licence_expiry_reminders', [
            'vehicle_id' => Vehicle::query()->where('registration_number', 'LIC-WEEK-001')->value('id'),
            'user_id' => $assistantSecretary->id,
            'expiry_date' => '2026-10-05',
            'reminder_type' => 'one_week',
        ]);

        $messages = $subjectOfficer->fresh()->notifications->pluck('data.message');
        $this->assertTrue($messages->contains(fn (string $message): bool => str_contains($message, 'LIC-MONTH-001') && str_contains($message, 'one month from today')));
        $this->assertTrue($messages->contains(fn (string $message): bool => str_contains($message, 'LIC-WEEK-001') && str_contains($message, 'one week from today')));
    }

    private function makeVehicle(string $registrationNumber, string $revenueLicenceExpiry, ?string $registrationExpiry = null): Vehicle
    {
        return Vehicle::create([
            'registration_number' => $registrationNumber,
            'vehicle_type' => 'Van',
            'make' => 'Toyota',
            'model' => 'HiAce',
            'revenue_license_expiry' => $revenueLicenceExpiry,
            'registration_expiry' => $registrationExpiry,
            'status' => 'available',
            'fuel_level' => 0,
        ]);
    }
}
