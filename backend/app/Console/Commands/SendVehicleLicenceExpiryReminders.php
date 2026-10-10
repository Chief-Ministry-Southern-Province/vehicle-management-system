<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Vehicle;
use App\Models\VehicleInsuranceExpiryReminder;
use App\Models\VehicleLicenceExpiryReminder;
use App\Services\WorkflowNotificationService;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class SendVehicleLicenceExpiryReminders extends Command
{
    protected $signature = 'vehicles:send-licence-expiry-reminders';

    protected $description = 'Send due vehicle revenue-licence and insurance expiry reminders to fleet officers.';

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
            $sent += $this->sendDueReminders(
                'revenue_license_expiry',
                VehicleLicenceExpiryReminder::class,
                false,
                $recipients,
                $reminder,
            );
            $sent += $this->sendDueReminders(
                'insurance_expiry',
                VehicleInsuranceExpiryReminder::class,
                true,
                $recipients,
                $reminder,
            );
        }

        $this->info("Sent {$sent} vehicle compliance-expiry reminder(s).");

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
     * @param  class-string<VehicleLicenceExpiryReminder|VehicleInsuranceExpiryReminder>  $reminderModel
     * @param  Collection<int, User>  $recipients
     * @param  array{type: string, label: string, date: Carbon}  $reminder
     */
    private function sendDueReminders(
        string $expiryColumn,
        string $reminderModel,
        bool $isInsurance,
        Collection $recipients,
        array $reminder,
    ): int {
        $sent = 0;

        Vehicle::query()
            ->whereDate($expiryColumn, $reminder['date']->toDateString())
            ->orderBy('id')
            ->chunkById(100, function (Collection $vehicles) use ($reminderModel, $isInsurance, $recipients, $reminder, &$sent): void {
                foreach ($vehicles as $vehicle) {
                    $sent += $this->sendReminder($vehicle, $recipients, $reminder, $reminderModel, $isInsurance);
                }
            });

        return $sent;
    }

    /**
     * @param  Collection<int, User>  $recipients
     * @param  array{type: string, label: string, date: Carbon}  $reminder
     * @param  class-string<VehicleLicenceExpiryReminder|VehicleInsuranceExpiryReminder>  $reminderModel
     */
    private function sendReminder(
        Vehicle $vehicle,
        Collection $recipients,
        array $reminder,
        string $reminderModel,
        bool $isInsurance,
    ): int {
        return DB::transaction(function () use ($vehicle, $recipients, $reminder, $reminderModel, $isInsurance): int {
            $timestamp = now();
            $newRecipients = $recipients->filter(function (User $recipient) use ($vehicle, $reminder, $reminderModel, $timestamp): bool {
                return $reminderModel::query()->insertOrIgnore([
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

            if ($isInsurance) {
                $this->notifications->vehicleInsuranceExpiryReminder(
                    $vehicle,
                    $reminder['label'],
                    $reminder['date'],
                    $newRecipients,
                );
            } else {
                $this->notifications->vehicleLicenceExpiryReminder(
                    $vehicle,
                    $reminder['label'],
                    $reminder['date'],
                    $newRecipients,
                );
            }

            return $newRecipients->count();
        });
    }
}
