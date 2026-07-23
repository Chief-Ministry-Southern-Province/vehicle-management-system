<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Driver extends Model
{
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
        return $this->vehicleRequests()
            ->whereIn('status', ['vehicle_allocated', 'approved'])
            ->when($ignoreRequestId, fn ($query) => $query->whereKeyNot($ignoreRequestId))
            ->where('departure_at', '<', $endsAt)
            ->where('expected_return_at', '>', $startsAt)
            ->exists();
    }

    public function getStatusAttribute(?string $storedStatus): string
    {
        if (! $this->exists) {
            return $storedStatus ?? 'available';
        }

        return $this->hasScheduleConflict(now(), now()->addSecond())
            ? 'unavailable'
            : 'available';
    }
}
