<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vehicle_requests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            // Keep the requester's name as submitted-account history even if the profile changes later.
            $table->string('requester_name');
            $table->string('purpose');
            $table->string('destination');
            $table->dateTime('departure_at');
            $table->dateTime('expected_return_at');
            $table->unsignedInteger('passenger_count')->default(1);
            $table->text('passenger_names')->nullable();
            $table->string('attachment_path')->nullable();
            $table->string('attachment_original_name')->nullable();
            $table->string('status')->default('submitted');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicle_requests');
    }
};
