<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $this->convert('Asia/Colombo', 'UTC');
    }

    public function down(): void
    {
        $this->convert('UTC', 'Asia/Colombo');
    }

    private function convert(string $fromTimezone, string $toTimezone): void
    {
        DB::table('vehicle_requests')
            ->select(['id', 'departure_at', 'expected_return_at'])
            ->orderBy('id')
            ->chunkById(100, function ($requests) use ($fromTimezone, $toTimezone): void {
                foreach ($requests as $request) {
                    DB::table('vehicle_requests')
                        ->where('id', $request->id)
                        ->update([
                            'departure_at' => Carbon::parse($request->departure_at, $fromTimezone)
                                ->setTimezone($toTimezone)
                                ->format('Y-m-d H:i:s'),
                            'expected_return_at' => Carbon::parse($request->expected_return_at, $fromTimezone)
                                ->setTimezone($toTimezone)
                                ->format('Y-m-d H:i:s'),
                        ]);
                }
            });
    }
};
