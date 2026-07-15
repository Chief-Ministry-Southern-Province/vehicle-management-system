<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vehicle_requests', function (Blueprint $table) {
            $table->foreignId('allocated_vehicle_id')->nullable()->constrained('vehicles')->nullOnDelete();
            $table->foreignId('allocated_driver_id')->nullable()->constrained('drivers')->nullOnDelete();
            $table->foreignId('allocated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('allocated_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('vehicle_requests', function (Blueprint $table) {
            $table->dropConstrainedForeignId('allocated_vehicle_id');
            $table->dropConstrainedForeignId('allocated_driver_id');
            $table->dropConstrainedForeignId('allocated_by');
            $table->dropColumn('allocated_at');
        });
    }
};
