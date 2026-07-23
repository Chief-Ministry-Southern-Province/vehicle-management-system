<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VehicleRequest;
use App\Models\Driver;
use App\Models\Vehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\Builder;
use Throwable;

class VehicleRequestController extends Controller
{
    /** Finally approved journeys visible to the Subject Officer. */
    public function approvedJourneysIndex(): JsonResponse
    {
        $requests = VehicleRequest::query()
            ->where('status', 'approved')
            ->with(
                'user:id,name,employee_id,department',
                'recommender:id,name,employee_id,department',
                'allocatedVehicle',
                'allocatedDriver',
                'allocator:id,name,employee_id',
                'approver:id,name,employee_id',
            )
            ->latest('approved_at')
            ->get();

        return response()->json([
            'success' => true,
            'data' => ['requests' => $requests, 'total' => $requests->count()],
        ]);
    }

    /** Vehicle-request history belonging to the authenticated requester. */
    public function personalIndex(Request $request): JsonResponse
    {
        $requests = VehicleRequest::query()
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => ['requests' => $requests, 'total' => $requests->count()],
        ]);
    }

    /** A requester may only view their own request; allocation details remain private until final approval. */
    public function personalShow(Request $request, VehicleRequest $vehicleRequest): JsonResponse
    {
        if ($vehicleRequest->user_id !== $request->user()->id) {
            return response()->json(['success' => false, 'message' => 'Request not found.'], 404);
        }

        $vehicleRequest->load('user:id,name,employee_id,department', 'recommender:id,name,employee_id,department', 'approver:id,name');

        if ($vehicleRequest->status === 'approved') {
            $vehicleRequest->load('allocatedVehicle', 'allocatedDriver');
        }

        return response()->json(['success' => true, 'data' => ['vehicle_request' => $vehicleRequest]]);
    }

    /** Recommended vehicle requests visible to the Deputy Secretary allocation queue. */
    public function approvalIndex(Request $request): JsonResponse
    {
        $status = $request->query('status', 'pending');
        if (! in_array($status, ['pending', 'allocated', 'all'], true)) {
            return response()->json(['success' => false, 'message' => 'Invalid request status filter.'], 422);
        }

        $baseQuery = VehicleRequest::query();
        $query = (clone $baseQuery)
            ->with('user:id,name,employee_id,department', 'recommender:id,name')
            ->latest();

        if ($status === 'pending') {
            $query->whereNotIn('status', ['vehicle_allocated', 'approved', 'rejected']);
        } elseif ($status === 'allocated') {
            $query->where('status', 'vehicle_allocated');
        }

        $requests = $query->get();

        return response()->json([
            'success' => true,
            'data' => [
                'requests' => $requests,
                'total' => $requests->count(),
                'stats' => [
                    'pending' => (clone $baseQuery)->whereNotIn('status', ['vehicle_allocated', 'approved', 'rejected'])->count(),
                    'allocated' => (clone $baseQuery)->where('status', 'vehicle_allocated')->count(),
                    'approved' => (clone $baseQuery)->where('status', 'approved')->count(),
                    'rejected' => (clone $baseQuery)->where('status', 'rejected')->count(),
                    'all' => (clone $baseQuery)->count(),
                ],
            ],
        ]);
    }

    /** A complete request record for the Deputy Secretary workspace. */
    public function approvalShow(VehicleRequest $vehicleRequest): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'vehicle_request' => $vehicleRequest->load(
                    'user:id,name,employee_id,department',
                    'recommender:id,name,employee_id,department',
                    'allocatedVehicle',
                    'allocatedDriver',
                    'allocator:id,name,employee_id',
                    'approver:id,name,employee_id',
                ),
            ],
        ]);
    }

    /** Allocate a driver and vehicle; this is not a request approval. */
    public function allocate(Request $request, VehicleRequest $vehicleRequest): JsonResponse
    {
        if (in_array($vehicleRequest->status, ['vehicle_allocated', 'approved'], true)) {
            return response()->json([
                'success' => true,
                'message' => 'This request has already been allocated and sent for final approval.',
                'data' => ['vehicle_request' => $vehicleRequest->load('user:id,name,employee_id,department', 'recommender:id,name,employee_id,department')],
            ]);
        }

        if ($vehicleRequest->status === 'rejected') {
            return response()->json(['success' => false, 'message' => 'A rejected request cannot receive a vehicle allocation.'], 422);
        }

        if ($vehicleRequest->status !== 'recommended') {
            return response()->json(['success' => false, 'message' => 'Only requests recommended by a Department Officer can receive a vehicle allocation.'], 422);
        }

        $validated = $request->validate([
            'vehicle_id' => ['required', 'integer', 'exists:vehicles,id'],
            'driver_id' => ['required', 'integer', 'exists:drivers,id'],
        ]);

        DB::transaction(function () use ($request, $validated, $vehicleRequest): void {
            $vehicle = Vehicle::query()->lockForUpdate()->findOrFail($validated['vehicle_id']);
            $driver = Driver::query()->lockForUpdate()->findOrFail($validated['driver_id']);

            if ($vehicle->status !== 'available') {
                abort(422, 'The selected vehicle is no longer available.');
            }

            if ($driver->hasScheduleConflict(
                $vehicleRequest->departure_at,
                $vehicleRequest->expected_return_at,
                $vehicleRequest->id,
            )) {
                abort(422, 'The selected driver already has a journey during this time slot.');
            }

            $vehicleRequest->update([
                'status' => 'vehicle_allocated',
                'allocated_vehicle_id' => $vehicle->id,
                'allocated_driver_id' => $driver->id,
                'allocated_by' => $request->user()->id,
                'allocated_at' => now(),
            ]);

            $vehicle->update(['status' => 'unavailable']);
            $driver->update([
                'allocated_vehicle' => $vehicle->registration_number,
            ]);
        });

        return response()->json([
            'success' => true,
            'message' => 'Vehicle allocated and request sent for final approval.',
            'data' => ['vehicle_request' => $vehicleRequest->fresh()->load('user:id,name,employee_id,department', 'recommender:id,name,employee_id,department', 'allocatedVehicle', 'allocatedDriver', 'allocator:id,name')],
        ]);
    }

    /** Requests allocated by the Deputy Secretary and visible for final approval. */
    public function finalApprovalIndex(Request $request): JsonResponse
    {
        $status = $request->query('status', 'pending');

        if (! in_array($status, ['pending', 'approved', 'all'], true)) {
            return response()->json(['success' => false, 'message' => 'Invalid request status filter.'], 422);
        }

        $query = VehicleRequest::query()
            ->with('user:id,name,employee_id,department', 'recommender:id,name', 'allocatedVehicle', 'allocatedDriver')
            ->latest();

        if ($status === 'pending') {
            $query->where('status', 'vehicle_allocated');
        } elseif ($status === 'approved') {
            $query->where('status', 'approved');
        } else {
            $query->whereIn('status', ['vehicle_allocated', 'approved']);
        }

        $requests = $query->get();

        return response()->json([
            'success' => true,
            'data' => [
                'requests' => $requests,
                'total' => $requests->count(),
                'stats' => [
                    'pending' => VehicleRequest::where('status', 'vehicle_allocated')->count(),
                    'approved' => VehicleRequest::where('status', 'approved')->count(),
                ],
            ],
        ]);
    }

    /** Complete allocated request details for final review. */
    public function finalApprovalShow(VehicleRequest $vehicleRequest): JsonResponse
    {
        if (! in_array($vehicleRequest->status, ['vehicle_allocated', 'approved'], true)) {
            return response()->json(['success' => false, 'message' => 'Request not found.'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'vehicle_request' => $vehicleRequest->load(
                    'user:id,name,employee_id,department',
                    'recommender:id,name,employee_id,department',
                    'allocatedVehicle',
                    'allocatedDriver',
                    'allocator:id,name,employee_id',
                ),
            ],
        ]);
    }

    /** Final approval by either the Secretary or Senior Deputy Secretary. */
    public function finalApprove(VehicleRequest $vehicleRequest): JsonResponse
    {
        if ($vehicleRequest->status === 'approved') {
            return response()->json([
                'success' => true,
                'message' => 'This request is already finally approved.',
                'data' => ['vehicle_request' => $vehicleRequest->load('user:id,name,employee_id,department', 'recommender:id,name,employee_id,department', 'allocatedVehicle', 'allocatedDriver', 'allocator:id,name,employee_id')],
            ]);
        }

        if ($vehicleRequest->status !== 'vehicle_allocated') {
            return response()->json([
                'success' => false,
                'message' => 'Only requests allocated by the Deputy Secretary can receive final approval.',
            ], 422);
        }

        if (! $vehicleRequest->allocated_vehicle_id || ! $vehicleRequest->allocated_driver_id) {
            return response()->json(['success' => false, 'message' => 'A saved driver and vehicle allocation is required before approval.'], 422);
        }

        DB::transaction(function () use ($vehicleRequest): void {
            $vehicleRequest->loadMissing('allocatedVehicle', 'allocatedDriver');

            $vehicleRequest->update([
                'status' => 'approved',
                'driver_notified_at' => now(),
                'approved_by' => request()->user()->id,
                'approved_at' => now(),
            ]);

            $vehicleRequest->allocatedDriver?->update([
                'current_assignment' => [
                    'request_id' => $vehicleRequest->id,
                    'destination' => $vehicleRequest->destination,
                    'purpose' => $vehicleRequest->purpose,
                    'departure_at' => $vehicleRequest->departure_at?->toISOString(),
                    'expected_return_at' => $vehicleRequest->expected_return_at?->toISOString(),
                    'vehicle_registration' => $vehicleRequest->allocatedVehicle?->registration_number,
                    'notified_at' => now()->toISOString(),
                ],
            ]);
        });

        return response()->json([
            'success' => true,
            'message' => 'Request finally approved successfully.',
            'data' => ['vehicle_request' => $vehicleRequest->fresh()->load('user:id,name,employee_id,department', 'recommender:id,name,employee_id,department', 'allocatedVehicle', 'allocatedDriver', 'allocator:id,name,employee_id')],
        ]);
    }

    /** Requests and summary visible to the authenticated department officer. */
    public function departmentIndex(Request $request): JsonResponse
    {
        $department = $request->user()->department;
        $status = $request->query('status', 'pending');

        if (! in_array($status, ['pending', 'history', 'all'], true)) {
            return response()->json(['success' => false, 'message' => 'Invalid request status filter.'], 422);
        }

        if (! $department) {
            return response()->json(['success' => true, 'data' => ['requests' => [], 'stats' => $this->emptyStats()]]);
        }

        $query = $this->departmentRequests($department);
        $stats = [
            'total_records' => (clone $query)->count(),
            'approved' => (clone $query)->where('recommendation_status', 'recommended')->count(),
            'rejected' => (clone $query)->where('recommendation_status', 'rejected')->count(),
            'pending' => (clone $query)->where('recommendation_status', 'pending')->count(),
        ];

        $requestsQuery = clone $query;
        if ($status === 'pending') {
            $requestsQuery->where('recommendation_status', 'pending');
        } elseif ($status === 'history') {
            $requestsQuery->whereIn('recommendation_status', ['recommended', 'rejected']);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'requests' => $requestsQuery->latest()->get(),
                'stats' => $stats,
            ],
        ]);
    }

    /** A request detail is accessible only to an officer in the requester's department. */
    public function departmentShow(Request $request, VehicleRequest $vehicleRequest): JsonResponse
    {
        if (! $this->belongsToDepartment($vehicleRequest, $request->user()->department)) {
            return response()->json(['success' => false, 'message' => 'Request not found.'], 404);
        }

        return response()->json(['success' => true, 'data' => ['vehicle_request' => $vehicleRequest->load(
            'user:id,name,employee_id,department',
            'recommender:id,name,employee_id',
            'allocatedVehicle',
            'allocatedDriver',
            'allocator:id,name,employee_id',
            'approver:id,name,employee_id',
        )]]);
    }

    /** Save the department officer's recommendation or rejection. */
    public function recommend(Request $request, VehicleRequest $vehicleRequest): JsonResponse
    {
        if (! $this->belongsToDepartment($vehicleRequest, $request->user()->department)) {
            return response()->json(['success' => false, 'message' => 'Request not found.'], 404);
        }

        if ($vehicleRequest->recommendation_status !== 'pending') {
            return response()->json(['success' => false, 'message' => 'This request has already been reviewed.'], 422);
        }

        $validated = $request->validate([
            'decision' => ['required', 'in:recommended,rejected'],
            'department_priority' => ['nullable', 'in:critical,high,medium,low'],
            'recommendation_notes' => ['nullable', 'string', 'max:2000'],
        ]);

        $vehicleRequest->update([
            'recommendation_status' => $validated['decision'],
            'department_priority' => $validated['department_priority'] ?? null,
            'recommendation_notes' => $validated['recommendation_notes'] ?? null,
            'recommended_by' => $request->user()->id,
            'recommended_at' => now(),
            // Keep the workflow's overall status useful for downstream approval modules.
            'status' => $validated['decision'] === 'recommended' ? 'recommended' : 'rejected',
        ]);

        return response()->json([
            'success' => true,
            'message' => $validated['decision'] === 'recommended' ? 'Request recommended for allocation.' : 'Request rejected.',
            'data' => ['vehicle_request' => $vehicleRequest->fresh()->load('user:id,name,employee_id,department', 'recommender:id,name')],
        ]);
    }

    /** Store a request under the currently authenticated user. */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'purpose' => ['required', 'string', 'max:255'],
            'destination' => ['required', 'string', 'max:255'],
            'departure_at' => ['required', 'date'],
            'expected_return_at' => ['required', 'date', 'after:departure_at'],
            'passenger_count' => ['required', 'integer', 'min:1', 'max:100'],
            'passenger_names' => ['nullable', 'string', 'max:2000'],
            'attachment' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'],
        ]);

        try {
            $attachmentPath = null;
            $attachmentName = null;

            if ($request->hasFile('attachment')) {
                $file = $request->file('attachment');
                $attachmentPath = $file->store('vehicle-request-attachments', 'public');
                $attachmentName = $file->getClientOriginalName();
            }

            // The uploaded file itself is not a database column; store only its metadata.
            unset($validated['attachment']);

            $vehicleRequest = VehicleRequest::create([
                ...$validated,
                'user_id' => $request->user()->id,
                'requester_name' => $request->user()->name,
                'attachment_path' => $attachmentPath,
                'attachment_original_name' => $attachmentName,
                'status' => 'submitted',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Vehicle request submitted successfully.',
                'data' => ['vehicle_request' => $vehicleRequest->load('user:id,name')],
            ], 201);
        } catch (Throwable $e) {
            Log::error('Unable to create vehicle request.', ['exception' => $e::class, 'message' => $e->getMessage()]);

            return response()->json([
                'success' => false,
                'message' => 'Unable to submit the vehicle request. Please try again.',
            ], 500);
        }
    }

    private function departmentRequests(string $department): Builder
    {
        return VehicleRequest::query()
            ->with(
                'user:id,name,employee_id,department',
                'recommender:id,name,employee_id',
                'allocatedVehicle',
            )
            ->whereHas('user', fn (Builder $query) => $query->where('department', $department));
    }

    private function belongsToDepartment(VehicleRequest $vehicleRequest, ?string $department): bool
    {
        return $department !== null
            && $vehicleRequest->user()->where('department', $department)->exists();
    }

    private function emptyStats(): array
    {
        return ['total_records' => 0, 'approved' => 0, 'rejected' => 0, 'pending' => 0];
    }
}
