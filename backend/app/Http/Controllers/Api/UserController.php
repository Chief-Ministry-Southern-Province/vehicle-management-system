<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::query()
            ->select([
                'id',
                'employee_id',
                'name',
                'email',
                'phone',
                'department',
                'role',
                'status',
                'created_at',
            ])
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => ['users' => $users],
        ]);
    }

    public function destroy(User $user): JsonResponse
    {
        if ($user->isSystemAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'System Administrator accounts cannot be removed.',
            ], 403);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User removed successfully.',
        ]);
    }

    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'employee_id' => [
                'required',
                'string',
                'max:20',
                Rule::unique('users', 'employee_id')->ignore($user->id),
                Rule::unique('drivers', 'nic')->ignore($user->driver?->id),
            ],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'phone' => [$user->isDriver() ? 'required' : 'nullable', 'string', 'max:20'],
            'department' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::in(['active', 'inactive', 'suspended'])],
        ]);

        DB::transaction(function () use ($user, $validated): void {
            $user->update($validated);

            if ($user->isDriver() && $user->driver) {
                $user->driver->update([
                    'nic' => $validated['employee_id'],
                    'full_name' => $validated['name'],
                    'contact_number' => $validated['phone'],
                    'status' => $validated['status'] === 'active' ? 'active' : 'inactive',
                ]);
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully.',
            'data' => ['user' => $this->userData($user->fresh())],
        ]);
    }

    private function userData(User $user): array
    {
        return $user->only([
            'id',
            'employee_id',
            'name',
            'email',
            'phone',
            'department',
            'role',
            'status',
            'created_at',
        ]);
    }
}
