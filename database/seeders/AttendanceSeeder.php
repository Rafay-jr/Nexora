<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    public function run(): void
    {
        $workshop = Event::where('title', 'like', '%AI & Machine Learning%')->first();
        $organizer = User::where('email', 'prof.sharma@eventsphere.test')->first();
        $students = User::where('role', 'participant')->take(3)->get();

        foreach ($students as $student) {
            Attendance::create([
                'event_id' => $workshop->id,
                'student_id' => $student->id,
                'attended' => true,
                'marked_at' => date('Y-m-d H:i:s', strtotime('-5 days +10 hours')),
                'marked_by' => $organizer->id,
            ]);
        }
    }
}
