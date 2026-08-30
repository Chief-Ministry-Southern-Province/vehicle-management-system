<?php

require __DIR__.'/vendor/autoload.php';
$app = require __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$user = App\Models\User::where('employee_id', '200035100404')->first();

echo json_encode($user ? [
    'found' => true,
    'id' => $user->id,
    'role' => $user->role,
    'status' => $user->status,
    'email' => $user->email,
    'dev_password_matches' => Illuminate\Support\Facades\Hash::check('Password123', $user->password),
] : ['found' => false], JSON_PRETTY_PRINT);
