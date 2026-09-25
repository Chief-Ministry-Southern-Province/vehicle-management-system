<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SystemSetting extends Model
{
    use HasFactory;

    public const ODOMETER_READINGS_REQUIRED = 'odometer_readings_required';

    protected $fillable = [
        'key',
        'value',
        'updated_by',
    ];

    protected $casts = [
        'value' => 'boolean',
    ];

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public static function odometerReadingsRequired(): bool
    {
        $setting = static::query()
            ->where('key', self::ODOMETER_READINGS_REQUIRED)
            ->first();

        return $setting?->value ?? true;
    }

    public static function setOdometerReadingsRequired(bool $required, int $updatedBy): self
    {
        return static::query()->updateOrCreate(
            ['key' => self::ODOMETER_READINGS_REQUIRED],
            ['value' => $required, 'updated_by' => $updatedBy],
        );
    }
}
