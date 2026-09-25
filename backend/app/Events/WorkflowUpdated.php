<?php

namespace App\Events;

use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;

/**
 * Announces a workflow change to users who are allowed to see its effects.
 *
 * The event intentionally contains no request, vehicle, driver, or passenger
 * data. Consumers use their normal authorized API endpoint to load the
 * current representation after receiving the invalidation.
 */
class WorkflowUpdated implements ShouldBroadcastNow
{
    /** @var array<int, int> */
    public array $recipientIds;

    public function __construct(
        iterable $recipientIds,
        public readonly string $action,
        public readonly ?int $vehicleRequestId = null,
    ) {
        $this->recipientIds = collect($recipientIds)
            ->map(fn ($id): int => (int) $id)
            ->filter()
            ->unique()
            ->values()
            ->all();
    }

    /** @return array<int, PrivateChannel> */
    public function broadcastOn(): array
    {
        return array_map(
            fn (int $userId): PrivateChannel => new PrivateChannel("workflow.user.{$userId}"),
            $this->recipientIds,
        );
    }

    public function broadcastAs(): string
    {
        return 'workflow.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'action' => $this->action,
            'vehicle_request_id' => $this->vehicleRequestId,
            'updated_at' => now()->toISOString(),
        ];
    }
}
