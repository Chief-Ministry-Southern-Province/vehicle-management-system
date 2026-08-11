<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Anyone may attempt to log in
    }

    public function rules(): array
    {
        return [
            'employee_id' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'employee_id.required' => 'Please enter your Employee ID.',
            'password.required' => 'Please enter your password.',
        ];
    }
}
