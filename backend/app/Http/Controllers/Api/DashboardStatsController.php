<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\VehicleRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardStatsController extends Controller
{
    public function executive(Request $request): JsonResponse
    {
        $vehicles = Vehicle::all();
        $isFinalApprover = in_array($request->user()->role, ['secretary', 'senior_deputy_secretary'], true);

        $pendingApprovals = $isFinalApprover
            ? VehicleRequest::where('status', 'vehicle_allocated')->count()
            : VehicleRequest::where('status', 'recommended')->count();

        $pendingRecommendations = VehicleRequest::query()
            ->where('status', 'submitted')
            ->where('recommendation_status', 'pending')
            ->whereHas('user', fn ($user) => $user->where('role', 'department_officer'))
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'pending_approvals' => $pendingApprovals,
                'pending_recommendations' => $pendingRecommendations,
                'available_vehicles' => $vehicles->where('status', 'available')->count(),
                // Fuel expense records are not yet stored; return an authoritative zero instead of mock data.
                'fuel_cost' => 0,
                'maintenance_cost' => round($vehicles->sum('service_total_cost'), 2),
            ],
        ]);
    }
}
