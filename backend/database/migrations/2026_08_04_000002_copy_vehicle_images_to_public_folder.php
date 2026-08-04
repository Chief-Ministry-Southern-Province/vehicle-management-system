<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

return new class extends Migration
{
    public function up(): void
    {
        $targetDirectory = public_path('vehicle-images');
        File::ensureDirectoryExists($targetDirectory);

        foreach (Storage::disk('public')->files('vehicle-images') as $sourcePath) {
            $targetPath = $targetDirectory . DIRECTORY_SEPARATOR . basename($sourcePath);
            if (! File::exists($targetPath)) {
                File::copy(Storage::disk('public')->path($sourcePath), $targetPath);
            }
        }
    }

    public function down(): void
    {
        // Uploaded public files are intentionally retained on rollback.
    }
};
