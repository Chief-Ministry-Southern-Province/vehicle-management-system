<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->decimal('fuel_efficiency', 8, 2)->nullable()->after('fuel_capacity');
            $table->string('fuel_efficiency_unit', 20)->nullable()->after('fuel_efficiency');
        });
    }

    public function down(): void
    {
        Schema::table('vehicles', function (Blueprint $table) {
            $table->dropColumn(['fuel_efficiency', 'fuel_efficiency_unit']);
        });
    }
};
