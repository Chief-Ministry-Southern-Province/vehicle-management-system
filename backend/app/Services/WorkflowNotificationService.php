<?php

namespace App\Services;

use App\Models\User;
use App\Models\VehicleRequest;
use App\Notifications\WorkflowNotification;
use Illuminate\Database\Eloquent\Collection;

class WorkflowNotificationService
{
    public function send(iterable|User|null $recipients, string $title, string $message, ?VehicleRequest $vehicleRequest = null): void
    {
        $recipients = $recipients instanceof User ? collect([$recipients]) : collect($recipients);

        $recipients->filter(fn ($user) => $user instanceof User && $user->isActive())
            ->unique('id')
            ->each(fn (User $user) => $user->notify(new WorkflowNotification([
                'title' => $title,
                'message' => $message,
                'vehicle_request_id' => $vehicleRequest?->id,
                'reference' => $vehicleRequest ? 'REQ-'.str_pad((string) $vehicleRequest->id, 4, '0', STR_PAD_LEFT) : null,
            ])));
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
}
