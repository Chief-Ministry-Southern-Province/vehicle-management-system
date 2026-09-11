<?php

namespace Tests\Feature;

use App\Models\Department;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_assistant_secretary_can_view_all_users(): void
    {
        $assistantSecretary = User::factory()->create(['role' => 'deputy_secretary']);
        User::factory()->create(['role' => 'employee']);

        $this->actingAs($assistantSecretary)
            ->getJson('/api/users')
            ->assertOk()
            ->assertJsonCount(2, 'data.users')
            ->assertJsonMissingPath('data.users.0.password');
    }

    public function test_assistant_secretary_can_remove_an_unprotected_user(): void
    {
        $assistantSecretary = User::factory()->create(['role' => 'deputy_secretary']);
        $employee = User::factory()->create(['role' => 'employee']);

        $this->actingAs($assistantSecretary)
            ->deleteJson("/api/users/{$employee->id}")
            ->assertOk();

        $this->assertDatabaseMissing('users', ['id' => $employee->id]);
    }

    public function test_assistant_secretary_account_can_be_removed(): void
    {
        $assistantSecretary = User::factory()->create(['role' => 'deputy_secretary']);
        $otherAssistantSecretary = User::factory()->create(['role' => 'deputy_secretary']);

        $this->actingAs($assistantSecretary)
            ->deleteJson("/api/users/{$otherAssistantSecretary->id}")
            ->assertOk();

        $this->assertDatabaseMissing('users', ['id' => $otherAssistantSecretary->id]);
    }

    public function test_non_administrative_user_cannot_manage_users(): void
    {
        $employee = User::factory()->create(['role' => 'employee']);
        $otherUser = User::factory()->create();

        $this->actingAs($employee)->getJson('/api/users')->assertForbidden();
        $this->actingAs($employee)
            ->deleteJson("/api/users/{$otherUser->id}")
            ->assertForbidden();
    }

    public function test_system_admin_can_manage_administration_but_not_assignment_workflows(): void
    {
        $systemAdmin = User::factory()->create(['role' => 'system_admin', 'status' => 'active']);

        $this->actingAs($systemAdmin)
            ->postJson('/api/register', [
                'nic' => '200012345678',
                'name' => 'Managed Employee',
                'email' => 'managed.employee@example.com',
                'role' => 'employee',
                'password' => 'Password123',
                'password_confirmation' => 'Password123',
            ])
            ->assertCreated()
            ->assertJsonPath('data.user.role', 'employee');

        $this->actingAs($systemAdmin)
            ->getJson('/api/users')
            ->assertOk();

        $this->actingAs($systemAdmin)
            ->postJson('/api/departments', ['name' => 'System Administration'])
            ->assertCreated();

        $this->actingAs($systemAdmin)
            ->getJson('/api/approvals/recommendations')
            ->assertForbidden();

        $this->actingAs($systemAdmin)
            ->postJson('/api/vehicle-requests', [])
            ->assertForbidden();
    }

    public function test_system_admin_account_cannot_be_removed(): void
    {
        $assistantSecretary = User::factory()->create(['role' => 'deputy_secretary']);
        $systemAdmin = User::factory()->create(['role' => 'system_admin']);

        $this->actingAs($assistantSecretary)
            ->deleteJson("/api/users/{$systemAdmin->id}")
            ->assertForbidden()
            ->assertJsonPath('message', 'System Administrator accounts cannot be removed.');
    }

    public function test_super_admin_can_add_and_list_departments(): void
    {
        $superAdmin = User::factory()->create(['role' => 'deputy_secretary']);

        $this->actingAs($superAdmin)
            ->postJson('/api/departments', ['name' => '  Public Services  '])
            ->assertCreated()
            ->assertJsonPath('data.department.name', 'Public Services');

        $this->actingAs($superAdmin)
            ->getJson('/api/departments')
            ->assertOk()
            ->assertJsonFragment(['name' => 'Public Services']);

        $this->assertDatabaseHas('departments', [
            'name' => 'Public Services',
            'created_by' => $superAdmin->id,
        ]);
    }

    public function test_non_super_admin_cannot_add_departments(): void
    {
        $employee = User::factory()->create(['role' => 'employee']);

        $this->actingAs($employee)
            ->postJson('/api/departments', ['name' => 'Unauthorized Department'])
            ->assertForbidden();

        $this->assertDatabaseMissing('departments', ['name' => 'Unauthorized Department']);
    }

    public function test_super_admin_can_remove_a_department_and_clear_user_assignments(): void
    {
        $superAdmin = User::factory()->create(['role' => 'deputy_secretary']);
        $department = Department::create([
            'name' => 'Temporary Department',
            'created_by' => $superAdmin->id,
        ]);
        $employee = User::factory()->create(['department' => $department->name]);

        $this->actingAs($superAdmin)
            ->deleteJson("/api/departments/{$department->id}")
            ->assertOk()
            ->assertJsonPath('data.affected_users', 1);

        $this->assertDatabaseMissing('departments', ['id' => $department->id]);
        $this->assertNull($employee->fresh()->department);
    }

    public function test_non_super_admin_cannot_remove_departments(): void
    {
        $employee = User::factory()->create(['role' => 'employee']);
        $department = Department::query()->firstOrFail();

        $this->actingAs($employee)
            ->deleteJson("/api/departments/{$department->id}")
            ->assertForbidden();

        $this->assertDatabaseHas('departments', ['id' => $department->id]);
    }
}
