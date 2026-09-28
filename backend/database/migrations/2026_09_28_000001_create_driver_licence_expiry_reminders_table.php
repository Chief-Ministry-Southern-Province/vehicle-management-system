<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('driver_licence_expiry_reminders', function (Blueprint $table): void {
            $table->id();
            $table->foreignId('driver_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->date('expiry_date');
            $table->string('reminder_type', 20);
            $table->timestamp('notified_at');
            $table->timestamps();

            $table->unique(
                ['driver_id', 'user_id', 'expiry_date', 'reminder_type'],
                'driver_licence_expiry_reminder_unique',
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('driver_licence_expiry_reminders');
    }
};
