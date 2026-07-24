<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\VehicleIssueReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class VehicleIssueReportController extends Controller
{
    private const ISSUE_TYPES = [
        'vehicle_breakdown', 'mechanical_issue', 'tyre_issue', 'fuel_issue',
        'accident', 'journey_delay', 'cannot_complete_journey', 'other',
    ];

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'issue_type' => ['required', Rule::in(self::ISSUE_TYPES)],
            'details' => ['nullable', 'string', 'max:1000'],
        ]);
        $driver = $request->user()->driver;

        if (! $driver) {
            return response()->json(['success' => false, 'message' => 'No driver record is linked to this account.'], 404);
        }

        $journey = $driver->vehicleRequests()
            ->where('status', 'approved')
            ->where('expected_return_at', '>=', now())
            ->orderBy('departure_at')
            ->first();
        $registration = $journey?->allocatedVehicle?->registration_number
            ?: $driver->allocated_vehicle
            ?: data_get($driver->current_assignment, 'vehicle_registration');
        $vehicle = $registration
            ? Vehicle::where('registration_number', $registration)->first()
            : null;

        $report = VehicleIssueReport::create([
            'driver_id' => $driver->id,
            'vehicle_id' => $vehicle?->id,
            'vehicle_request_id' => $journey?->id,
            'issue_type' => $validated['issue_type'],
            'details' => $validated['details'] ?? null,
            'status' => 'open',
            'reported_at' => now(),
        ]);

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
            'journey:id,requester_name,purpose,destination,departure_at,expected_return_at,status',
        ])->latest('reported_at')->get();

        return response()->json([
            'success' => true,
            'data' => ['reports' => $reports],
        ]);
    }
}
