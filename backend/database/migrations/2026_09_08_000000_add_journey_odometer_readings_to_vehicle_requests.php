<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vehicle_requests', function (Blueprint $table) {
            $table->decimal('start_odometer_km', 10, 2)->nullable();
            $table->decimal('end_odometer_km', 10, 2)->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('vehicle_requests', function (Blueprint $table) {
            $table->dropColumn(['start_odometer_km', 'end_odometer_km']);
        });
    }
};
