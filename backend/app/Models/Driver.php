<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Driver extends Model
{
    protected $attributes = [
        'status' => 'active',
    ];

    protected $appends = ['duty_status'];

    protected $fillable = [
        'driver_id', 'full_name', 'date_of_birth', 'nic', 'address', 'contact_number',
        'blood_group', 'licence_number', 'licence_type', 'licence_renewal_date',
        'allocated_vehicle', 'status',
        'previous_journeys',
        'current_assignment',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date:Y-m-d',
            'licence_renewal_date' => 'date:Y-m-d',
            'previous_journeys' => 'array',
            'current_assignment' => 'array',
        ];
    }

    public function vehicleRequests(): HasMany
    {
        return $this->hasMany(VehicleRequest::class, 'allocated_driver_id');
    }

    public function hasScheduleConflict(Carbon|string $startsAt, Carbon|string $endsAt, ?int $ignoreRequestId = null): bool
    {
        return $this->activeJourneysDuring($startsAt, $endsAt, $ignoreRequestId)->exists();
    }

    public function operationalStatusFor(Carbon|string $startsAt, Carbon|string $endsAt): string
    {
        if (! $this->isActive()) {
            return 'unavailable';
        }

        $journeys = $this->activeJourneysDuring($startsAt, $endsAt);

        if ((clone $journeys)->whereIn('journey_status', ['ongoing', 'issue'])->exists()) {
            return 'ongoing_trip';
        }

        return $journeys->exists() ? 'scheduled_trip' : 'available';
    }

    private function activeJourneysDuring(
        Carbon|string $startsAt,
        Carbon|string $endsAt,
        ?int $ignoreRequestId = null,
    ) {
        return $this->vehicleRequests()
            ->whereIn('status', ['vehicle_allocated', 'approved'])
            ->where(function ($query) {
                $query->whereNull('journey_status')->orWhere('journey_status', '!=', 'completed');
            })
            ->when($ignoreRequestId, fn ($query) => $query->whereKeyNot($ignoreRequestId))
            ->where('departure_at', '<', $endsAt)
            ->where('expected_return_at', '>', $startsAt);
    }

    public function isActive(): bool
    {
        return $this->getRawOriginal('status') === 'active';
    }

    public function getDutyStatusAttribute(): string
    {
        return $this->isActive() ? 'active' : 'inactive';
    }

    public function getStatusAttribute(?string $storedStatus): string
    {
        if (! $this->exists || $storedStatus !== 'active') {
            return 'unavailable';
        }

        if ($this->vehicleRequests()
            ->where('status', 'approved')
            ->whereIn('journey_status', ['ongoing', 'issue'])
            ->exists()) {
            return 'ongoing_trip';
        }

        return $this->operationalStatusFor(now(), now()->addSecond());
    }
}
