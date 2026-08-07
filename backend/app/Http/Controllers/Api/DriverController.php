<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;
use App\Models\VehicleRequest;

class DriverController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'departure_at' => ['nullable', 'date', 'required_with:expected_return_at'],
            'expected_return_at' => ['nullable', 'date', 'after:departure_at', 'required_with:departure_at'],
            'ignore_request_id' => ['nullable', 'integer', 'exists:vehicle_requests,id'],
        ]);
        $drivers = Driver::with('user:id,employee_id,email,department,profile_picture_path')
            ->orderBy('driver_id')
            ->get();

        if (isset($validated['departure_at'], $validated['expected_return_at'])) {
            $startsAt = Carbon::parse($validated['departure_at']);
            $endsAt = Carbon::parse($validated['expected_return_at']);
            $vehicleRequest = isset($validated['ignore_request_id'])
                ? VehicleRequest::find($validated['ignore_request_id'])
                : null;
            $drivers->each(function (Driver $driver) use ($startsAt, $endsAt, $validated, $vehicleRequest): void {
                $statusForSlot = $driver->operationalStatusFor(
                    $startsAt,
                    $endsAt,
                    $validated['ignore_request_id'] ?? null,
                );
                $driver->setAttribute(
                    'available_for_slot',
                    $statusForSlot === 'available' || ! $driver->hasScheduleConflict(
                        $startsAt,
                        $endsAt,
                        $validated['ignore_request_id'] ?? null,
                        $vehicleRequest,
                    ),
                );
                $driver->setAttribute('status_for_slot', $statusForSlot);
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

        $trips = $driver->vehicleRequests()->whereIn('status', ['approved', 'completed']);
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

        $requests = $driver->vehicleRequests()
            ->where('status', 'approved')
            ->where('journey_status', '!=', 'completed')
            ->with('allocatedVehicle', 'previousAllocatedVehicle')
            ->orderBy('departure_at')
            ->get();
        $seen = collect();
        $trips = $requests->map(function (VehicleRequest $trip) use ($seen): ?array {
            if ($seen->contains($trip->id)) {
                return null;
            }
            $group = $trip->consolidatedRequests();
            $group->each(fn (VehicleRequest $member) => $seen->push($member->id));

            return $this->tripPayload($trip, $group);
        })->filter()->values();

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
            // Include legacy rows that recorded only journey_status=completed.
            ->whereIn('status', ['approved', 'completed', 'cancelled'])
            ->where(function ($query): void {
                $query->where('journey_status', 'completed')
                    ->orWhere('status', 'cancelled');
            })
            ->with('allocatedVehicle')
            ->orderByDesc('journey_completed_at')
            ->get()
            ->map(fn ($trip): array => $this->tripPayload($trip));

        return response()->json([
            'success' => true,
            'data' => ['trips' => $trips],
        ]);
    }

    private function tripPayload($trip, $group = null): array
    {
        $group ??= collect([$trip]);
        $consolidated = $trip->consolidatedJourneyPayload();
        $status = match ($trip->journey_status) {
            'ongoing' => 'Ongoing',
            'issue' => 'Issue',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled',
            default => 'Pending',
        };

        if ($trip->status === 'cancelled') {
            $status = 'Cancelled';
        }

        return [
            'id' => $trip->id,
            'reference' => 'REQ-' . str_pad((string) $trip->id, 4, '0', STR_PAD_LEFT),
            'departure_at' => $consolidated['departure_at'],
            'expected_return_at' => $consolidated['expected_return_at'],
            'purpose' => $group->count() > 1 ? 'Consolidated journey (' . $group->count() . ' requests)' : $trip->purpose,
            'destination' => $group->pluck('destination')->unique()->implode(', '),
            'requester_name' => $trip->requester_name,
            'passenger_count' => $consolidated['passenger_count'],
            'passenger_names' => $trip->passenger_names,
            'parking_location' => $trip->parking_location,
            'status' => $status,
            'journey_status' => $trip->journey_status,
            'journey_started_at' => $trip->journey_started_at?->toISOString(),
            'journey_completed_at' => $trip->journey_completed_at?->toISOString(),
            'cancelled_at' => $trip->cancelled_at?->toISOString(),
            'vehicle' => $trip->allocatedVehicle,
            'previous_vehicle' => $trip->previousAllocatedVehicle,
            'reallocation_reason' => $trip->reallocation_reason,
            'reallocated_at' => $trip->reallocated_at?->toISOString(),
            'is_consolidated' => $group->count() > 1,
            'request_count' => $group->count(),
            'requests' => $consolidated['requests'],
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
            $group = $vehicleRequest->consolidatedRequests();
            if ($group->contains(fn (VehicleRequest $trip) => $trip->journey_status !== 'scheduled')) {
                return response()->json(['success' => false, 'message' => 'Only a scheduled journey can be started.'], 422);
            }

            DB::transaction(function () use ($vehicleRequest): void {
                $lockedRequest = VehicleRequest::query()
                    ->lockForUpdate()
                    ->findOrFail($vehicleRequest->id);
                $vehicle = $lockedRequest->allocated_vehicle_id
                    ? Vehicle::query()->lockForUpdate()->find($lockedRequest->allocated_vehicle_id)
                    : null;

                $group = $lockedRequest->consolidatedRequests();
                VehicleRequest::query()->whereKey($group->pluck('id'))->update([
                    'journey_status' => 'ongoing',
                    'journey_started_at' => now(),
                ]);

                $vehicle?->update(['status' => 'unavailable']);
            });
        } else {
            $group = $vehicleRequest->consolidatedRequests();
            if ($group->contains(fn (VehicleRequest $trip) => ! in_array($trip->journey_status, ['ongoing', 'issue'], true))) {
                return response()->json(['success' => false, 'message' => 'Start the journey before completing it.'], 422);
            }

            DB::transaction(function () use ($vehicleRequest, $driver): void {
                $lockedRequest = VehicleRequest::query()
                    ->lockForUpdate()
                    ->findOrFail($vehicleRequest->id);
                $lockedDriver = Driver::query()->lockForUpdate()->findOrFail($driver->id);
                $vehicle = $lockedRequest->allocated_vehicle_id
                    ? Vehicle::query()->lockForUpdate()->find($lockedRequest->allocated_vehicle_id)
                    : null;

                $group = $lockedRequest->consolidatedRequests();
                VehicleRequest::query()->whereKey($group->pluck('id'))->update([
                    'status' => 'completed',
                    'journey_status' => 'completed',
                    'journey_completed_at' => now(),
                ]);

                $driverHasAnotherJourney = VehicleRequest::query()
                    ->where('allocated_driver_id', $lockedDriver->id)
                    ->whereKeyNot($lockedRequest->id)
                    ->whereIn('status', ['vehicle_allocated', 'approved'])
                    ->where('journey_status', '!=', 'completed')
                    ->exists();

                if (! $driverHasAnotherJourney) {
                    $lockedDriver->update([
                        'allocated_vehicle' => null,
                        'current_assignment' => null,
                    ]);
                }

                if ($vehicle) {
                    $vehicleHasAnotherOngoingJourney = VehicleRequest::query()
                        ->where('allocated_vehicle_id', $vehicle->id)
                        ->whereKeyNot($lockedRequest->id)
                        ->where('status', 'approved')
                        ->whereIn('journey_status', ['ongoing', 'issue'])
                        ->exists();

                    $vehicleHasAnotherScheduledJourney = VehicleRequest::query()
                        ->where('allocated_vehicle_id', $vehicle->id)
                        ->whereKeyNot($lockedRequest->id)
                        ->whereIn('status', ['vehicle_allocated', 'approved'])
                        ->where('journey_status', 'scheduled')
                        ->exists();

                    $vehicle->update([
                        'status' => $vehicleHasAnotherOngoingJourney
                            ? 'unavailable'
                            : ($vehicleHasAnotherScheduledJourney ? 'scheduled_trip' : 'available'),
                    ]);
                }
            });
        }

        return response()->json([
            'success' => true,
            'message' => $validated['action'] === 'start' ? 'Trip started.' : 'Trip completed.',
            'data' => [
                'trip' => $this->tripPayload($vehicleRequest->fresh()->load('allocatedVehicle')),
                'driver_status' => $driver->fresh()->status,
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
        return response()->json([
            'success' => true,
            'data' => ['driver' => $driver->load('user:id,employee_id,email,department,profile_picture_path')],
        ]);
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
