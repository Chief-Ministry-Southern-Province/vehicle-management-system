<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Creates the System Administrator configured through config/system_admin.php
     * and SYSTEM_ADMIN_* variables.
     */
    public function run(): void
    {
        $systemAdmin = config('system_admin');

        User::updateOrCreate(
            ['email' => $systemAdmin['email']],
            [
                'employee_id' => $systemAdmin['username'],
                'name' => $systemAdmin['name'],
                'phone' => $systemAdmin['phone'],
                'department' => $systemAdmin['department'],
                'role' => 'system_admin',
                'password' => Hash::make($systemAdmin['password']),
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        );
    }
}
