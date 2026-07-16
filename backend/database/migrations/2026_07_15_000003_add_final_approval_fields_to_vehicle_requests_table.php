<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vehicle_requests', function (Blueprint $table) {
            $table->foreignId('approved_by')->nullable()->constrained('users')->nullOnDelete()->after('driver_notified_at');
            $table->timestamp('approved_at')->nullable()->after('approved_by');
        });

        DB::table('vehicle_requests')->where('status', 'approved')->whereNull('approved_at')->update(['approved_at' => DB::raw('updated_at')]);
    }

    public function down(): void
    {
        Schema::table('vehicle_requests', function (Blueprint $table) {
            $table->dropConstrainedForeignId('approved_by');
            $table->dropColumn('approved_at');
        });
    }
};
