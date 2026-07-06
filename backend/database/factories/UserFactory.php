<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        static $employeeId = 1000;
        
        $roles = ['employee', 'department_officer', 'subject_officer', 'deputy_secretary', 'secretary', 'senior_deputy_secretary', 'driver'];
        $departments = ['Administration', 'Transport', 'Finance', 'Secretariat', 'Operations'];
        
        return [
            'employee_id' => 'EMP-' . (++$employeeId),
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'department' => fake()->randomElement($departments),
            'role' => fake()->randomElement($roles),
            'password' => static::$password ??= Hash::make('password'),
            'status' => 'active',
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
