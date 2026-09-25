<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SystemSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SystemSettingsController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => ['settings' => $this->settingsPayload()],
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'odometer_readings_required' => ['required', 'boolean'],
        ]);

        SystemSetting::setOdometerReadingsRequired(
            $validated['odometer_readings_required'],
            $request->user()->id,
        );

        return response()->json([
            'success' => true,
            'message' => 'Odometer-reading requirement updated.',
            'data' => ['settings' => $this->settingsPayload()],
        ]);
    }

    private function settingsPayload(): array
    {
        return [
            'odometer_readings_required' => SystemSetting::odometerReadingsRequired(),
        ];
    }
}
