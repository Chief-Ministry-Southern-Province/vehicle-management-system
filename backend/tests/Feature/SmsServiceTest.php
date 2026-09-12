<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\SmsService;
use App\Services\WorkflowNotificationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class SmsServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_sms_service_sends_textit_gateway_request_with_normalised_recipient(): void
    {
        config([
            'services.textit.enabled' => true,
            'services.textit.id' => 'gateway-user',
            'services.textit.pw' => 'gateway-password',
            'services.textit.url' => 'https://textit.test/sendmsg/',
            'services.textit.timeout' => 10,
        ]);
        Http::fake(['https://textit.test/*' => Http::response('accepted', 200)]);

        $this->assertTrue(app(SmsService::class)->sendSms('077 123 4567', 'Journey approved.'));

        Http::assertSent(function (Request $request): bool {
            parse_str((string) parse_url($request->url(), PHP_URL_QUERY), $query);

            return $request->method() === 'GET'
                && str_starts_with($request->url(), 'https://textit.test/sendmsg/')
                && $query === [
                    'id' => 'gateway-user',
                    'pw' => 'gateway-password',
                    'to' => '94771234567',
                    'text' => 'Journey approved.',
                ];
        });
    }

    public function test_sms_service_does_not_call_gateway_when_disabled(): void
    {
        config(['services.textit.enabled' => false]);
        Http::fake();

        $this->assertFalse(app(SmsService::class)->sendSms('+94771234567', 'Journey approved.'));

        Http::assertNothingSent();
    }

    public function test_workflow_notification_is_persisted_when_sms_gateway_delivery_fails(): void
    {
        config([
            'services.textit.enabled' => true,
            'services.textit.id' => 'gateway-user',
            'services.textit.pw' => 'gateway-password',
            'services.textit.url' => 'https://textit.test/sendmsg/',
        ]);
        Http::fake(['https://textit.test/*' => Http::response('unavailable', 503)]);
        $user = User::factory()->create(['phone' => '+94771234567', 'status' => 'active']);

        app(WorkflowNotificationService::class)->send($user, 'Journey approved', 'REQ-0042 is ready.');

        $this->assertDatabaseCount('notifications', 1);
        $this->assertSame('Journey approved', $user->notifications()->firstOrFail()->data['title']);
        Http::assertSentCount(1);
    }
}
