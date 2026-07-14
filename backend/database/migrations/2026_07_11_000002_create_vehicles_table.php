<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('registration_number')->unique();
            $table->string('vehicle_type');
            $table->string('make');
            $table->string('model');
            $table->unsignedSmallInteger('manufacturing_year')->nullable();
            $table->string('color')->nullable();
            $table->string('vin')->nullable()->unique();
            $table->string('engine_number')->nullable()->unique();
            $table->string('fuel_type')->nullable();
            $table->unsignedSmallInteger('fuel_capacity')->nullable();
            $table->text('technical_notes')->nullable();
            $table->date('registration_expiry')->nullable();
            $table->date('revenue_license_expiry')->nullable();
            $table->string('insurance_policy')->nullable();
            $table->string('insurance_provider')->nullable();
            $table->string('assignment')->nullable();
            $table->string('status')->default('unavailable');
            $table->date('last_service_date')->nullable();
            $table->unsignedTinyInteger('fuel_level')->default(0);
            $table->string('service_category')->nullable();
            $table->string('image_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
