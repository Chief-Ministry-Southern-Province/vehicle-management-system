<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class ForgotPasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_id' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:32'],
        ];
    }

    public function messages(): array
    {
        return [
            'employee_id.required' => 'Please enter your User ID.',
            'phone.required' => 'Please enter your registered phone number.',
        ];
    }
}
