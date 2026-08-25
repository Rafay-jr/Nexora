<?php

namespace Database\Seeders;

use App\Models\Notification;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    public function run(): void
    {
        Notification::create([
            'user_id' => null,
            'target_role' => 'all',
            'title' => 'Welcome to EventSphere Platform!',
            'message' => 'Explore upcoming technical, cultural, and sports events happening across campus. Register online to secure your slots.',
            'type' => 'announcement',
        ]);

        Notification::create([
            'user_id' => null,
            'target_role' => 'participant',
            'title' => 'CodeSprint 2026 Hackathon Seats Nearly Full!',
            'message' => 'Only limited seats remain for Nexora CodeSprint 2026. Register now to participate.',
            'type' => 'reminder',
        ]);
    }
}
