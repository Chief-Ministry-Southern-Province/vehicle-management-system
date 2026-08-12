<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vehicle_requests', function (Blueprint $table) {
            $table->unsignedInteger('route_duration_seconds')->nullable()->after('distance_km');
            $table->json('route_geometry')->nullable()->after('route_duration_seconds');
        });
    }

    public function down(): void
    {
        Schema::table('vehicle_requests', function (Blueprint $table) {
            $table->dropColumn(['route_duration_seconds', 'route_geometry']);
        });
    }
};
