<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('departments', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });

        $now = now();
        DB::table('departments')->insert(array_map(
            fn (string $name): array => [
                'name' => $name,
                'created_at' => $now,
                'updated_at' => $now,
            ],
            [
                'Accounting',
                'Admin',
                'Administration',
                'Health',
                'IT Branch',
                'Local Government',
                'Planning',
                'Secretariat',
                'Transport',
            ],
        ));
    }

    public function down(): void
    {
        Schema::dropIfExists('departments');
    }
};
