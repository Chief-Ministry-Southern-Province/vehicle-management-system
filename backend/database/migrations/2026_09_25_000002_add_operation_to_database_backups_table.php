<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('database_backups', function (Blueprint $table): void {
            $table->string('operation', 20)->default('export')->after('database_driver');
        });
    }

    public function down(): void
    {
        Schema::table('database_backups', function (Blueprint $table): void {
            $table->dropColumn('operation');
        });
    }
};
