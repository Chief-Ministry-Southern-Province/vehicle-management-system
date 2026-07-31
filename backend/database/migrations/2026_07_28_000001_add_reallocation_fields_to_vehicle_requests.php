<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vehicle_requests', function (Blueprint $table) {
            $table->foreignId('previous_allocated_vehicle_id')
                ->nullable()
                ->after('allocated_vehicle_id')
                ->constrained('vehicles')
                ->nullOnDelete();
            $table->text('reallocation_reason')->nullable()->after('allocated_at');
            $table->foreignId('reallocated_by')
                ->nullable()
                ->after('reallocation_reason')
                ->constrained('users')
                ->nullOnDelete();
            $table->timestamp('reallocated_at')->nullable()->after('reallocated_by');
        });
    }

    public function down(): void
    {
        Schema::table('vehicle_requests', function (Blueprint $table) {
            $table->dropConstrainedForeignId('previous_allocated_vehicle_id');
            $table->dropConstrainedForeignId('reallocated_by');
            $table->dropColumn(['reallocation_reason', 'reallocated_at']);
        });
    }
};
