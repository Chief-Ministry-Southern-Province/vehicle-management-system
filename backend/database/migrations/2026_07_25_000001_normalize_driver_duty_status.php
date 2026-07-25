<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('drivers')
            ->whereIn('status', ['available', 'on_trip'])
            ->update(['status' => 'active']);

        DB::table('drivers')
            ->whereNotIn('status', ['active'])
            ->update(['status' => 'inactive']);
    }

    public function down(): void
    {
        DB::table('drivers')
            ->where('status', 'active')
            ->update(['status' => 'available']);

        DB::table('drivers')
            ->where('status', 'inactive')
            ->update(['status' => 'unavailable']);
    }
};
