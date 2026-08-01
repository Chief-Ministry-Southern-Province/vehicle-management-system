<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class VehicleRequest extends Model
{
    use HasFactory;

    protected $appends = ['attachment_url'];

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
