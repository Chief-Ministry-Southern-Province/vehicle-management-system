<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\VehicleRequest;

class DriverController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'departure_at' => ['nullable', 'date', 'required_with:expected_return_at'],
            'expected_return_at' => ['nullable', 'date', 'after:departure_at', 'required_with:departure_at'],
        ]);
        $drivers = Driver::orderBy('driver_id')->get();

        if (isset($validated['departure_at'], $validated['expected_return_at'])) {
            $drivers->each(function (Driver $driver) use ($validated): void {
                $driver->setAttribute(
                    'available_for_slot',
                    $driver->isActive()
                        && ! $driver->hasScheduleConflict($validated['departure_at'], $validated['expected_return_at']),
                );
            });
        }

        return response()->json(['success' => true, 'data' => ['drivers' => $drivers]]);
    }

    public function dashboardStats(Request $request): JsonResponse
    {
        $driver = $request->user()->driver;

        if (! $driver) {
            return response()->json([
                'success' => false,
                'message' => 'No driver directory record is linked to this account.',
            ], 404);
        }

        $trips = $driver->vehicleRequests()->where('status', 'approved');
        $total = (clone $trips)->count();
        $completed = (clone $trips)->where('journey_status', 'completed')->count();

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => [
                    'total_trips' => $total,
                    'today_trips' => (clone $trips)->whereDate('departure_at', today())->count(),
                    'scheduled_trips' => (clone $trips)->where('journey_status', '!=', 'completed')->count(),
                    'completed_trips' => $completed,
                    'completion_rate' => $total > 0 ? (int) round(($completed / $total) * 100) : 0,
                ],
            ],
        ]);
    }

    public function scheduledJourneys(Request $request): JsonResponse
    {
        $driver = $request->user()->driver;

        if (! $driver) {
            return response()->json([
                'success' => false,
                'message' => 'No driver directory record is linked to this account.',
            ], 404);
        }

        $trips = $driver->vehicleRequests()
            ->where('status', 'approved')
            ->where('journey_status', '!=', 'completed')
            ->with('allocatedVehicle')
            ->orderBy('departure_at')
            ->get()
            ->map(fn ($trip): array => $this->tripPayload($trip));

        return response()->json([
            'success' => true,
            'data' => ['trips' => $trips],
        ]);
    }

    public function tripHistory(Request $request): JsonResponse
    {
        $driver = $request->user()->driver;

        if (! $driver) {
            return response()->json([
                'success' => false,
                'message' => 'No driver directory record is linked to this account.',
            ], 404);
        }

        $trips = $driver->vehicleRequests()
            ->where('status', 'approved')
            ->where('journey_status', 'completed')
            ->with('allocatedVehicle')
            ->orderByDesc('journey_completed_at')
            ->get()
            ->map(fn ($trip): array => $this->tripPayload($trip));

        return response()->json([
            'success' => true,
            'data' => ['trips' => $trips],
        ]);
    }

    private function tripPayload($trip): array
    {
        $status = match ($trip->journey_status) {
            'ongoing' => 'Ongoing',
            'issue' => 'Issue',
            'completed' => 'Completed',
            default => 'Pending',
        };

        return [
            'id' => $trip->id,
            'reference' => 'REQ-' . str_pad((string) $trip->id, 4, '0', STR_PAD_LEFT),
            'departure_at' => $trip->departure_at->toISOString(),
            'expected_return_at' => $trip->expected_return_at->toISOString(),
            'purpose' => $trip->purpose,
            'destination' => $trip->destination,
            'requester_name' => $trip->requester_name,
            'passenger_count' => $trip->passenger_count,
            'passenger_names' => $trip->passenger_names,
            'status' => $status,
            'journey_status' => $trip->journey_status,
            'journey_started_at' => $trip->journey_started_at?->toISOString(),
            'journey_completed_at' => $trip->journey_completed_at?->toISOString(),
            'vehicle' => $trip->allocatedVehicle,
        ];
    }

    public function updateJourneyStatus(Request $request, VehicleRequest $vehicleRequest): JsonResponse
    {
        $driver = $request->user()->driver;

        if (! $driver || $vehicleRequest->allocated_driver_id !== $driver->id || $vehicleRequest->status !== 'approved') {
            return response()->json(['success' => false, 'message' => 'Journey not found.'], 404);
        }

        $validated = $request->validate([
            'action' => ['required', Rule::in(['start', 'complete'])],
        ]);

        if ($validated['action'] === 'start') {
            if ($vehicleRequest->journey_status !== 'scheduled') {
                return response()->json(['success' => false, 'message' => 'Only a scheduled journey can be started.'], 422);
            }

            $vehicleRequest->update([
                'journey_status' => 'ongoing',
                'journey_started_at' => now(),
            ]);
        } else {
            if (! in_array($vehicleRequest->journey_status, ['ongoing', 'issue'], true)) {
                return response()->json(['success' => false, 'message' => 'Start the journey before completing it.'], 422);
            }

            $vehicleRequest->update([
                'journey_status' => 'completed',
                'journey_completed_at' => now(),
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => $validated['action'] === 'start' ? 'Trip started.' : 'Trip completed.',
            'data' => [
                'trip' => $this->tripPayload($vehicleRequest->fresh()->load('allocatedVehicle')),
                'driver_status' => $validated['action'] === 'start' ? 'ongoing' : 'available',
            ],
        ]);
    }

    public function assignedVehicle(Request $request): JsonResponse
    {
        $driver = $request->user()->driver;

        if (! $driver) {
            return response()->json([
                'success' => false,
                'message' => 'No driver directory record is linked to this account.',
            ], 404);
        }

        $registration = $driver->allocated_vehicle
            ?: data_get($driver->current_assignment, 'vehicle_registration');
        $vehicle = $registration
            ? Vehicle::where('registration_number', $registration)->first()
            : null;

        return response()->json([
            'success' => true,
            'data' => ['vehicle' => $vehicle],
        ]);
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

    public function destroy(Driver $driver): JsonResponse
    {
        $driver->delete();

        return response()->json(['success' => true, 'message' => 'Driver deleted successfully.']);
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
            'status' => ['sometimes', Rule::in(['active', 'inactive'])],
            'previous_journeys' => ['nullable', 'array', 'max:100'],
            'previous_journeys.*.date' => ['required', 'date'],
            'previous_journeys.*.origin' => ['required', 'string', 'max:255'],
            'previous_journeys.*.destination' => ['required', 'string', 'max:255'],
            'previous_journeys.*.purpose' => ['required', 'string', 'max:255'],
            'previous_journeys.*.vehicle_registration' => ['nullable', 'string', 'max:50'],
            'previous_journeys.*.status' => ['required', 'string', 'max:50'],
        ]);
    }
}
