<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $org1 = User::where('email', 'prof.sharma@eventsphere.test')->first();
        $org2 = User::where('email', 'dr.verma@eventsphere.test')->first();

        // 1. Technical Hackathon (Upcoming, Approved, Capacity: 3)
        Event::create([
            'organizer_id' => $org1->id,
            'title' => 'Nexora CodeSprint 2026 Hackathon',
            'description' => 'A 24-hour intensive coding hackathon focused on AI and web solutions for campus innovation.',
            'category' => 'technical',
            'event_date' => date('Y-m-d', strtotime('+7 days')),
            'start_time' => '09:00:00',
            'end_time' => '21:00:00',
            'venue' => 'Main Auditorium & CS Lab 3',
            'max_participants' => 3, // Small capacity to demonstrate full seats & waitlist
            'status' => 'active',
            'approval_status' => 'approved',
            'registration_deadline' => date('Y-m-d H:i:s', strtotime('+5 days')),
        ]);

        // 2. Cultural Fest (Upcoming, Approved, Capacity: 50)
        Event::create([
            'organizer_id' => $org2->id,
            'title' => 'Symphony 2026 Annual Cultural Night',
            'description' => 'Annual grand cultural night featuring music performances, dance competitions, and theatrical drama.',
            'category' => 'cultural',
            'event_date' => date('Y-m-d', strtotime('+14 days')),
            'start_time' => '17:00:00',
            'end_time' => '22:00:00',
            'venue' => 'Open Air Amphitheatre',
            'max_participants' => 50,
            'status' => 'active',
            'approval_status' => 'approved',
            'registration_deadline' => date('Y-m-d H:i:s', strtotime('+12 days')),
        ]);

        // 3. AI & ML Workshop (Completed, Approved, Capacity: 30)
        Event::create([
            'organizer_id' => $org1->id,
            'title' => 'Hands-on AI & Machine Learning Workshop',
            'description' => 'Interactive workshop covering PyTorch, neural networks, and model deployment on cloud platforms.',
            'category' => 'workshop',
            'event_date' => date('Y-m-d', strtotime('-5 days')),
            'start_time' => '10:00:00',
            'end_time' => '16:00:00',
            'venue' => 'Seminar Hall B',
            'max_participants' => 30,
            'status' => 'completed',
            'approval_status' => 'approved',
            'registration_deadline' => date('Y-m-d H:i:s', strtotime('-7 days')),
        ]);

        // 4. Intercollegiate Sports Tournament (Upcoming, Approved, Capacity: 40)
        Event::create([
            'organizer_id' => $org2->id,
            'title' => 'Intercollegiate Badminton & Futsal Championship',
            'description' => 'Multi-sport intercollegiate tournament bringing together top student athletes across the region.',
            'category' => 'sports',
            'event_date' => date('Y-m-d', strtotime('+20 days')),
            'start_time' => '08:00:00',
            'end_time' => '18:00:00',
            'venue' => 'Indoor Sports Complex',
            'max_participants' => 40,
            'status' => 'active',
            'approval_status' => 'approved',
            'registration_deadline' => date('Y-m-d H:i:s', strtotime('+18 days')),
        ]);

        // 5. Academic Guest Seminar (Pending Approval)
        Event::create([
            'organizer_id' => $org1->id,
            'title' => 'Cybersecurity Trends & Ethical Hacking Seminar',
            'description' => 'Keynote presentation by industry experts on cybersecurity defense, threat landscape, and ethical hacking.',
            'category' => 'seminar',
            'event_date' => date('Y-m-d', strtotime('+10 days')),
            'start_time' => '11:00:00',
            'end_time' => '13:00:00',
            'venue' => 'Conference Hall 1',
            'max_participants' => 100,
            'status' => 'active',
            'approval_status' => 'pending', // Awaiting Admin Approval
            'registration_deadline' => date('Y-m-d H:i:s', strtotime('+8 days')),
        ]);

        // 6. Cancelled Robotics League
        Event::create([
            'organizer_id' => $org1->id,
            'title' => 'Autonomous Robotics Obstacle Challenge',
            'description' => 'Competition for autonomous line-following and obstacle-avoidance robots.',
            'category' => 'competition',
            'event_date' => date('Y-m-d', strtotime('+3 days')),
            'start_time' => '14:00:00',
            'end_time' => '17:00:00',
            'venue' => 'Robotics Lab',
            'max_participants' => 15,
            'status' => 'cancelled',
            'approval_status' => 'approved',
            'registration_deadline' => date('Y-m-d H:i:s', strtotime('+1 day')),
            'cancellation_reason' => 'Venue maintenance and equipment recalibration.',
        ]);
    }
}
