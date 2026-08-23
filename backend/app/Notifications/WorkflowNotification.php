<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\DatabaseMessage;
use Illuminate\Notifications\Notification;
use NotificationChannels\WebPush\WebPushChannel;
use NotificationChannels\WebPush\WebPushMessage;

class WorkflowNotification extends Notification
{
    use Queueable;

    public function __construct(private readonly array $payload) {}

    public function via(object $notifiable): array
    {
        $channels = ['database'];

        if (config('webpush.vapid.public_key') && config('webpush.vapid.private_key')) {
            $channels[] = WebPushChannel::class;
        }

        return $channels;
    }

    public function toDatabase(object $notifiable): DatabaseMessage
    {
        return new DatabaseMessage($this->payload);
    }

    public function toWebPush(object $notifiable): WebPushMessage
    {
        return (new WebPushMessage)
            ->title($this->payload['title'] ?? 'Vehicle Management System')
            ->body($this->payload['message'] ?? 'You have a new workflow update.')
            ->icon('/national-emblem.png')
            ->badge('/national-emblem.png')
            ->tag('workflow-'.$this->id)
            ->data([
                'url' => $this->dashboardPath($notifiable),
                'notification_id' => $this->id,
                'vehicle_request_id' => $this->payload['vehicle_request_id'] ?? null,
            ])
            ->options(['TTL' => 86400, 'urgency' => 'normal']);
    }

    private function dashboardPath(object $notifiable): string
    {
        return match ($notifiable->role ?? null) {
            'employee' => '/userdashboard',
            'department_officer' => '/departmentofficerdashboard',
            'subject_officer' => '/subjectofficerdashboard',
            'deputy_secretary' => '/deputysecretarydashboard',
            'senior_deputy_secretary' => '/seniordeputysecretarydashboard',
            'secretary' => '/secretarydashboard',
            'driver' => '/driverdashboard',
            default => '/',
        };
    }
}
