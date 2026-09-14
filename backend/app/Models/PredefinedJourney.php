<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PredefinedJourney extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'starting_location',
        'destination',
        'distance_km',
        'created_by',
    ];

    protected function casts(): array
    {
        return ['distance_km' => 'float'];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
