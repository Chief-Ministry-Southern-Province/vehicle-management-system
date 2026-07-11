<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\VehicleRequestController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

// ── Public routes (no token required) ──────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// ── Protected routes (valid Sanctum token required) ─────────────────
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/logout-all', [AuthController::class, 'logoutAll']);

    Route::get('/profile', [AuthController::class, 'profile']);
    Route::put('/profile', [AuthController::class, 'updateProfile']);
    Route::put('/profile/password', [AuthController::class, 'changePassword']);

    Route::post('/vehicle-requests', [VehicleRequestController::class, 'store']);

    Route::middleware('role:department_officer')->prefix('department')->group(function () {
        Route::get('/vehicle-requests', [VehicleRequestController::class, 'departmentIndex']);
        Route::get('/vehicle-requests/{vehicleRequest}', [VehicleRequestController::class, 'departmentShow']);
        Route::patch('/vehicle-requests/{vehicleRequest}/recommendation', [VehicleRequestController::class, 'recommend']);
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
