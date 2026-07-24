<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\VehicleRequestController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\DriverController;
use App\Http\Controllers\Api\DashboardStatsController;
use App\Http\Controllers\Api\VehicleIssueReportController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

// ── Public routes (no token required) ──────────────────────────────
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// ── Protected routes (valid Sanctum token required) ─────────────────
Route::middleware('auth:sanctum')->group(function () {
    Route::middleware('role:deputy_secretary')->post('/register', [AuthController::class, 'register']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/logout-all', [AuthController::class, 'logoutAll']);

    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/profile/password', [AuthController::class, 'changePassword']);

    Route::post('/vehicle-requests', [VehicleRequestController::class, 'store']);
    Route::get('/vehicle-requests', [VehicleRequestController::class, 'personalIndex']);
    Route::get('/vehicle-requests/{vehicleRequest}', [VehicleRequestController::class, 'personalShow']);

    Route::middleware('role:department_officer')->prefix('department')->group(function () {
        Route::get('/vehicle-requests', [VehicleRequestController::class, 'departmentIndex']);
        Route::get('/vehicle-requests/{vehicleRequest}', [VehicleRequestController::class, 'departmentShow']);
        Route::patch('/vehicle-requests/{vehicleRequest}/recommendation', [VehicleRequestController::class, 'recommend']);
    });

    Route::middleware('role:driver')->get('/driver/dashboard-stats', [DriverController::class, 'dashboardStats']);
    Route::middleware('role:driver')->get('/driver/scheduled-journeys', [DriverController::class, 'scheduledJourneys']);
    Route::middleware('role:driver')->get('/driver/trip-history', [DriverController::class, 'tripHistory']);
    Route::middleware('role:driver')->patch('/driver/journeys/{vehicleRequest}/status', [DriverController::class, 'updateJourneyStatus']);
    Route::middleware('role:driver')->get('/driver/assigned-vehicle', [DriverController::class, 'assignedVehicle']);
    Route::middleware('role:driver')->post('/driver/issue-reports', [VehicleIssueReportController::class, 'store']);
    Route::middleware('role:subject_officer,deputy_secretary')->get('/issue-reports', [VehicleIssueReportController::class, 'index']);

    Route::middleware('role:deputy_secretary')->prefix('approvals')->group(function () {
        Route::get('/vehicle-requests', [VehicleRequestController::class, 'approvalIndex']);
        Route::get('/vehicle-requests/{vehicleRequest}', [VehicleRequestController::class, 'approvalShow']);
        Route::patch('/vehicle-requests/{vehicleRequest}/allocate', [VehicleRequestController::class, 'allocate']);
    });

    Route::middleware('role:deputy_secretary,secretary,senior_deputy_secretary')->get('/dashboard/executive-stats', [DashboardStatsController::class, 'executive']);

    Route::middleware('role:secretary,senior_deputy_secretary')->prefix('final-approvals')->group(function () {
        Route::get('/vehicle-requests', [VehicleRequestController::class, 'finalApprovalIndex']);
        Route::get('/vehicle-requests/{vehicleRequest}', [VehicleRequestController::class, 'finalApprovalShow']);
        Route::patch('/vehicle-requests/{vehicleRequest}/approve', [VehicleRequestController::class, 'finalApprove']);
    });

    // Fleet records are read-only for executive roles and editable only by the Subject Officer.
    Route::middleware('role:subject_officer,deputy_secretary,secretary,senior_deputy_secretary')->group(function () {
        Route::get('/vehicles', [VehicleController::class, 'index']);
        Route::get('/vehicles/id/{vehicle}', [VehicleController::class, 'show']);
        Route::get('/vehicles/{vehicle:registration_number}', [VehicleController::class, 'show']);
        Route::get('/drivers', [DriverController::class, 'index']);
        Route::get('/drivers/{driver:driver_id}', [DriverController::class, 'show']);
    });

    // Fleet registration and edits remain restricted to the Subject Officer.
    Route::middleware('role:subject_officer')->group(function () {
        Route::get('/approved-journeys', [VehicleRequestController::class, 'approvedJourneysIndex']);
        Route::post('/vehicles', [VehicleController::class, 'store']);
        // POST supports multipart image uploads reliably in PHP while retaining a dedicated update endpoint.
        Route::post('/vehicles/{vehicle:registration_number}', [VehicleController::class, 'update']);
        Route::post('/drivers', [DriverController::class, 'store']);
        Route::put('/drivers/{driver:driver_id}', [DriverController::class, 'update']);
        Route::delete('/drivers/{driver:driver_id}', [DriverController::class, 'destroy']);
    });

    /*
    |----------------------------------------------------------------
    | Example of role-protected route groups for future modules.
    | The 'role:' middleware accepts a comma-separated list of
    | allowed roles — uncomment and use as each phase is built.
    |----------------------------------------------------------------
    |
    | Route::middleware('role:department_officer')->group(function () {
    |     Route::get('/department/requests', [RequestController::class, 'departmentQueue']);
    | });
    |
    | Route::middleware('role:deputy_secretary,secretary')->group(function () {
    |     Route::get('/fleet/dashboard', [FleetController::class, 'dashboard']);
    | });
    |
    */
});
