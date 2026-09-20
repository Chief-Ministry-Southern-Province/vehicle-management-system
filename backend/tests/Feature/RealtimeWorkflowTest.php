<?php

namespace Tests\Feature;

use App\Events\WorkflowUpdated;
use App\Models\User;
use Illuminate\Broadcasting\Broadcasters\PusherBroadcaster;
use Illuminate\Broadcasting\BroadcastManager;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class RealtimeWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_private_workflow_channel_requires_the_matching_sanctum_user(): void
    {
        config([
            'broadcasting.default' => 'reverb',
            'broadcasting.connections.reverb.key' => 'test-reverb-key',
            'broadcasting.connections.reverb.secret' => 'test-reverb-secret',
            'broadcasting.connections.reverb.app_id' => 'test-reverb-app',
        ]);
        $broadcastManager = $this->app->make(BroadcastManager::class);
        $broadcastManager->purge('reverb');
        require base_path('routes/channels.php');
        $this->assertInstanceOf(PusherBroadcaster::class, $broadcastManager->connection());
        $user = User::factory()->create(['status' => 'active']);
        $otherUser = User::factory()->create(['status' => 'active']);

        $userToken = $user->createToken('realtime-test')->plainTextToken;
        $this
            ->withToken($userToken)
            ->postJson('/api/broadcasting/auth', [
                'socket_id' => '123.456',
                'channel_name' => "private-workflow.user.{$user->id}",
            ])
            ->assertOk()
            ->assertJsonStructure(['auth']);

        $otherUserToken = $otherUser->createToken('realtime-test')->plainTextToken;
        $this->app['auth']->forgetGuards();
        $this
            ->withToken($otherUserToken)
            ->postJson('/api/broadcasting/auth', [
                'socket_id' => '123.456',
                'channel_name' => "private-workflow.user.{$user->id}",
            ])
            ->assertForbidden();

        $user->update(['status' => 'inactive']);
        $this->app['auth']->forgetGuards();
        $this
            ->withToken($userToken)
            ->postJson('/api/broadcasting/auth', [
                'socket_id' => '123.456',
                'channel_name' => "private-workflow.user.{$user->id}",
            ])
            ->assertForbidden();
    }

    public function test_request_submission_broadcasts_an_invalidation_only_to_authorized_viewers(): void
    {
        Event::fake([WorkflowUpdated::class]);
        $employee = User::factory()->create([
            'role' => 'employee',
            'department' => 'Transport',
            'status' => 'active',
        ]);
        $departmentOfficer = User::factory()->create([
            'role' => 'department_officer',
            'department' => 'Transport',
            'status' => 'active',
        ]);
        $unrelatedOfficer = User::factory()->create([
            'role' => 'department_officer',
            'department' => 'Finance',
            'status' => 'active',
        ]);

        $this->actingAs($employee)
            ->postJson('/api/vehicle-requests', [
                'purpose' => 'Official meeting',
                'starting_location' => 'Dakshinapaya, Labuduwa',
                'starting_latitude' => 6.0535,
                'starting_longitude' => 80.2200,
                'destination' => 'Matara',
                'destination_latitude' => 5.9549,
                'destination_longitude' => 80.5550,
                'departure_at' => '2026-10-01 09:00',
                'expected_return_at' => '2026-10-01 12:00',
                'passenger_count' => 1,
            ])
            ->assertCreated();

        Event::assertDispatched(WorkflowUpdated::class, function (WorkflowUpdated $event) use ($departmentOfficer, $unrelatedOfficer): bool {
            return $event->action === 'request_submitted'
                && in_array($departmentOfficer->id, $event->recipientIds, true)
                && ! in_array($unrelatedOfficer->id, $event->recipientIds, true);
        });
        Event::assertDispatched(WorkflowUpdated::class, fn (WorkflowUpdated $event): bool => $event->action === 'request_submitted' && in_array($employee->id, $event->recipientIds, true),
        );
    }
}
