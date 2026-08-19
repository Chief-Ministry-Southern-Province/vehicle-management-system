<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VehicleIssueReport;
use App\Services\WorkflowNotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class VehicleIssueReportController extends Controller
{
    public function __construct(private readonly WorkflowNotificationService $notifications)
    {
    }
    private const ISSUE_TYPES = [
        'vehicle_breakdown', 'mechanical_issue', 'tyre_issue', 'fuel_issue',
        'accident', 'journey_delay', 'cannot_complete_journey', 'other',
    ];

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'issue_type' => ['required', Rule::in(self::ISSUE_TYPES)],
            'details' => ['nullable', 'string', 'max:1000'],
            'vehicle_request_id' => ['required', 'integer', 'exists:vehicle_requests,id'],
        ]);
        $driver = $request->user()->driver;

        if (! $driver) {
            return response()->json(['success' => false, 'message' => 'No driver record is linked to this account.'], 404);
        }

        $journey = $driver->vehicleRequests()
            ->whereKey($validated['vehicle_request_id'])
            ->where('status', 'approved')
            ->where('journey_status', '!=', 'completed')
            ->with('allocatedVehicle')
            ->first();

        if (! $journey) {
            return response()->json(['success' => false, 'message' => 'The selected journey is not assigned to this driver.'], 422);
        }

        $vehicle = $journey->allocatedVehicle;

        if (! $vehicle) {
            return response()->json(['success' => false, 'message' => 'No vehicle is allocated to this journey.'], 422);
        }

        $report = DB::transaction(function () use ($driver, $vehicle, $journey, $validated): VehicleIssueReport {
            $report = VehicleIssueReport::create([
                'driver_id' => $driver->id,
                'vehicle_id' => $vehicle->id,
                'vehicle_request_id' => $journey->id,
                'issue_type' => $validated['issue_type'],
                'details' => $validated['details'] ?? null,
                'status' => 'open',
                'reported_at' => now(),
            ]);

            // A reported driver issue is immediately reflected anywhere the
            // journey's driver status is displayed.
            $journey->update(['journey_status' => 'issue']);

            return $report;
        });

        $this->notifications->issueReported($journey->fresh('user'));

        return response()->json([
            'success' => true,
            'message' => 'Issue reported successfully.',
            'data' => ['report' => $report->load('driver', 'vehicle', 'journey')],
        ], 201);
    }

    public function index(): JsonResponse
    {
        $reports = VehicleIssueReport::with([
            'driver',
            'vehicle',
            'journey:id,requester_name,purpose,destination,departure_at,expected_return_at,status,journey_status',
        ])->latest('reported_at')->get();

        return response()->json([
            'success' => true,
            'data' => ['reports' => $reports],
        ]);
    }
}
