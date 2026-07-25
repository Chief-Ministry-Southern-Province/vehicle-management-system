<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vehicle_requests', function (Blueprint $table) {
            // These are requester-supplied schedule values, not audit timestamps.
            // In the existing MySQL schema departure_at was a TIMESTAMP with
            // ON UPDATE CURRENT_TIMESTAMP, which replaced it on every workflow action.
            $table->dateTime('departure_at')->change();
            $table->dateTime('expected_return_at')->change();
        });
    }

    public function down(): void
    {
        // Intentionally retain DATETIME semantics. Restoring an automatically
        // updated trip time would reintroduce request data corruption.
    }
};
