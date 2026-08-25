<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\MediaGallery;
use App\Models\User;
use Illuminate\Database\Seeder;

class MediaGallerySeeder extends Seeder
{
    public function run(): void
    {
        $org1 = User::where('email', 'prof.sharma@eventsphere.test')->first();
        $org2 = User::where('email', 'dr.verma@eventsphere.test')->first();
        $workshop = Event::where('title', 'like', '%AI & Machine Learning%')->first();

        $galleryItems = [
            [
                'event_id' => $workshop->id,
                'uploaded_by' => $org1->id,
                'file_type' => 'image',
                'file_url' => 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
                'caption' => 'AI Workshop Lab Session with Hands-on coding',
                'category' => 'Workshops and Seminars',
                'department' => 'Computer Science & Engineering',
                'year' => 2026,
            ],
            [
                'event_id' => null,
                'uploaded_by' => $org2->id,
                'file_type' => 'image',
                'file_url' => 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
                'caption' => 'Annual Cultural Night Stage Performance Highlight',
                'category' => 'Cultural Events',
                'department' => 'Cultural & Fine Arts Board',
                'year' => 2025,
            ],
            [
                'event_id' => null,
                'uploaded_by' => $org1->id,
                'file_type' => 'image',
                'file_url' => 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
                'caption' => 'Technical Fest Keynote Presentation',
                'category' => 'Technical Fests',
                'department' => 'Information Technology',
                'year' => 2025,
            ],
            [
                'event_id' => null,
                'uploaded_by' => $org2->id,
                'file_type' => 'image',
                'file_url' => 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80',
                'caption' => 'Intercollegiate Futsal Final Match Winners',
                'category' => 'Sports Meets',
                'department' => 'Physical Education Department',
                'year' => 2025,
            ],
        ];

        foreach ($galleryItems as $item) {
            MediaGallery::create($item);
        }
    }
}
