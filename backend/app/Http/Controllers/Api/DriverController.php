<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class DriverController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['success' => true, 'data' => ['drivers' => Driver::orderBy('driver_id')->get()]]);
    }

    public function store(Request $request): JsonResponse
    {
        $driver = Driver::create($this->payload($request));

        return response()->json(['success' => true, 'message' => 'Driver registered successfully.', 'data' => ['driver' => $driver]], 201);
    }

    public function show(Driver $driver): JsonResponse
    {
        return response()->json(['success' => true, 'data' => ['driver' => $driver]]);
    }

    public function update(Request $request, Driver $driver): JsonResponse
    {
        $driver->update($this->payload($request, $driver));

        return response()->json(['success' => true, 'message' => 'Driver updated successfully.', 'data' => ['driver' => $driver->fresh()]]);
    }

    private function payload(Request $request, ?Driver $driver = null): array
    {
        return $request->validate([
            'driver_id' => ['required', 'string', 'max:30', Rule::unique('drivers', 'driver_id')->ignore($driver)],
            'full_name' => ['required', 'string', 'max:255'],
            'date_of_birth' => ['required', 'date', 'before:today'],
            'nic' => ['required', 'string', 'max:20', Rule::unique('drivers', 'nic')->ignore($driver)],
            'address' => ['required', 'string', 'max:500'],
            'contact_number' => ['required', 'string', 'max:30'],
            'blood_group' => ['nullable', Rule::in(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])],
            'licence_number' => ['required', 'string', 'max:50', Rule::unique('drivers', 'licence_number')->ignore($driver)],
            'licence_type' => ['required', 'string', 'max:100'],
            'licence_renewal_date' => ['required', 'date'],
            'allocated_vehicle' => ['nullable', 'string', 'max:50', 'exists:vehicles,registration_number'],
            'status' => ['required', Rule::in(['available', 'on_trip', 'unavailable'])],
        ]);
    }
}
