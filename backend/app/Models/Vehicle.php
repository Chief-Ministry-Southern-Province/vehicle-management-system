<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Vehicle extends Model
{
    protected $fillable = [
        'registration_number', 'vehicle_type', 'make', 'model', 'manufacturing_year', 'color', 'vin', 'engine_number',
        'fuel_type', 'fuel_capacity', 'technical_notes', 'registration_expiry', 'revenue_license_expiry',
        'insurance_policy', 'insurance_provider', 'assignment', 'status', 'last_service_date', 'fuel_level',
        'service_category', 'image_path',
    ];

    protected $appends = ['image_url'];

    protected function casts(): array
    {
        return ['registration_expiry' => 'date:Y-m-d', 'revenue_license_expiry' => 'date:Y-m-d', 'last_service_date' => 'date:Y-m-d'];
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image_path ? url(Storage::disk('public')->url($this->image_path)) : null;
    }
}
