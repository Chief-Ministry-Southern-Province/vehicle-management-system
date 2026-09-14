<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('predefined_journeys', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('starting_location');
            $table->string('destination');
            $table->decimal('distance_km', 10, 2);
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });

        Schema::table('vehicle_requests', function (Blueprint $table) {
            $table->foreignId('predefined_journey_id')
                ->nullable()
                ->after('user_id')
                ->constrained('predefined_journeys')
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('vehicle_requests', function (Blueprint $table) {
            $table->dropConstrainedForeignId('predefined_journey_id');
        });

        Schema::dropIfExists('predefined_journeys');
    }
};
