<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('vehicle_requests')->where('status', 'pending_final_approval')->update(['status' => 'vehicle_allocated']);

        Schema::table('vehicle_requests', function (Blueprint $table) {
            $table->timestamp('driver_notified_at')->nullable()->after('allocated_at');
        });

        Schema::table('drivers', function (Blueprint $table) {
            $table->json('current_assignment')->nullable()->after('previous_journeys');
        });
    }

    public function down(): void
    {
        Schema::table('vehicle_requests', function (Blueprint $table) {
            $table->dropColumn('driver_notified_at');
        });

        Schema::table('drivers', function (Blueprint $table) {
            $table->dropColumn('current_assignment');
        });

        DB::table('vehicle_requests')->where('status', 'vehicle_allocated')->update(['status' => 'pending_final_approval']);
    }
};
