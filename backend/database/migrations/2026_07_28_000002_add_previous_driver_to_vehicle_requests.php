<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vehicle_requests', function (Blueprint $table) {
            $table->foreignId('previous_allocated_driver_id')
                ->nullable()
                ->after('allocated_driver_id')
                ->constrained('drivers')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('vehicle_requests', function (Blueprint $table) {
            $table->dropConstrainedForeignId('previous_allocated_driver_id');
        });
    }
};
