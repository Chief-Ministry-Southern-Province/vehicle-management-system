<?php

namespace Tests\Feature;

use App\Models\User;
use App\Services\SmsService;
use App\Services\WorkflowNotificationService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class SmsServiceTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        config(['services.textit.api_key' => null]);
    }

    public function test_sms_service_sends_textit_gateway_request_with_normalised_recipient(): void
    {
        config([
            'services.textit.enabled' => true,
            'services.textit.id' => 'gateway-user',
            'services.textit.pw' => 'gateway-password',
            'services.textit.url' => 'https://textit.test/sendmsg/',
            'services.textit.timeout' => 10,
        ]);
        Http::fake(['https://textit.test/*' => Http::response('OK:1-MSG_GSM-17 Uploaded_Successfully', 200)]);

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

    public function test_sms_service_rejects_an_http_success_response_without_textit_ok_acknowledgement(): void
    {
        config([
            'services.textit.enabled' => true,
            'services.textit.id' => 'gateway-user',
            'services.textit.pw' => 'gateway-password',
            'services.textit.url' => 'https://textit.test/sendmsg/',
        ]);
        Http::fake(['https://textit.test/*' => Http::response('Err:WrongDestinationDN', 200)]);

        $this->assertFalse(app(SmsService::class)->sendSms('+94771234567', 'Journey approved.'));
        Http::assertSentCount(1);
    }

    public function test_sms_service_sends_textit_transactional_rest_api_request(): void
    {
        config([
            'services.textit.enabled' => true,
            'services.textit.api_key' => 'test-rest-api-key',
            'services.textit.endpoint' => 'https://api.textit.test/',
            'services.textit.api_version' => 'v1',
            'services.textit.timeout' => 15,
        ]);
        Http::fake(['https://api.textit.test/*' => Http::response(['status' => 'accepted'], 202)]);

        $this->assertTrue(app(SmsService::class)->sendSms('071 797 5625', 'Journey approved.'));

        Http::assertSentCount(1);
        Http::assertSent(function (Request $request): bool {
            $this->assertSame('POST', $request->method());
            $this->assertSame('https://api.textit.test/', $request->url());
            $this->assertSame([
                'to' => '94717975625',
                'text' => 'Journey approved.',
            ], $request->data());
            $this->assertSame(['Basic test-rest-api-key'], $request->header('Authorization'));
            $this->assertSame(['v1'], $request->header('X-API-VERSION'));

            return true;
        });
    }

    public function test_sms_service_retries_a_temporary_gateway_connection_failure(): void
    {
        config([
            'services.textit.enabled' => true,
            'services.textit.id' => 'gateway-user',
            'services.textit.pw' => 'gateway-password',
            'services.textit.url' => 'https://textit.test/sendmsg/',
            'services.textit.retry_attempts' => 3,
            'services.textit.retry_delay_ms' => 0,
        ]);
        $requests = 0;
        Http::fake(function () use (&$requests) {
            $requests++;

            if ($requests === 1) {
                throw new ConnectionException('Temporary connection failure');
            }

            return Http::response('OK:1-MSG_GSM-18 Uploaded_Successfully', 200);
        });

        $this->assertTrue(app(SmsService::class)->sendSms('94768240143', 'Retry this message.'));
        $this->assertSame(2, $requests);
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
