<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Vehicle extends Model
{
    protected $fillable = [
        'registration_number', 'vehicle_type', 'make', 'model', 'manufacturing_year', 'color', 'vin', 'engine_number',
        'fuel_type', 'fuel_capacity', 'seat_capacity', 'technical_notes', 'registration_expiry', 'revenue_license_expiry',
        'insurance_policy', 'insurance_provider', 'assignment', 'status', 'last_service_date', 'fuel_level',
        'service_category', 'service_details', 'repair_details', 'fuel_details', 'image_path',
    ];

    protected $appends = ['image_url', 'service_total_cost'];

    protected function casts(): array
    {
        return ['registration_expiry' => 'date:Y-m-d', 'revenue_license_expiry' => 'date:Y-m-d', 'last_service_date' => 'date:Y-m-d', 'service_details' => 'array', 'repair_details' => 'array', 'fuel_details' => 'array'];
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? url(Storage::disk('public')->url($this->image_path)) : null;
    }

    public function getServiceTotalCostAttribute(): float
    {
        return round(collect($this->service_details ?? [])->sum(
            fn (array $service): float => (float) ($service['cost'] ?? 0),
        ), 2);
    }
}
