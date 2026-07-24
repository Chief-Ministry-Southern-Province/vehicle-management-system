<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VehicleIssueReport extends Model
{
    protected $fillable = [
        'driver_id', 'vehicle_id', 'vehicle_request_id', 'issue_type',
        'details', 'status', 'reported_at',
    ];

    protected function casts(): array
    {
        return ['reported_at' => 'datetime'];
    }

    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class);
    }

    public function vehicle(): BelongsTo
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function journey(): BelongsTo
    {
        return $this->belongsTo(VehicleRequest::class, 'vehicle_request_id');
    }
}
