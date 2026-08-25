<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\EventWaitlist;
use App\Models\Registration;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RegistrationSeeder extends Seeder
{
    public function run(): void
    {
        $hackathon = Event::where('title', 'like', '%CodeSprint%')->first();
        $cultural = Event::where('title', 'like', '%Symphony%')->first();
        $workshop = Event::where('title', 'like', '%AI & Machine Learning%')->first();

        $students = User::where('role', 'participant')->get();

        // Hackathon Registrations (Capacity 3 -> 3 confirmed, 2 waitlisted)
        foreach ($students->take(3) as $student) {
            Registration::create([
                'event_id' => $hackathon->id,
                'student_id' => $student->id,
                'registered_at' => now()->subHours(10),
                'status' => 'confirmed',
                'qr_code_token' => 'QR-' . strtoupper(Str::random(10)),
            ]);
        }

        foreach ($students->skip(3) as $student) {
            EventWaitlist::create([
                'event_id' => $hackathon->id,
                'user_id' => $student->id,
                'waitlist_time' => now()->subHours(5),
                'status' => 'waiting',
            ]);
        }

        // Cultural Night Registrations
        foreach ($students as $student) {
            Registration::create([
                'event_id' => $cultural->id,
                'student_id' => $student->id,
                'registered_at' => now()->subDays(2),
                'status' => 'confirmed',
                'qr_code_token' => 'QR-' . strtoupper(Str::random(10)),
            ]);
        }

        // Workshop Registrations (Completed event)
        foreach ($students->take(4) as $student) {
            Registration::create([
                'event_id' => $workshop->id,
                'student_id' => $student->id,
                'registered_at' => now()->subDays(10),
                'status' => 'confirmed',
                'qr_code_token' => 'QR-' . strtoupper(Str::random(10)),
            ]);
        }
    }
}
