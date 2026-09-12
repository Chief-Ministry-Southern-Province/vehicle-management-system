<?php

namespace App\Services;

use App\Models\User;
use App\Models\VehicleRequest;
use App\Notifications\WorkflowNotification;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Str;

class WorkflowNotificationService
{
    public function __construct(private readonly SmsService $smsService) {}

    public function send(iterable|User|null $recipients, string $title, string $message, ?VehicleRequest $vehicleRequest = null): void
    {
        $recipients = $recipients instanceof User ? collect([$recipients]) : collect($recipients);

        $recipients->filter(fn ($user) => $user instanceof User && $user->isActive())
            ->unique('id')
            ->each(function (User $user) use ($title, $message, $vehicleRequest): void {
                $user->notify(new WorkflowNotification([
                    'title' => $title,
                    'message' => $message,
                    'vehicle_request_id' => $vehicleRequest?->id,
                    'reference' => $vehicleRequest ? 'REQ-'.str_pad((string) $vehicleRequest->id, 4, '0', STR_PAD_LEFT) : null,
                ]));

                // Gateway delivery is supplementary. A provider outage must not undo
                // the durable in-app workflow notification or its completed transition.
                $this->smsService->sendSms($user->phone, $this->smsMessage($title, $message, $vehicleRequest));
            });
    }

    public function requestSubmitted(VehicleRequest $vehicleRequest): void
    {
        $requester = $vehicleRequest->user;
        $reviewers = match ($requester?->role) {
            'department_officer' => $this->usersWithRoles(['deputy_secretary']),
            'deputy_secretary' => $this->usersWithRoles(['senior_deputy_secretary']),
            default => User::query()->where('role', 'department_officer')->where('department', $requester?->department)->where('status', 'active')->get(),
        };
        $this->send($reviewers, 'New vehicle request', "{$requester?->name} submitted {$this->reference($vehicleRequest)} for review.", $vehicleRequest);
    }

    public function recommendationSaved(VehicleRequest $vehicleRequest, bool $recommended): void
    {
        $this->send($vehicleRequest->user, $recommended ? 'Request recommended' : 'Request rejected', "{$this->reference($vehicleRequest)} has been ".($recommended ? 'recommended for allocation.' : 'rejected.'), $vehicleRequest);
        if ($recommended) {
            $this->send($this->usersWithRoles(['deputy_secretary']), 'Vehicle allocation required', "{$this->reference($vehicleRequest)} is ready for vehicle and driver allocation.", $vehicleRequest);
        }
    }

    public function allocationSaved(VehicleRequest $vehicleRequest, bool $reallocated = false): void
    {
        $title = $reallocated ? 'Journey allocation updated' : 'Vehicle and driver allocated';
        $message = "{$this->reference($vehicleRequest)} ".($reallocated ? 'has a new allocation and needs final approval.' : 'is awaiting final approval.');
        $this->send($vehicleRequest->user, $title, $message, $vehicleRequest);
        $this->send($vehicleRequest->allocatedDriver?->user, $title, $message, $vehicleRequest);
        $this->send($this->usersWithRoles(['secretary', 'senior_deputy_secretary']), 'Final approval required', $message, $vehicleRequest);
    }

    public function finalDecision(VehicleRequest $vehicleRequest, bool $approved): void
    {
        $title = $approved ? 'Journey finally approved' : 'Journey request rejected';
        $message = "{$this->reference($vehicleRequest)} has been ".($approved ? 'finally approved. Your scheduled journey is ready.' : 'rejected at final review.');
        $this->send([$vehicleRequest->user, $vehicleRequest->allocatedDriver?->user], $title, $message, $vehicleRequest);
    }

    public function cancelled(VehicleRequest $vehicleRequest, User $actor): void
    {
        $recipients = collect([$vehicleRequest->user, $vehicleRequest->allocatedDriver?->user]);
        if ($actor->id !== $vehicleRequest->user_id) {
            $recipients->push($vehicleRequest->user);
        }
        $this->send($recipients, 'Journey request cancelled', "{$this->reference($vehicleRequest)} was cancelled.", $vehicleRequest);
    }

    public function journeyStatus(VehicleRequest $vehicleRequest, string $action): void
    {
        $this->send($vehicleRequest->user, $action === 'start' ? 'Journey started' : 'Journey completed', "{$this->reference($vehicleRequest)} was ".($action === 'start' ? 'started by the assigned driver.' : 'completed by the assigned driver.'), $vehicleRequest);
    }

    public function issueReported(VehicleRequest $vehicleRequest): void
    {
        $recipients = collect([$vehicleRequest->user])->merge($this->usersWithRoles(['subject_officer', 'deputy_secretary']));
        $this->send($recipients, 'Vehicle issue reported', "An issue was reported for {$this->reference($vehicleRequest)}. Please review it promptly.", $vehicleRequest);
    }

    private function usersWithRoles(array $roles): Collection
    {
        return User::query()->whereIn('role', $roles)->where('status', 'active')->get();
    }

    private function reference(VehicleRequest $vehicleRequest): string
    {
        return 'REQ-'.str_pad((string) $vehicleRequest->id, 4, '0', STR_PAD_LEFT);
    }

    private function smsMessage(string $title, string $message, ?VehicleRequest $vehicleRequest): string
    {
        $reference = $vehicleRequest ? $this->reference($vehicleRequest) : 'your request';

        $sms = match ($title) {
            'New vehicle request' => "VMS Update, {$reference} is ready for your review.",
            'Request recommended' => "VMS Update, {$reference} was recommended and moves to allocation.",
            'Request rejected' => "VMS Update, {$reference} was not approved. Open VMS for details.",
            'Vehicle allocation required' => "VMS  Action Required\n\nVehicle Request {$reference} is ready for allocation.\nPlease assign a suitable vehicle and driver to proceed.\n\nVehicle Management System\nChief Ministry - Southern Province",
            'Vehicle and driver allocated' => "VMS Update, {$reference} is allocated and awaiting final approval.",
            'Journey allocation updated' => "VMS Update, {$reference} has a new allocation and needs final approval.",
            'Final approval required' => "VMS Action, Final approval is needed for {$reference}.",
            'Journey finally approved' => "VMS Journey Approved\n\n{$reference} has been approved successfully.\nYour vehicle journey is now ready to proceed.\n\nHave a safe journey.\n\nVehicle Management System\nChief Ministry - Southern Province",
            'Journey request rejected' => "VMS Update, {$reference} was not approved. Open VMS for details.",
            'Journey request cancelled' => "VMS Update, {$reference} has been cancelled.",
            'Journey started' => "VMS Update, Your journey for {$reference} has started.",
            'Journey completed' => "VMS Complete, Your journey for {$reference} is complete. Thank you.",
            'Vehicle issue reported' => "VMS Alert, A vehicle issue was reported for {$reference}. Please review it.",
            default => Str::limit("VMS Update, {$title}: {$message}", 120, '...'),
        };

        return $sms;
    }
}
