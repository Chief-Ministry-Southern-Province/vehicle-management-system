<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nic' => ['required', 'string', 'max:20', 'unique:users,employee_id', 'unique:drivers,nic'],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'required_if:role,driver', 'string', 'max:20'],
            'department' => ['nullable', 'string', 'max:255'],

            // Role is restricted at controller level for non-admin self-registration;
            // kept here so the same Request class can serve an admin "create user" flow too.
            'role' => ['nullable', 'in:employee,department_officer,subject_officer,deputy_secretary,senior_deputy_secretary,secretary,driver'],

            'date_of_birth' => ['nullable', 'required_if:role,driver', 'date', 'before:today'],
            'address' => ['nullable', 'required_if:role,driver', 'string', 'max:500'],
            'licence_number' => ['nullable', 'required_if:role,driver', 'string', 'max:50', 'unique:drivers,licence_number'],
            'licence_type' => ['nullable', 'required_if:role,driver', 'string', 'max:100'],
            'licence_renewal_date' => ['nullable', 'required_if:role,driver', 'date'],
            'allocated_vehicle' => ['nullable', 'string', 'max:50', 'exists:vehicles,registration_number'],
            'blood_group' => ['nullable', Rule::in(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])],

            'password' => ['required', 'confirmed', Password::min(8)->mixedCase()->numbers()],
        ];
    }

    public function messages(): array
    {
        return [
            'nic.unique' => 'This NIC is already registered.',
            'email.unique' => 'An account with this email already exists.',
            'licence_number.unique' => 'This licence number is already registered.',
            'password.confirmed' => 'Password confirmation does not match.',
        ];
    }
}
