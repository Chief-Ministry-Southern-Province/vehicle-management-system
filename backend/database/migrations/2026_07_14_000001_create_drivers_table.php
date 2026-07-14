<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('drivers', function (Blueprint $table) {
            $table->id();
            $table->string('driver_id', 30)->unique();
            $table->string('full_name');
            $table->date('date_of_birth');
            $table->string('nic', 20)->unique();
            $table->string('address', 500);
            $table->string('contact_number', 30);
            $table->string('blood_group', 3)->nullable();
            $table->string('licence_number', 50)->unique();
            $table->string('licence_type', 100);
            $table->date('licence_renewal_date');
            $table->string('allocated_vehicle')->nullable();
            $table->string('status')->default('unavailable');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('drivers');
    }
};
