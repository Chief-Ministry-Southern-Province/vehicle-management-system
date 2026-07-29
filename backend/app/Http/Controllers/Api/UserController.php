<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;

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
        if ($user->isDeputySecretary()) {
            return response()->json([
                'success' => false,
                'message' => 'The Assistant Secretary account cannot be removed.',
            ], 403);
        }

        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User removed successfully.',
        ]);
    }
}
