<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $unreadNotifications = $request->user()->unreadNotifications();
        $unreadByTitle = (clone $unreadNotifications)->get()
            ->map(fn ($notification) => $notification->data['title'] ?? null)
            ->filter()
            ->countBy()
            ->all();

        $notifications = $unreadNotifications->latest()->limit(30)->get()->map(fn ($notification) => [
            'id' => $notification->id,
            'type' => $notification->type,
            'data' => $notification->data,
            'read_at' => $notification->read_at?->toISOString(),
            'created_at' => $notification->created_at?->toISOString(),
        ]);

        return response()->json(['success' => true, 'data' => [
            'notifications' => $notifications,
            'unread_count' => $request->user()->unreadNotifications()->count(),
            'unread_by_title' => $unreadByTitle,
        ]]);
    }

    public function markRead(Request $request, string $notification): JsonResponse
    {
        $record = $request->user()->notifications()->findOrFail($notification);
        $record->markAsRead();

        return response()->json(['success' => true, 'data' => ['notification' => $record->fresh()]]);
    }

    public function markAllRead(Request $request): JsonResponse
    {
        $request->user()->unreadNotifications()->update(['read_at' => now()]);

        return response()->json(['success' => true]);
    }
}
