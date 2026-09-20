<?php

namespace App\Services;

use App\Events\WorkflowUpdated;
use App\Models\User;
use App\Models\VehicleRequest;
use App\Notifications\WorkflowNotification;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

class WorkflowNotificationService
{
    public function __construct(private readonly SmsService $smsService) {}

    /**
     * Persist the in-app notification and push the same update to that user's
     * private WebSocket channel. Returning the recipients lets callers notify
     * additional role viewers without broadcasting the same change twice.
     *
     * @return Collection<int, User>
     */
    public function send(iterable|User|null $recipients, string $title, string $message, ?VehicleRequest $vehicleRequest = null, string $action = 'workflow_updated'): Collection
    {
        $recipients = $this->activeRecipients($recipients);

        $recipients->each(function (User $user) use ($title, $message, $vehicleRequest, $action): void {
            $payload = [
                'title' => $title,
                'message' => $message,
                'vehicle_request_id' => $vehicleRequest?->id,
                'reference' => $vehicleRequest ? 'REQ-'.str_pad((string) $vehicleRequest->id, 4, '0', STR_PAD_LEFT) : null,
            ];
            $user->notify(new WorkflowNotification($payload));

            $this->broadcast([$user], $action, $vehicleRequest);

            // Gateway delivery is supplementary. A provider outage must not undo
            // the durable in-app workflow notification or its completed transition.
            $this->smsService->sendSms($user->phone, $this->smsMessage($title, $message, $vehicleRequest));
        });

        return $recipients;
    }

    public function requestSubmitted(VehicleRequest $vehicleRequest): void
    {
        $requester = $vehicleRequest->user;
        $reviewers = match ($requester?->role) {
            'department_officer' => $this->usersWithRoles(['deputy_secretary']),
            'deputy_secretary' => $this->usersWithRoles(['senior_deputy_secretary']),
            default => User::query()->where('role', 'department_officer')->where('department', $requester?->department)->where('status', 'active')->get(),
        };
        $notified = $this->send($reviewers, 'New vehicle request', "{$requester?->name} submitted {$this->reference($vehicleRequest)} for review.", $vehicleRequest, 'request_submitted');
        $this->broadcastAdditional([$requester], $notified, 'request_submitted', $vehicleRequest);
    }

    public function recommendationSaved(VehicleRequest $vehicleRequest, bool $recommended): void
    {
        $notified = $this->send($vehicleRequest->user, $recommended ? 'Request recommended' : 'Request rejected', "{$this->reference($vehicleRequest)} has been ".($recommended ? 'recommended for allocation.' : 'rejected.'), $vehicleRequest, 'recommendation_saved');
        if ($recommended) {
            $notified = $notified->merge($this->send($this->usersWithRoles(['deputy_secretary']), 'Vehicle allocation required', "{$this->reference($vehicleRequest)} is ready for vehicle and driver allocation.", $vehicleRequest, 'recommendation_saved'));
        }

        $reviewers = match ($vehicleRequest->user?->role) {
            'department_officer' => $this->usersWithRoles(['deputy_secretary']),
            'deputy_secretary' => $this->usersWithRoles(['senior_deputy_secretary']),
            default => $this->departmentOfficers($vehicleRequest),
        };
        $this->broadcastAdditional($reviewers, $notified, 'recommendation_saved', $vehicleRequest);
    }

    public function allocationSaved(VehicleRequest $vehicleRequest, bool $reallocated = false): void
    {
        $title = $reallocated ? 'Journey allocation updated' : 'Vehicle and driver allocated';
        $message = "{$this->reference($vehicleRequest)} ".($reallocated ? 'has a new allocation and needs final approval.' : 'is awaiting final approval.');
        $notified = $this->send($vehicleRequest->user, $title, $message, $vehicleRequest, 'allocation_saved');
        $notified = $notified->merge($this->send($vehicleRequest->allocatedDriver?->user, $title, $message, $vehicleRequest, 'allocation_saved'));
        $notified = $notified->merge($this->send($this->usersWithRoles(['secretary', 'senior_deputy_secretary']), 'Final approval required', $message, $vehicleRequest, 'allocation_saved'));
        $this->broadcastAdditional($this->usersWithRoles(['deputy_secretary']), $notified, 'allocation_saved', $vehicleRequest);
    }

    public function finalDecision(VehicleRequest $vehicleRequest, bool $approved): void
    {
        $title = $approved ? 'Journey finally approved' : 'Journey request rejected';
        $message = "{$this->reference($vehicleRequest)} has been ".($approved ? 'finally approved. Your scheduled journey is ready.' : 'rejected at final review.');
        $notified = $this->send([$vehicleRequest->user, $vehicleRequest->allocatedDriver?->user], $title, $message, $vehicleRequest, 'final_decision_saved');
        $this->broadcastAdditional(
            $this->usersWithRoles(['deputy_secretary', 'senior_deputy_secretary', 'secretary', 'subject_officer']),
            $notified,
            'final_decision_saved',
            $vehicleRequest,
        );
    }

    public function cancelled(VehicleRequest $vehicleRequest, User $actor): void
    {
        $recipients = collect([$vehicleRequest->user, $vehicleRequest->allocatedDriver?->user]);
        if ($actor->id !== $vehicleRequest->user_id) {
            $recipients->push($vehicleRequest->user);
        }
        $notified = $this->send($recipients, 'Journey request cancelled', "{$this->reference($vehicleRequest)} was cancelled.", $vehicleRequest, 'request_cancelled');
        $this->broadcastAdditional(
            $this->usersWithRoles(['deputy_secretary', 'senior_deputy_secretary', 'secretary', 'subject_officer']),
            $notified,
            'request_cancelled',
            $vehicleRequest,
        );
    }

    public function journeyStatus(VehicleRequest $vehicleRequest, string $action): void
    {
        $eventAction = $action === 'start' ? 'journey_started' : 'journey_completed';
        $notified = $this->send($vehicleRequest->user, $action === 'start' ? 'Journey started' : 'Journey completed', "{$this->reference($vehicleRequest)} was ".($action === 'start' ? 'started by the assigned driver.' : 'completed by the assigned driver.'), $vehicleRequest, $eventAction);
        $this->broadcastAdditional(
            collect([$vehicleRequest->allocatedDriver?->user])->merge($this->usersWithRoles(['deputy_secretary', 'senior_deputy_secretary', 'secretary', 'subject_officer'])),
            $notified,
            $eventAction,
            $vehicleRequest,
        );
    }

    public function issueReported(VehicleRequest $vehicleRequest): void
    {
        $recipients = collect([$vehicleRequest->user])->merge($this->usersWithRoles(['subject_officer', 'deputy_secretary']));
        $notified = $this->send($recipients, 'Vehicle issue reported', "An issue was reported for {$this->reference($vehicleRequest)}. Please review it promptly.", $vehicleRequest, 'issue_reported');
        $this->broadcastAdditional([$vehicleRequest->allocatedDriver?->user], $notified, 'issue_reported', $vehicleRequest);
    }

    private function usersWithRoles(array $roles): Collection
    {
        return User::query()->whereIn('role', $roles)->where('status', 'active')->get();
    }

    private function departmentOfficers(VehicleRequest $vehicleRequest): Collection
    {
        $department = $vehicleRequest->user?->department;

        if (! $department) {
            return new Collection;
        }

        return User::query()
            ->where('role', 'department_officer')
            ->where('department', $department)
            ->where('status', 'active')
            ->get();
    }

    /** @return Collection<int, User> */
    private function activeRecipients(iterable|User|null $recipients): Collection
    {
        return ($recipients instanceof User ? collect([$recipients]) : collect($recipients))
            ->filter(fn ($user): bool => $user instanceof User && $user->isActive())
            ->unique('id')
            ->values();
    }

    private function broadcastAdditional(iterable|User|null $recipients, Collection $alreadyNotified, string $action, ?VehicleRequest $vehicleRequest): void
    {
        $additional = $this->activeRecipients($recipients)
            ->reject(fn (User $user): bool => $alreadyNotified->contains('id', $user->id));

        $this->broadcast($additional, $action, $vehicleRequest);
    }

    private function broadcast(iterable|User|null $recipients, string $action, ?VehicleRequest $vehicleRequest = null): void
    {
        $recipientIds = $this->activeRecipients($recipients)->pluck('id')->all();

        if ($recipientIds === []) {
            return;
        }

        try {
            event(new WorkflowUpdated($recipientIds, $action, $vehicleRequest?->id));
        } catch (Throwable $exception) {
            // A temporary socket outage must not report a completed, persisted
            // workflow transition as failed. The next page load remains
            // authoritative and notifications are already durable in the DB.
            Log::warning('Unable to broadcast a workflow update.', [
                'action' => $action,
                'vehicle_request_id' => $vehicleRequest?->id,
                'recipient_ids' => $recipientIds,
                'exception' => $exception::class,
            ]);
        }
    }

    private function reference(VehicleRequest $vehicleRequest): string
    {
        return 'REQ-'.str_pad((string) $vehicleRequest->id, 4, '0', STR_PAD_LEFT);
    }

    private function smsMessage(string $title, string $message, ?VehicleRequest $vehicleRequest): string
    {
        $reference = $vehicleRequest ? $this->reference($vehicleRequest) : 'your request';

        $sms = match ($title) {
            'New vehicle request' => "VMS - Update: {$reference} is ready for your review.",
            'Request recommended' => "VMS - Update: {$reference} was recommended and moves to allocation.",
            'Request rejected' => "VMS - Update: {$reference} was not approved. Open VMS for details.",
            'Vehicle allocation required' => "VMS | Action Required\n\nVehicle Request {$reference} is ready for allocation.\nPlease assign a suitable vehicle and driver to proceed.\n\nVehicle Management System\nChief Ministry - Southern Province",
            'Vehicle and driver allocated' => "VMS - Update: {$reference} is allocated and awaiting final approval.",
            'Journey allocation updated' => "VMS - Update: {$reference} has a new allocation and needs final approval.",
            'Final approval required' => "VMS - Action Required: Final approval is needed for {$reference}.",
            'Journey finally approved' => $this->approvedJourneySms($reference, $vehicleRequest),
            'Journey request rejected' => "VMS - Update: {$reference} was not approved. Open VMS for details.",
            'Journey request cancelled' => "VMS - Update: {$reference} has been cancelled.",
            'Journey started' => "VMS - Update: Your journey for {$reference} has started.",
            'Journey completed' => "VMS - Complete: Your journey for {$reference} is complete. Thank you.",
            'Vehicle issue reported' => "VMS - Alert: A vehicle issue was reported for {$reference}. Please review it.",
            default => Str::limit("VMS - Update: {$title}: {$message}", 120, '...'),
        };

        return $sms;
    }

    private function approvedJourneySms(string $reference, ?VehicleRequest $vehicleRequest): string
    {
        $driver = $vehicleRequest?->allocatedDriver;
        $vehicle = $vehicleRequest?->allocatedVehicle;
        $driverName = $driver?->full_name ?: 'Not assigned';
        $driverContact = $driver?->contact_number ?: $driver?->user?->phone ?: 'Not available';
        $vehicleName = trim(collect([$vehicle?->make, $vehicle?->model])->filter()->join(' '));
        $vehicleName = $vehicleName ?: $vehicle?->vehicle_type ?: 'Not assigned';
        $vehicleDisplay = $vehicle?->registration_number
            ? "{$vehicleName} ({$vehicle->registration_number})"
            : $vehicleName;

        return "VMS - Journey Approved:\n\n{$reference} has been approved successfully.\nYour vehicle journey is now ready to proceed.\n\nDriver Name: {$driverName}\nDriver Contact Number: {$driverContact}\nVehicle Name: {$vehicleDisplay}\n\nHave a safe journey.";
    }
}
