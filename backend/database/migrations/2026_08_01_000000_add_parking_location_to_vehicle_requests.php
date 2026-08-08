<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vehicle_requests', function (Blueprint $table): void {
            $table->string('parking_location', 500)->nullable()->after('allocated_at');
        });
    }

    public function down(): void
    {
        Schema::table('vehicle_requests', function (Blueprint $table): void {
            $table->dropColumn('parking_location');
        });
    }
};
