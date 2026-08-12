<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

class VehicleRequest extends Model
{
    /** All overlapping approved requests assigned to this same vehicle/driver pair. */
    public function consolidatedRequests(): Collection
    {
        if (! $this->allocated_vehicle_id || ! $this->allocated_driver_id) {
            return collect([$this]);
        }

        $group = collect([$this]);
        $startsAt = $this->departure_at->copy();
        $endsAt = $this->expected_return_at->copy();

        do {
            $previousCount = $group->count();
            $matches = self::query()
                ->where('allocated_vehicle_id', $this->allocated_vehicle_id)
                ->where('allocated_driver_id', $this->allocated_driver_id)
                ->where('status', 'approved')
                ->whereNotIn('journey_status', ['completed', 'cancelled'])
                ->where('departure_at', '<', $endsAt)
                ->where('expected_return_at', '>', $startsAt)
                ->get();
            $group = $group->merge($matches)->unique('id')->values();
            $startsAt = $group->min('departure_at')->copy();
            $endsAt = $group->max('expected_return_at')->copy();
        } while ($group->count() > $previousCount);

        return $group->sortBy('departure_at')->values();
    }

    public function consolidatedJourneyPayload(): array
    {
        $requests = $this->consolidatedRequests();

        return [
            'departure_at' => $requests->min('departure_at')->toISOString(),
            'expected_return_at' => $requests->max('expected_return_at')->toISOString(),
            'passenger_count' => $requests->sum('passenger_count'),
            'request_count' => $requests->count(),
            'requests' => $requests->map(fn (self $request): array => [
                'id' => $request->id,
                'reference' => 'REQ-' . str_pad((string) $request->id, 4, '0', STR_PAD_LEFT),
                'requester_name' => $request->requester_name,
                'purpose' => $request->purpose,
                'passenger_count' => $request->passenger_count,
                'passenger_names' => $request->passenger_names,
                'pickup_place' => $request->parking_location,
                'drop_place' => $request->destination,
                'departure_at' => $request->departure_at->toISOString(),
                'expected_return_at' => $request->expected_return_at->toISOString(),
            ])->all(),
        ];
    }

    public function canShareJourneyWith(self $other): bool
    {
        $hasStarted = fn (self $request): bool => (bool) $request->journey_started_at
            || in_array($request->journey_status, ['ongoing', 'issue', 'completed'], true);

        return ! $hasStarted($this)
            && ! $hasStarted($other);
    }
    use HasFactory;

    protected $appends = ['attachment_url'];

    protected $fillable = [
        'user_id',
        'requester_name',
        'purpose',
        'starting_location',
        'starting_latitude',
        'starting_longitude',
        'destination',
        'destination_latitude',
        'destination_longitude',
        'distance_km',
        'route_duration_seconds',
        'route_geometry',
        'departure_at',
        'expected_return_at',
        'passenger_count',
        'passenger_names',
        'attachment_path',
        'attachment_original_name',
        'status',
        'journey_status',
        'journey_started_at',
        'journey_completed_at',
        'cancelled_at',
        'cancelled_by',
        'recommendation_status',
        'department_priority',
        'recommendation_notes',
        'recommended_by',
        'recommended_at',
        'allocated_vehicle_id',
        'previous_allocated_vehicle_id',
        'allocated_driver_id',
        'previous_allocated_driver_id',
        'allocated_by',
        'allocated_at',
        'parking_location',
        'reallocation_reason',
        'reallocated_by',
        'reallocated_at',
        'driver_notified_at',
        'approved_by',
        'approved_at',
        'rejected_by',
        'rejected_at',
    ];

    protected function casts(): array
    {
        return [
            'starting_latitude' => 'float',
            'starting_longitude' => 'float',
            'destination_latitude' => 'float',
            'destination_longitude' => 'float',
            'distance_km' => 'float',
            'route_duration_seconds' => 'integer',
            'route_geometry' => 'array',
            'departure_at' => 'datetime',
            'expected_return_at' => 'datetime',
            'recommended_at' => 'datetime',
            'allocated_at' => 'datetime',
            'reallocated_at' => 'datetime',
            'driver_notified_at' => 'datetime',
            'approved_at' => 'datetime',
            'rejected_at' => 'datetime',
            'journey_started_at' => 'datetime',
            'journey_completed_at' => 'datetime',
            'cancelled_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function recommender(): BelongsTo
    {
        return $this->belongsTo(User::class, 'recommended_by');
    }

    public function allocatedVehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class, 'allocated_vehicle_id');
    }

    public function previousAllocatedVehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class, 'previous_allocated_vehicle_id');
    }

    public function allocatedDriver(): BelongsTo
    {
        return $this->belongsTo(Driver::class, 'allocated_driver_id');
    }

    public function previousAllocatedDriver(): BelongsTo
    {
        return $this->belongsTo(Driver::class, 'previous_allocated_driver_id');
    }

    public function allocator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'allocated_by');
    }

    public function reallocator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reallocated_by');
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function rejector(): BelongsTo
    {
        return $this->belongsTo(User::class, 'rejected_by');
    }

    public function getAttachmentUrlAttribute(): ?string
    {
        return $this->attachment_path ? url(Storage::disk('public')->url($this->attachment_path)) : null;
    }
}
