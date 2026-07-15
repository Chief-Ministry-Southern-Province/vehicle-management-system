<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * Mass assignable attributes.
     */
    protected $fillable = [
        'employee_id',
        'name',
        'email',
        'phone',
        'department',
        'role',
        'password',
        'status',
    ];

    /**
     * Attributes hidden when the model is serialized to JSON.
     * Password and remember_token must never reach the frontend.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Attribute casting.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed', // Laravel 10+ auto-hashes on assignment
        ];
    }

    /*
    |--------------------------------------------------------------------
    | Role helpers — used in controllers/policies instead of magic strings
    |--------------------------------------------------------------------
    */

    public function isEmployee(): bool
    {
        return $this->role === 'employee';
    }

    public function isDepartmentOfficer(): bool
    {
        return $this->role === 'department_officer';
    }

    public function isSubjectOfficer(): bool
    {
        return $this->role === 'subject_officer';
    }

    public function isDeputySecretary(): bool
    {
        return $this->role === 'deputy_secretary';
    }

    public function isSeniorDeputySecretary(): bool
    {
        return $this->role === 'senior_deputy_secretary';
    }

    public function isSecretary(): bool
    {
        return $this->role === 'secretary';
    }

    public function isDriver(): bool
    {
        return $this->role === 'driver';
    }

    public function hasRole(string|array $roles): bool
    {
        if (is_array($roles)) {
            return in_array($this->role, $roles, true);
        }

        return $this->role === $roles;
    }

    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    public function vehicleRequests(): HasMany
    {
        return $this->hasMany(VehicleRequest::class);
    }
}
