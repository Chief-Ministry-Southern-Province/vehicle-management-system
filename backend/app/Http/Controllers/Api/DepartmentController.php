<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DepartmentController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'departments' => Department::query()->orderBy('name')->get(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->merge(['name' => trim((string) $request->input('name'))]);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:departments,name'],
        ], [
            'name.unique' => 'This department already exists.',
        ]);

        $department = Department::create([
            'name' => $validated['name'],
            'created_by' => $request->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Department added successfully.',
            'data' => ['department' => $department],
        ], 201);
    }

    public function destroy(Department $department): JsonResponse
    {
        $affectedUsers = DB::transaction(function () use ($department): int {
            $affectedUsers = User::query()
                ->where('department', $department->name)
                ->update(['department' => null]);

            $department->delete();

            return $affectedUsers;
        });

        return response()->json([
            'success' => true,
            'message' => 'Department removed successfully.',
            'data' => ['affected_users' => $affectedUsers],
        ]);
    }
}
