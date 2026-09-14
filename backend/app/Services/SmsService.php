<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Throwable;

class SmsService
{
    /**
     * Send one SMS through the configured TEXTIT.BIZ gateway.
     *
     * TEXTIT.BIZ accepts recipient numbers in international form without a
     * leading '+' or '00'. Sri Lankan mobile numbers entered in local form are
     * converted to that format before the gateway request is made.
     */
    public function sendSms(?string $to, string $message): bool
    {
        $config = config('services.textit', []);
        $recipient = $this->normalisePhoneNumber($to);
        $usesRestApi = filled($config['api_key'] ?? null);

        if (! ($config['enabled'] ?? false)
            || ($usesRestApi && blank($config['endpoint'] ?? null))
            || (! $usesRestApi && (blank($config['id'] ?? null)
                || blank($config['pw'] ?? null)
                || blank($config['url'] ?? null)))
            || $recipient === null
            || blank($message)) {
            return false;
        }

        $attempts = max(1, (int) ($config['retry_attempts'] ?? 3));
        $retryDelayMs = max(0, (int) ($config['retry_delay_ms'] ?? 500));

        for ($attempt = 1; $attempt <= $attempts; $attempt++) {
            try {
                $response = $usesRestApi
                    ? Http::timeout((int) ($config['timeout'] ?? 15))
                        ->withHeaders([
                            'Accept' => '*/*',
                            'X-API-VERSION' => $config['api_version'] ?? 'v1',
                            'Authorization' => 'Basic '.$config['api_key'],
                        ])
                        ->post($config['endpoint'], [
                            'to' => $recipient,
                            'text' => $message,
                        ])
                    : Http::timeout((int) ($config['timeout'] ?? 10))->get($config['url'], [
                        'id' => $config['id'],
                        'pw' => $config['pw'],
                        'to' => $recipient,
                        'text' => $message,
                    ]);
                $gatewayResult = trim($response->body());

                if ($response->successful() && ($usesRestApi || Str::startsWith($gatewayResult, 'OK'))) {
                    Log::info('TEXTIT.BIZ SMS accepted by gateway.', [
                        'recipient' => $this->maskedRecipient($recipient),
                        'status' => $response->status(),
                        'attempt' => $attempt,
                        'api' => $usesRestApi ? 'rest' : 'http',
                        'gateway_result' => $this->safeGatewayResult($gatewayResult),
                    ]);

                    return true;
                }

                Log::warning('TEXTIT.BIZ SMS gateway rejected delivery.', [
                    'recipient' => $this->maskedRecipient($recipient),
                    'status' => $response->status(),
                    'api' => $usesRestApi ? 'rest' : 'http',
                    'gateway_result' => $this->safeGatewayResult($gatewayResult),
                ]);

                return false;
            } catch (ConnectionException $exception) {
                if ($attempt < $attempts) {
                    Log::notice('TEXTIT.BIZ SMS connection failed; retrying.', [
                        'recipient' => $this->maskedRecipient($recipient),
                        'attempt' => $attempt,
                        'max_attempts' => $attempts,
                    ]);

                    if ($retryDelayMs > 0) {
                        usleep($retryDelayMs * 1000);
                    }

                    continue;
                }

                Log::warning('TEXTIT.BIZ SMS gateway could not be reached.', [
                    'recipient' => $this->maskedRecipient($recipient),
                    'attempts' => $attempts,
                    'exception' => $exception::class,
                ]);
            } catch (Throwable $exception) {
                Log::warning('TEXTIT.BIZ SMS gateway could not be reached.', [
                    'recipient' => $this->maskedRecipient($recipient),
                    'exception' => $exception::class,
                ]);
            }
        }

        return false;
    }

    public function normalisePhoneNumber(?string $phone): ?string
    {
        if ($phone === null) {
            return null;
        }

        $phone = preg_replace('/[\s().-]/', '', trim($phone));

        if ($phone === null || $phone === '') {
            return null;
        }

        if (str_starts_with($phone, '00')) {
            $phone = substr($phone, 2);
        } elseif (str_starts_with($phone, '+')) {
            $phone = substr($phone, 1);
        }

        if (preg_match('/^0(7\d{8})$/', $phone, $matches) === 1) {
            return '94'.$matches[1];
        }

        if (preg_match('/^7\d{8}$/', $phone) === 1) {
            return '94'.$phone;
        }

        return preg_match('/^\d{8,15}$/', $phone) === 1 ? $phone : null;
    }

    private function maskedRecipient(string $recipient): string
    {
        return Str::mask($recipient, '*', 0, -4);
    }

    private function safeGatewayResult(string $result): string
    {
        $result = preg_replace('/[^\pL\pN\s:_-]/u', '', $result) ?? '';

        return Str::limit(trim($result), 120, '...');
    }
}
