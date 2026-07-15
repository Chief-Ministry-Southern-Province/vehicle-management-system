<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\VehicleRequest;
use Illuminate\Http\JsonResponse;

class DashboardStatsController extends Controller
{
    public function deputySecretary(): JsonResponse
    {
        $vehicles = Vehicle::all();

        return response()->json([
            'success' => true,
            'data' => [
                'pending_approvals' => VehicleRequest::whereNotIn('status', ['vehicle_allocated', 'approved', 'rejected'])->count(),
                'available_vehicles' => $vehicles->where('status', 'available')->count(),
                // Fuel expense records are not yet stored; return an authoritative zero instead of mock data.
                'fuel_cost' => 0,
                'maintenance_cost' => round($vehicles->sum('service_total_cost'), 2),
            ],
        ]);
    }
}
