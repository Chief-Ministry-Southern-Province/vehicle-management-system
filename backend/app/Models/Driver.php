<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Driver extends Model
{
    protected $fillable = [
        'driver_id', 'full_name', 'date_of_birth', 'nic', 'address', 'contact_number',
        'blood_group', 'licence_number', 'licence_type', 'licence_renewal_date',
        'allocated_vehicle', 'status',
        'previous_journeys',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date:Y-m-d',
            'licence_renewal_date' => 'date:Y-m-d',
            'previous_journeys' => 'array',
        ];
    }
}
