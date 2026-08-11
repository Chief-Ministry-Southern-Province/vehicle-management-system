<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\ForgotPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Models\Driver;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Laravel\Sanctum\PersonalAccessToken;
use Throwable;

class AuthController extends Controller
{
    private function handleException(Throwable $e, string $action): JsonResponse
    {
        Log::error('AuthController error during ' . $action, [
            'message' => $e->getMessage(),
            'exception' => $e::class,
        ]);

        return response()->json([
            'success' => false,
            'message' => 'An unexpected error occurred while processing the request.',
        ], 500);
    }

    /**
     * POST /api/register
     * Create a user. Access is restricted to Deputy Secretaries by the route.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            $validated = $request->validated();

            [$user, $driver] = DB::transaction(function () use ($validated): array {
                $user = User::create([
                    // Keep using the existing database column for compatibility; it now
                    // contains the NIC supplied by the registration form.
                    'employee_id' => $validated['nic'],
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'phone' => $validated['phone'] ?? null,
                    'department' => $validated['department'] ?? null,
                    'role' => $validated['role'] ?? 'employee',
                    'password' => Hash::make($validated['password']),
                    'status' => 'active',
                ]);

                $driver = null;
                if ($user->role === 'driver') {
                    $driver = Driver::create([
                        'driver_id' => sprintf('DRV-%04d', $user->id),
                        'full_name' => $user->name,
                        'date_of_birth' => $validated['date_of_birth'],
                        'nic' => $validated['nic'],
                        'address' => $validated['address'],
                        'contact_number' => $validated['phone'],
                        'blood_group' => $validated['blood_group'] ?? null,
                        'licence_number' => $validated['licence_number'],
                        'licence_type' => $validated['licence_type'],
                        'licence_renewal_date' => $validated['licence_renewal_date'],
                        'allocated_vehicle' => $validated['allocated_vehicle'] ?? null,
                        'status' => 'active',
                    ]);
                }

                return [$user, $driver];
            });

            return response()->json([
                'success' => true,
                'message' => 'Registration successful.',
                'data' => [
                    'user' => $user,
                    'driver' => $driver,
                ],
            ], 201);
        } catch (Throwable $e) {
            return $this->handleException($e, 'register');
        }
    }

    /**
     * POST /api/login
     * Validates credentials, checks account status, issues a Sanctum token.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $credentials = $request->validated();

            $user = User::where('employee_id', $credentials['employee_id'])->first();

            if (! $user || ! Hash::check($credentials['password'], $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'The provided credentials are incorrect.',
                ], 401);
            }

            if (! $user->isActive()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Your account is ' . $user->status . '. Please contact the administrator.',
                ], 403);
            }

            // Revoke previous tokens on this device-class if you want single-session login.
            // Left commented out — uncomment for strict single-session enforcement:
            // $user->tokens()->delete();

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Login successful.',
                'data' => [
                    'user' => $user,
                    'token' => $token,
                ],
            ], 200);
        } catch (Throwable $e) {
            return $this->handleException($e, 'login');
        }
    }

    /**
     * POST /api/logout
     * Revokes only the token used for the current request.
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $request->user()->currentAccessToken()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Logged out successfully.',
            ], 200);
        } catch (Throwable $e) {
            return $this->handleException($e, 'logout');
        }
    }

    /**
     * POST /api/logout-all
     * Revokes all tokens for the user — "log out of all devices".
     */
    public function logoutAll(Request $request): JsonResponse
    {
        try {
            $request->user()->tokens()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Logged out from all devices.',
            ], 200);
        } catch (Throwable $e) {
            return $this->handleException($e, 'logoutAll');
        }
    }

    /**
     * GET /api/profile
     * Returns the currently authenticated user (used on app load to restore session).
     */
    public function profile(Request $request): JsonResponse
    {
        try {
            return response()->json([
                'success' => true,
                'data' => [
                    'user' => $request->user()->load('driver'),
                ],
            ], 200);
        } catch (Throwable $e) {
            return $this->handleException($e, 'profile');
        }
    }

    /**
     * PUT /api/profile
     * Update editable profile fields (not role, not status, not employee_id).
     */
    public function updateProfile(Request $request): JsonResponse
    {
        try {
            $user = $request->user();

            $validated = $request->validate([
                'name' => ['sometimes', 'string', 'max:255'],
                'phone' => ['sometimes', 'nullable', 'string', 'max:20'],
                'profile_picture' => ['sometimes', 'nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
            ]);

            $previousPicture = $user->profile_picture_path;
            if ($request->hasFile('profile_picture')) {
                $directory = public_path('profile-pictures');
                File::ensureDirectoryExists($directory);
                $picture = $request->file('profile_picture');
                $filename = Str::uuid() . '.' . strtolower($picture->getClientOriginalExtension());
                $picture->move($directory, $filename);
                $validated['profile_picture_path'] = 'profile-pictures/' . $filename;
            }
            unset($validated['profile_picture']);

            DB::transaction(function () use ($user, $validated): void {
                $user->update($validated);

                if ($user->isDriver() && $user->driver) {
                    $user->driver->update(array_filter([
                        'full_name' => $validated['name'] ?? null,
                        'contact_number' => $validated['phone'] ?? null,
                    ], fn ($value) => $value !== null));
                }
            });

            if ($previousPicture && $previousPicture !== $user->profile_picture_path) {
                File::delete(public_path($previousPicture));
            }

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully.',
                'data' => ['user' => $user->fresh()->load('driver')],
            ], 200);
        } catch (ValidationException $e) {
            throw $e;
        } catch (Throwable $e) {
            return $this->handleException($e, 'updateProfile');
        }
    }

    /**
     * PUT /api/profile/password
     * Authenticated user changes their own password (requires current password).
     */
    public function changePassword(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'current_password' => ['required', 'string'],
                'password' => ['required', 'confirmed', 'min:8'],
            ]);

            $user = $request->user();

            if (! Hash::check($validated['current_password'], $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current password is incorrect.',
                ], 422);
            }

            $user->update(['password' => Hash::make($validated['password'])]);

            // Invalidate all other sessions after a password change for security.
            $currentAccessToken = $request->user()->currentAccessToken();
            $currentTokenId = $currentAccessToken instanceof PersonalAccessToken
                ? $currentAccessToken->getKey()
                : null;
            if ($currentTokenId !== null) {
                $user->tokens()->where('id', '!=', $currentTokenId)->delete();
            }

            return response()->json([
                'success' => true,
                'message' => 'Password changed successfully.',
            ], 200);
        } catch (ValidationException $e) {
            throw $e;
        } catch (Throwable $e) {
            return $this->handleException($e, 'changePassword');
        }
    }

    /**
     * POST /api/forgot-password
     * Sends a password reset link/token via Laravel's built-in Password broker.
     */
    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        try {
            $status = Password::sendResetLink(
                $request->only('email')
            );

            if ($status === Password::RESET_LINK_SENT) {
                return response()->json([
                    'success' => true,
                    'message' => 'Password reset link sent to your email.',
                ], 200);
            }

            // Avoid confirming/denying whether the email exists — return success-shaped
            // response either way to prevent user enumeration, but log internally if needed.
            return response()->json([
                'success' => true,
                'message' => 'If an account exists with that email, a reset link has been sent.',
            ], 200);
        } catch (Throwable $e) {
            return $this->handleException($e, 'forgotPassword');
        }
    }

    /**
     * POST /api/reset-password
     * Consumes the token from the email link and sets a new password.
     */
    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        try {
            $status = Password::reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),
                function (User $user, string $password) {
                    $user->forceFill([
                        'password' => Hash::make($password),
                    ])->save();

                    // Revoke all existing tokens — old sessions die once password resets.
                    $user->tokens()->delete();
                }
            );

            if ($status === Password::PASSWORD_RESET) {
                return response()->json([
                    'success' => true,
                    'message' => 'Password has been reset successfully.',
                ], 200);
            }

            return response()->json([
                'success' => false,
                'message' => 'Unable to reset password. The token may be invalid or expired.',
            ], 422);
        } catch (Throwable $e) {
            return $this->handleException($e, 'resetPassword');
        }
    }
}
