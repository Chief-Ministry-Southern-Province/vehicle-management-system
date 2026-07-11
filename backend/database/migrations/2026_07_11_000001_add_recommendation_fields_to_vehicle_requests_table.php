<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vehicle_requests', function (Blueprint $table) {
            $table->string('recommendation_status')->default('pending')->after('status');
            $table->string('department_priority')->nullable()->after('recommendation_status');
            $table->text('recommendation_notes')->nullable()->after('department_priority');
            $table->foreignId('recommended_by')->nullable()->constrained('users')->nullOnDelete()->after('recommendation_notes');
            $table->timestamp('recommended_at')->nullable()->after('recommended_by');
        });
    }

    public function down(): void
    {
        Schema::table('vehicle_requests', function (Blueprint $table) {
            $table->dropConstrainedForeignId('recommended_by');
            $table->dropColumn(['recommendation_status', 'department_priority', 'recommendation_notes', 'recommended_at']);
        });
    }
};
