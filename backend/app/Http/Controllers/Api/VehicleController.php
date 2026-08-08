<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Support\Carbon;

class VehicleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'departure_at' => ['nullable', 'date', 'required_with:expected_return_at'],
            'expected_return_at' => ['nullable', 'date', 'after:departure_at', 'required_with:departure_at'],
            'ignore_request_id' => ['nullable', 'integer', 'exists:vehicle_requests,id'],
        ]);
        $vehicles = Vehicle::latest()->get();

        if (isset($validated['departure_at'], $validated['expected_return_at'])) {
            $startsAt = Carbon::parse($validated['departure_at']);
            $endsAt = Carbon::parse($validated['expected_return_at']);
            $vehicleRequest = isset($validated['ignore_request_id'])
                ? \App\Models\VehicleRequest::find($validated['ignore_request_id'])
                : null;
            $vehicles->each(function (Vehicle $vehicle) use ($startsAt, $endsAt, $validated, $vehicleRequest): void {
                $vehicle->setAttribute(
                    'available_for_slot',
                    in_array($vehicle->status, ['available', 'scheduled_trip'], true)
                        && ! $vehicle->hasScheduleConflict(
                            $startsAt,
                            $endsAt,
                            $validated['ignore_request_id'] ?? null,
                            $vehicleRequest,
                        ),
                );
            });
        }

        return response()->json(['success' => true, 'data' => ['vehicles' => $vehicles]]);
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
            File::delete(public_path($previousImage));
        }

        return response()->json(['success' => true, 'message' => 'Vehicle updated successfully.', 'data' => ['vehicle' => $vehicle->fresh()]]);
    }

    private function payload(Request $request, ?Vehicle $vehicle = null): array
    {
        foreach (['service_details', 'repair_details', 'fuel_details'] as $detailsKey) {
            if (is_string($request->input($detailsKey))) {
                $request->merge([$detailsKey => json_decode($request->input($detailsKey), true)]);
            }
        }

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
            'status' => ['required', Rule::in(['available', 'scheduled_trip', 'unavailable', 'maintenance'])],
            'last_service_date' => ['nullable', 'date'],
            'fuel_level' => ['required', 'integer', 'min:0', 'max:100'],
            'service_category' => ['nullable', 'string', 'max:100'],
            'service_details' => ['nullable', 'array', 'max:100'],
            'service_details.*.service_date' => ['required', 'date'],
            'service_details.*.service_type' => ['required', 'string', 'max:255'],
            'service_details.*.cost' => ['required', 'numeric', 'min:0', 'max:999999999.99'],
            'repair_details' => ['nullable', 'array', 'max:100'],
            'repair_details.*.repair_date' => ['required', 'date'],
            'repair_details.*.repair_type' => ['required', 'string', 'max:255'],
            'repair_details.*.cost' => ['required', 'numeric', 'min:0', 'max:999999999.99'],
            'fuel_details' => ['nullable', 'array', 'max:100'],
            'fuel_details.*.date' => ['required', 'date'],
            'fuel_details.*.fuel_type' => ['required', Rule::in(['diesel', 'petrol'])],
            'fuel_details.*.capacity' => ['required', 'numeric', 'min:0', 'max:1000'],
            'fuel_details.*.cost' => ['required', 'numeric', 'min:0', 'max:999999999.99'],
            'image' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:10240'],
            'images' => ['nullable', 'array', 'max:10'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:10240'],
        ]);

        if ($request->hasFile('image')) {
            $validated['image_path'] = $this->storePublicImage($request->file('image'));
        }
        if ($request->hasFile('images')) {
            $newPaths = collect($request->file('images'))
                ->map(fn ($image): string => $this->storePublicImage($image))
                ->all();
            $validated['image_paths'] = [
                ...($vehicle?->image_paths ?? []),
                ...$newPaths,
            ];
        }
        unset($validated['image'], $validated['images']);

        return $validated;
    }

    private function storePublicImage($image): string
    {
        $directory = public_path('vehicle-images');
        File::ensureDirectoryExists($directory);
        $filename = Str::uuid() . '.' . strtolower($image->getClientOriginalExtension());
        $image->move($directory, $filename);

        return 'vehicle-images/' . $filename;
    }
}
