<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleLicenceExpiryReminder;
use App\Services\WorkflowNotificationService;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class SendVehicleLicenceExpiryReminders extends Command
{
    protected $signature = 'vehicles:send-licence-expiry-reminders';

    protected $description = 'Send due revenue-licence expiry reminders to fleet officers.';

    public function __construct(private readonly WorkflowNotificationService $notifications)
    {
        parent::__construct();
    }

    public function handle(): int
    {
        $today = now(config('app.local_timezone'))->startOfDay();
        $recipients = User::query()
            ->whereIn('role', ['subject_officer', 'deputy_secretary'])
            ->where('status', 'active')
            ->get();

        if ($recipients->isEmpty()) {
            $this->info('No active Subject Officers or Assistant/Deputy Secretaries to notify.');

            return self::SUCCESS;
        }

        $sent = 0;

        foreach ($this->reminderDates($today) as $reminder) {
            Vehicle::query()
                ->whereDate('revenue_license_expiry', $reminder['date']->toDateString())
                ->orderBy('id')
                ->chunkById(100, function (Collection $vehicles) use ($recipients, $reminder, &$sent): void {
                    foreach ($vehicles as $vehicle) {
                        $sent += $this->sendReminder($vehicle, $recipients, $reminder);
                    }
                });
        }

        $this->info("Sent {$sent} vehicle revenue-licence expiry reminder(s).");

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
    private function sendReminder(Vehicle $vehicle, Collection $recipients, array $reminder): int
    {
        return DB::transaction(function () use ($vehicle, $recipients, $reminder): int {
            $timestamp = now();
            $newRecipients = $recipients->filter(function (User $recipient) use ($vehicle, $reminder, $timestamp): bool {
                return VehicleLicenceExpiryReminder::query()->insertOrIgnore([
                    'vehicle_id' => $vehicle->id,
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

            $this->notifications->vehicleLicenceExpiryReminder(
                $vehicle,
                $reminder['label'],
                $reminder['date'],
                $newRecipients,
            );

            return $newRecipients->count();
        });
    }
}
