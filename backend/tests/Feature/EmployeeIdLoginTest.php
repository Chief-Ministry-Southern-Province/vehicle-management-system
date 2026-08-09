<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EmployeeIdLoginTest extends TestCase
{
    use RefreshDatabase;

    public function test_active_user_can_login_with_employee_id(): void
    {
        $user = User::factory()->create([
            'employee_id' => 'EMP-LOGIN-001',
            'email' => 'employee@example.gov.lk',
        ]);

        $this->postJson('/api/login', [
            'employee_id' => 'EMP-LOGIN-001',
            'password' => 'password',
        ])
            ->assertOk()
            ->assertJsonPath('data.user.id', $user->id)
            ->assertJsonPath('data.user.employee_id', 'EMP-LOGIN-001')
            ->assertJsonStructure(['data' => ['token']]);
    }

    public function test_email_is_not_accepted_as_the_login_identifier(): void
    {
        User::factory()->create(['email' => 'employee@example.gov.lk']);

        $this->postJson('/api/login', [
            'email' => 'employee@example.gov.lk',
            'password' => 'password',
        ])
            ->assertUnprocessable()
            ->assertJsonValidationErrors('employee_id');
    }

    public function test_invalid_employee_id_is_rejected(): void
    {
        $this->postJson('/api/login', [
            'employee_id' => 'UNKNOWN-ID',
            'password' => 'password',
        ])
            ->assertUnauthorized()
            ->assertJsonPath('message', 'The provided credentials are incorrect.');
    }
}
