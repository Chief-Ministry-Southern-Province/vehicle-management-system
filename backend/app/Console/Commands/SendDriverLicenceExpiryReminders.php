<?php

namespace App\Console\Commands;

use App\Models\Driver;
use App\Models\DriverLicenceExpiryReminder;
use App\Models\User;
use App\Services\WorkflowNotificationService;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class SendDriverLicenceExpiryReminders extends Command
{
    protected $signature = 'drivers:send-licence-expiry-reminders';

    protected $description = 'Send due driver-licence expiry reminders to drivers and fleet officers.';

    public function __construct(private readonly WorkflowNotificationService $notifications)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $today = now(config('app.local_timezone'))->startOfDay();
        $fleetRecipients = User::query()
            ->whereIn('role', ['subject_officer', 'deputy_secretary'])
            ->where('status', 'active')
            ->get();

        $sent = 0;

        foreach ($this->reminderDates($today) as $reminder) {
            Driver::query()
                ->whereDate('licence_renewal_date', $reminder['date']->toDateString())
                ->orderBy('id')
                ->with('user')
                ->chunkById(100, function (Collection $drivers) use ($fleetRecipients, $reminder, &$sent): void {
                    foreach ($drivers as $driver) {
                        $sent += $this->sendReminder($driver, $fleetRecipients, $reminder);
                    }
                });
        }

        $this->info("Sent {$sent} driver-licence expiry reminder(s).");

        return self::SUCCESS;
    }

    /**
     * @return array<int, array{type: string, label: string, date: Carbon}>
     */
    private function reminderDates(Carbon $today): array
    {
        return [
            [
                'type' => 'one_month',
                'label' => 'one month',
                'date' => $today->copy()->addMonthNoOverflow(),
            ],
            [
                'type' => 'one_week',
                'label' => 'one week',
                'date' => $today->copy()->addWeek(),
            ],
        ];
    }

    /**
     * @param  Collection<int, User>  $recipients
     * @param  array{type: string, label: string, date: Carbon}  $reminder
     */
    private function sendReminder(Driver $driver, Collection $recipients, array $reminder): int
    {
        $recipients = $recipients
            ->merge(collect([$driver->user])->filter(fn ($user): bool => $user instanceof User && $user->isDriver() && $user->isActive()))
            ->unique('id')
            ->values();

        return DB::transaction(function () use ($driver, $recipients, $reminder): int {
            $timestamp = now();
            $newRecipients = $recipients->filter(function (User $recipient) use ($driver, $reminder, $timestamp): bool {
                return DriverLicenceExpiryReminder::query()->insertOrIgnore([
                    'driver_id' => $driver->id,
                    'user_id' => $recipient->id,
                    'expiry_date' => $reminder['date']->toDateString(),
                    'reminder_type' => $reminder['type'],
                    'notified_at' => $timestamp,
                    'created_at' => $timestamp,
                    'updated_at' => $timestamp,
                ]) === 1;
            })->values();

            if ($newRecipients->isEmpty()) {
                return 0;
            }

            $this->notifications->driverLicenceExpiryReminder(
                $driver,
                $reminder['label'],
                $reminder['date'],
                $newRecipients,
            );

            return $newRecipients->count();
        });
    }
}
