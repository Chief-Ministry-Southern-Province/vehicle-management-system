<?php

namespace Tests\Feature;

use App\Models\User;
use App\Notifications\WorkflowNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use NotificationChannels\WebPush\WebPushChannel;
use Tests\TestCase;

class NotificationApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_list_and_mark_only_own_notifications_as_read(): void
    {
        $user = User::factory()->create(['status' => 'active']);
        $otherUser = User::factory()->create(['status' => 'active']);
        $user->notify(new WorkflowNotification(['title' => 'Assigned', 'message' => 'A journey was assigned.']));
        $otherUser->notify(new WorkflowNotification(['title' => 'Private', 'message' => 'Not for this user.']));

        $notification = $user->notifications()->firstOrFail();
        $otherNotification = $otherUser->notifications()->firstOrFail();

        $this->actingAs($user)
            ->getJson('/api/notifications')
            ->assertOk()
            ->assertJsonPath('data.unread_count', 1)
            ->assertJsonPath('data.notifications.0.id', $notification->id);

        $this->actingAs($user)
            ->patchJson("/api/notifications/{$notification->id}/read")
            ->assertOk();

        $this->assertNotNull($notification->fresh()->read_at);

        $this->actingAs($user)
            ->getJson('/api/notifications')
            ->assertOk()
            ->assertJsonPath('data.unread_count', 0)
            ->assertJsonCount(0, 'data.notifications');

        $this->actingAs($user)
            ->patchJson("/api/notifications/{$otherNotification->id}/read")
            ->assertNotFound();
    }

    public function test_notifications_require_authentication(): void
    {
        $this->getJson('/api/notifications')->assertUnauthorized();
        $this->patchJson('/api/notifications/read-all')->assertUnauthorized();
    }

    public function test_workflow_notification_builds_a_role_dashboard_web_push_payload(): void
    {
        config([
            'webpush.vapid.public_key' => 'public-key',
            'webpush.vapid.private_key' => 'private-key',
        ]);
        $user = User::factory()->make(['role' => 'driver']);
        $notification = new WorkflowNotification([
            'title' => 'Journey approved',
            'message' => 'Your journey is ready.',
            'vehicle_request_id' => 42,
        ]);

        $this->assertContains(WebPushChannel::class, $notification->via($user));
        $this->assertSame([
            'url' => '/driverdashboard',
            'notification_id' => $notification->id,
            'vehicle_request_id' => 42,
        ], $notification->toWebPush($user)->toArray()['data']);
    }
}
