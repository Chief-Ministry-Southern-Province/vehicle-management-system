<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vehicle_requests', function (Blueprint $table) {
            $table->string('starting_location')->nullable()->after('purpose');
            $table->decimal('starting_latitude', 10, 7)->nullable()->after('starting_location');
            $table->decimal('starting_longitude', 10, 7)->nullable()->after('starting_latitude');
            $table->decimal('destination_latitude', 10, 7)->nullable()->after('destination');
            $table->decimal('destination_longitude', 10, 7)->nullable()->after('destination_latitude');
            $table->decimal('distance_km', 10, 2)->nullable()->after('destination_longitude');
        });
    }

    public function down(): void
    {
        Schema::table('vehicle_requests', function (Blueprint $table) {
            $table->dropColumn(['starting_location', 'starting_latitude', 'starting_longitude', 'destination_latitude', 'destination_longitude', 'distance_km']);
        });
    }
};
