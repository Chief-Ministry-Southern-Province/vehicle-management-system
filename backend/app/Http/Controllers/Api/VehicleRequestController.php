<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VehicleRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\Eloquent\Builder;
use Throwable;

class VehicleRequestController extends Controller
{
    /** Requests and summary visible to the authenticated department officer. */
    public function departmentIndex(Request $request): JsonResponse
    {
        $department = $request->user()->department;

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

        return response()->json([
            'success' => true,
            'data' => [
                'requests' => $query->where('recommendation_status', 'pending')->latest()->get(),
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

        return response()->json(['success' => true, 'data' => ['vehicle_request' => $vehicleRequest->load('user:id,name,employee_id,department', 'recommender:id,name')]]);
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
            ->with('user:id,name,employee_id,department')
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
