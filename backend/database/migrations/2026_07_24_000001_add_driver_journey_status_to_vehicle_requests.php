<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vehicle_requests', function (Blueprint $table) {
            $table->string('journey_status', 20)->default('scheduled')->after('status');
            $table->timestamp('journey_started_at')->nullable()->after('journey_status');
            $table->timestamp('journey_completed_at')->nullable()->after('journey_started_at');
        });

        DB::table('vehicle_requests')
            ->where('status', 'approved')
            ->where('expected_return_at', '<=', now())
            ->update([
                'journey_status' => 'completed',
                'journey_completed_at' => DB::raw('expected_return_at'),
            ]);
    }

    public function down(): void
    {
        Schema::table('vehicle_requests', function (Blueprint $table) {
            $table->dropColumn(['journey_status', 'journey_started_at', 'journey_completed_at']);
        });
    }
};
