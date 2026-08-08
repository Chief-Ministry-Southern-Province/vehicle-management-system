<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class Vehicle extends Model
{
    protected $fillable = [
        'registration_number', 'vehicle_type', 'make', 'model', 'manufacturing_year', 'color', 'vin', 'engine_number',
        'fuel_type', 'fuel_capacity', 'seat_capacity', 'technical_notes', 'registration_expiry', 'revenue_license_expiry',
        'insurance_policy', 'insurance_provider', 'assignment', 'status', 'last_service_date', 'fuel_level',
        'service_category', 'service_details', 'repair_details', 'fuel_details', 'image_path', 'image_paths',
    ];

    protected $appends = ['image_url', 'image_urls', 'service_total_cost'];

    protected function casts(): array
    {
        return ['registration_expiry' => 'date:Y-m-d', 'revenue_license_expiry' => 'date:Y-m-d', 'last_service_date' => 'date:Y-m-d', 'service_details' => 'array', 'repair_details' => 'array', 'fuel_details' => 'array', 'image_paths' => 'array'];
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image_urls[0] ?? null;
    }

    public function getImageUrlsAttribute(): array
    {
        return collect([$this->image_path, ...($this->image_paths ?? [])])
            ->filter()
            ->unique()
            ->map(fn (string $path): string => url('/' . ltrim($path, '/')))
            ->values()
            ->all();
    }

    public function getServiceTotalCostAttribute(): float
    {
        return round(collect($this->service_details ?? [])->sum(
            fn (array $service): float => (float) ($service['cost'] ?? 0),
        ), 2);
    }

    public function vehicleRequests(): HasMany
    {
        return $this->hasMany(VehicleRequest::class, 'allocated_vehicle_id');
    }

    public function hasScheduleConflict(Carbon|string $startsAt, Carbon|string $endsAt, ?int $ignoreRequestId = null, ?VehicleRequest $request = null): bool
    {
        $journeys = $this->activeJourneysDuring($startsAt, $endsAt, $ignoreRequestId)->get();

        if ($journeys->isEmpty()) {
            return false;
        }

        if (! $request || $journeys->contains(fn (VehicleRequest $journey) => ! $journey->canShareJourneyWith($request))) {
            return true;
        }

        return $this->seat_capacity === null
            || $journeys->sum('passenger_count') + $request->passenger_count > $this->seat_capacity;
    }

    public function activeJourneysDuring(Carbon|string $startsAt, Carbon|string $endsAt, ?int $ignoreRequestId = null)
    {
        return $this->vehicleRequests()
            ->whereIn('status', ['vehicle_allocated', 'approved'])
            ->where(function ($query) {
                $query->whereNull('journey_status')->orWhere('journey_status', '!=', 'completed');
            })
            ->when($ignoreRequestId, fn ($query) => $query->whereKeyNot($ignoreRequestId))
            ->where('departure_at', '<', $endsAt)
            ->where('expected_return_at', '>', $startsAt);
    }
}
