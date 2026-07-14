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
    ];

    protected function casts(): array
    {
        return [
            'departure_at' => 'datetime',
            'expected_return_at' => 'datetime',
            'recommended_at' => 'datetime',
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
}
