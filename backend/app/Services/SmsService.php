<?php

namespace App\Services;

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
        $recipient = $this->normaliseRecipient($to);

        if (! ($config['enabled'] ?? false)
            || blank($config['id'] ?? null)
            || blank($config['pw'] ?? null)
            || blank($config['url'] ?? null)
            || $recipient === null
            || blank($message)) {
            return false;
        }

        try {
            $response = Http::timeout((int) ($config['timeout'] ?? 10))->get($config['url'], [
                'id' => $config['id'],
                'pw' => $config['pw'],
                'to' => $recipient,
                'text' => $message,
            ]);

            if ($response->successful()) {
                Log::info('TEXTIT.BIZ SMS accepted by gateway.', [
                    'recipient' => $this->maskedRecipient($recipient),
                    'status' => $response->status(),
                ]);

                return true;
            }

            Log::warning('TEXTIT.BIZ SMS gateway rejected delivery.', [
                'recipient' => $this->maskedRecipient($recipient),
                'status' => $response->status(),
            ]);
        } catch (Throwable $exception) {
            Log::warning('TEXTIT.BIZ SMS gateway could not be reached.', [
                'recipient' => $this->maskedRecipient($recipient),
                'exception' => $exception::class,
            ]);
        }

        return false;
    }

    private function normaliseRecipient(?string $phone): ?string
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
}
