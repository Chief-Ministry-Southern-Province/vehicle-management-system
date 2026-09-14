<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ForgotPasswordSmsTest extends TestCase
{
    use RefreshDatabase;

    private function configureSmsGateway(): void
    {
        config([
            'services.textit.enabled' => true,
            'services.textit.api_key' => null,
            'services.textit.id' => 'gateway-user',
            'services.textit.pw' => 'gateway-password',
            'services.textit.url' => 'https://textit.test/sendmsg/',
            'services.textit.retry_delay_ms' => 0,
        ]);
    }

    public function test_matching_user_id_and_phone_receive_a_temporary_password_by_sms(): void
    {
        $this->configureSmsGateway();
        Http::fake(['https://textit.test/*' => Http::response('OK:1-MSG_GSM-20 Uploaded_Successfully', 200)]);
        $user = User::factory()->create([
            'employee_id' => '200035100509',
            'phone' => '0717975625',
            'password' => Hash::make('Previous-password-1'),
        ]);
        $user->createToken('existing-session');

        $this->postJson('/api/forgot-password', [
            'employee_id' => '200035100509',
            'phone' => '+94717975625',
        ])->assertOk()
            ->assertJsonPath('success', true);

        $query = [];
        Http::assertSent(function (Request $request) use (&$query): bool {
            parse_str((string) parse_url($request->url(), PHP_URL_QUERY), $query);

            return $query['to'] === '94717975625';
        });

        $this->assertMatchesRegularExpression('/Temporary Password: ([^\n]+)/', $query['text']);
        preg_match('/Temporary Password: ([^\n]+)/', $query['text'], $matches);
        $user->refresh();
        $this->assertTrue(Hash::check($matches[1], $user->password));
        $this->assertFalse(Hash::check('Previous-password-1', $user->password));
        $this->assertCount(0, $user->tokens);
    }

    public function test_non_matching_phone_does_not_reset_a_password_or_send_sms(): void
    {
        $this->configureSmsGateway();
        Http::fake();
        $user = User::factory()->create([
            'employee_id' => '200035100509',
            'phone' => '0717975625',
            'password' => Hash::make('Previous-password-1'),
        ]);

        $this->postJson('/api/forgot-password', [
            'employee_id' => '200035100509',
            'phone' => '0771111111',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('phone')
            ->assertJsonPath('errors.phone.0', 'The phone number does not match the User ID. Please enter the registered mobile number.');

        $user->refresh();
        $this->assertTrue(Hash::check('Previous-password-1', $user->password));
        Http::assertNothingSent();
    }

    public function test_password_is_not_changed_when_the_sms_gateway_rejects_delivery(): void
    {
        $this->configureSmsGateway();
        Http::fake(['https://textit.test/*' => Http::response('Err:WrongDestinationDN', 200)]);
        $user = User::factory()->create([
            'employee_id' => '200035100509',
            'phone' => '0717975625',
            'password' => Hash::make('Previous-password-1'),
        ]);

        $this->postJson('/api/forgot-password', [
            'employee_id' => '200035100509',
            'phone' => '0717975625',
        ])->assertUnprocessable()
            ->assertJsonValidationErrors('phone');

        $user->refresh();
        $this->assertTrue(Hash::check('Previous-password-1', $user->password));
    }
}
