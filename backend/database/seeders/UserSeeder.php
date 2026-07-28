<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Creates one login-ready account per role.
     * Password for every seeded account: Password123
     */
    public function run(): void
    {
        $accounts = [
            ['employee_id' => 'EMP-001', 'name' => 'Nadeesha Perera', 'email' => 'employee@vms.gov', 'role' => 'employee', 'department' => 'Administration'],
            ['employee_id' => 'DEP-001', 'name' => 'Sunil Jayasuriya', 'email' => 'department.officer@vms.gov', 'role' => 'department_officer', 'department' => 'Administration'],
            ['employee_id' => 'SUB-001', 'name' => 'Kamal Fernando', 'email' => 'subject.officer@vms.gov', 'role' => 'subject_officer', 'department' => 'Transport'],
            ['employee_id' => 'DEP-SEC-001', 'name' => 'Anoma Wickramasinghe', 'email' => 'deputy.secretary@vms.gov', 'role' => 'deputy_secretary', 'department' => 'Secretariat'],
            ['employee_id' => 'SR-DEP-SEC-001', 'name' => 'Senior Assistance Secretary', 'email' => 'senior.deputy.secretary@vms.gov', 'role' => 'senior_deputy_secretary', 'department' => 'Secretariat'],
            ['employee_id' => 'SEC-001', 'name' => 'Ranjith Bandara', 'email' => 'secretary@vms.gov', 'role' => 'secretary', 'department' => 'Secretariat'],
            ['employee_id' => 'DRV-001', 'name' => 'Saman Kumara', 'email' => 'driver@vms.gov', 'role' => 'driver', 'department' => 'Transport'],
        ];

        foreach ($accounts as $account) {
            User::updateOrCreate(
                ['email' => $account['email']],
                [
                    'employee_id' => $account['employee_id'],
                    'name' => $account['name'],
                    'department' => $account['department'],
                    'role' => $account['role'],
                    'password' => Hash::make('Password123'),
                    'status' => 'active',
                    'email_verified_at' => now(),
                ]
            );
        }
    }
}
