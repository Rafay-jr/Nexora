<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\Feedback;
use App\Models\User;
use Illuminate\Database\Seeder;

class FeedbackSeeder extends Seeder
{
    public function run(): void
    {
        $workshop = Event::where('title', 'like', '%AI & Machine Learning%')->first();
        $students = User::where('role', 'participant')->take(3)->get();

        $comments = [
            'Outstanding hands-on session! Learned real-world PyTorch model deployment.',
            'Great organization and clear speaker presentations. Venue hospitality was excellent.',
            'Extremely informative workshop. Looking forward to advanced AI sessions.',
        ];

        foreach ($students as $index => $student) {
            Feedback::create([
                'event_id' => $workshop->id,
                'student_id' => $student->id,
                'rating' => 5,
                'venue_rating' => 5,
                'coordination_rating' => 5,
                'technical_rating' => 5,
                'hospitality_rating' => 4,
                'comments' => $comments[$index],
                'submitted_at' => date('Y-m-d H:i:s', strtotime('-4 days')),
            ]);
        }
    }
}
