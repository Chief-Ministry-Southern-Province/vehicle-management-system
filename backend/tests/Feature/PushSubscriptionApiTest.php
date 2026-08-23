<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PushSubscriptionApiTest extends TestCase
{
    use RefreshDatabase;

    private array $subscription = [
        'endpoint' => 'https://push.example.test/subscriptions/device-1',
        'keys' => [
            'p256dh' => 'browser-public-encryption-key',
            'auth' => 'browser-auth-token',
        ],
        'content_encoding' => 'aes128gcm',
    ];

    public function test_authenticated_user_can_enable_and_disable_device_notifications(): void
    {
        config(['webpush.vapid.public_key' => 'public-vapid-key']);
        $user = User::factory()->create(['status' => 'active']);

        $this->actingAs($user)
            ->getJson('/api/push-subscriptions/public-key')
            ->assertOk()
            ->assertJsonPath('data.public_key', 'public-vapid-key');

        $this->actingAs($user)
            ->postJson('/api/push-subscriptions', $this->subscription)
            ->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('push_subscriptions', [
            'subscribable_id' => $user->id,
            'subscribable_type' => User::class,
            'endpoint' => $this->subscription['endpoint'],
            'content_encoding' => 'aes128gcm',
        ]);

        $this->actingAs($user)
            ->deleteJson('/api/push-subscriptions', ['endpoint' => $this->subscription['endpoint']])
            ->assertOk();

        $this->assertDatabaseMissing('push_subscriptions', [
            'endpoint' => $this->subscription['endpoint'],
        ]);
    }

    public function test_user_cannot_delete_another_users_subscription(): void
    {
        $owner = User::factory()->create(['status' => 'active']);
        $otherUser = User::factory()->create(['status' => 'active']);
        $owner->updatePushSubscription(
            $this->subscription['endpoint'],
            $this->subscription['keys']['p256dh'],
            $this->subscription['keys']['auth'],
            $this->subscription['content_encoding'],
        );

        $this->actingAs($otherUser)
            ->deleteJson('/api/push-subscriptions', ['endpoint' => $this->subscription['endpoint']])
            ->assertOk();

        $this->assertDatabaseHas('push_subscriptions', [
            'subscribable_id' => $owner->id,
            'endpoint' => $this->subscription['endpoint'],
        ]);
    }

    public function test_push_subscription_endpoints_validate_input_and_require_authentication(): void
    {
        $user = User::factory()->create(['status' => 'active']);

        $this->postJson('/api/push-subscriptions', $this->subscription)->assertUnauthorized();
        $this->deleteJson('/api/push-subscriptions', ['endpoint' => $this->subscription['endpoint']])->assertUnauthorized();
        $this->getJson('/api/push-subscriptions/public-key')->assertUnauthorized();

        $this->actingAs($user)
            ->postJson('/api/push-subscriptions', ['endpoint' => 'not-a-url', 'keys' => []])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['endpoint', 'keys.p256dh', 'keys.auth']);
    }
}
