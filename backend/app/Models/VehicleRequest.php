<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VehicleRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'requester_name',
        'purpose',
        'destination',
        'departure_at',
        'expected_return_at',
        'passenger_count',
        'passenger_names',
        'attachment_path',
        'attachment_original_name',
        'status',
        'recommendation_status',
        'department_priority',
        'recommendation_notes',
        'recommended_by',
        'recommended_at',
        'allocated_vehicle_id',
        'allocated_driver_id',
        'allocated_by',
        'allocated_at',
        'driver_notified_at',
    ];

    protected function casts(): array
    {
        return [
            'departure_at' => 'datetime',
            'expected_return_at' => 'datetime',
            'recommended_at' => 'datetime',
            'allocated_at' => 'datetime',
            'driver_notified_at' => 'datetime',
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

    public function allocatedDriver(): BelongsTo
    {
        return $this->belongsTo(Driver::class, 'allocated_driver_id');
    }

    public function allocator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'allocated_by');
    }
}
