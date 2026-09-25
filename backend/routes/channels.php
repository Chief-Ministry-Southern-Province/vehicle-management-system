<?php

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('workflow.user.{id}', function (User $user, int $id): bool {
    return $user->isActive() && (int) $user->id === (int) $id;
}, ['guards' => ['sanctum']]);
