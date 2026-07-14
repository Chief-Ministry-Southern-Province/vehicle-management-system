<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class VehicleController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['success' => true, 'data' => ['vehicles' => Vehicle::latest()->get()]]);
    }

    public function store(Request $request): JsonResponse
    {
        $vehicle = Vehicle::create($this->payload($request));
        return response()->json(['success' => true, 'message' => 'Vehicle registered successfully.', 'data' => ['vehicle' => $vehicle]], 201);
    }

    public function show(Vehicle $vehicle): JsonResponse
    {
        return response()->json(['success' => true, 'data' => ['vehicle' => $vehicle]]);
    }

    public function update(Request $request, Vehicle $vehicle): JsonResponse
    {
        $previousImage = $vehicle->image_path;
        $vehicle->update($this->payload($request, $vehicle));

        if ($previousImage && $previousImage !== $vehicle->image_path) {
            Storage::disk('public')->delete($previousImage);
        }

        return response()->json(['success' => true, 'message' => 'Vehicle updated successfully.', 'data' => ['vehicle' => $vehicle->fresh()]]);
    }

    private function payload(Request $request, ?Vehicle $vehicle = null): array
    {
        $validated = $request->validate([
            'registration_number' => ['required', 'string', 'max:50', Rule::unique('vehicles', 'registration_number')->ignore($vehicle)],
            'vehicle_type' => ['required', 'string', 'max:100'],
            'make' => ['required', 'string', 'max:100'],
            'model' => ['required', 'string', 'max:100'],
            'manufacturing_year' => ['nullable', 'integer', 'min:1900', 'max:' . (now()->year + 1)],
            'color' => ['nullable', 'string', 'max:100'],
            'vin' => ['nullable', 'string', 'max:100', Rule::unique('vehicles', 'vin')->ignore($vehicle)],
            'engine_number' => ['nullable', 'string', 'max:100', Rule::unique('vehicles', 'engine_number')->ignore($vehicle)],
            'fuel_type' => ['nullable', 'string', 'max:100'],
            'fuel_capacity' => ['nullable', 'integer', 'min:0', 'max:1000'],
            'seat_capacity' => ['nullable', 'integer', 'min:1', 'max:100'],
            'technical_notes' => ['nullable', 'string', 'max:5000'],
            'registration_expiry' => ['nullable', 'date'],
            'revenue_license_expiry' => ['nullable', 'date'],
            'insurance_policy' => ['nullable', 'string', 'max:100'],
            'insurance_provider' => ['nullable', 'string', 'max:255'],
            'assignment' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(['available', 'unavailable', 'maintenance'])],
            'last_service_date' => ['nullable', 'date'],
            'fuel_level' => ['required', 'integer', 'min:0', 'max:100'],
            'service_category' => ['nullable', 'string', 'max:100'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:10240'],
        ]);

        if ($request->hasFile('image')) {
            $validated['image_path'] = $request->file('image')->store('vehicle-images', 'public');
        }
        unset($validated['image']);

        return $validated;
    }
}
