<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    private const ROLES = [
        'employee',
        'department_officer',
        'subject_officer',
        'deputy_secretary',
        'senior_deputy_secretary',
        'secretary',
        'driver',
    ];

    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', self::ROLES)->default('employee')->change();
        });
    }

    public function down(): void
    {
        DB::table('users')
            ->where('role', 'senior_deputy_secretary')
            ->update(['role' => 'deputy_secretary']);

        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', [
                'employee',
                'department_officer',
                'subject_officer',
                'deputy_secretary',
                'secretary',
                'driver',
            ])->default('employee')->change();
        });
    }
};
