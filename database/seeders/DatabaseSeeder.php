<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            EventSeeder::class,
            RegistrationSeeder::class,
            AttendanceSeeder::class,
            FeedbackSeeder::class,
            CertificateSeeder::class,
            MediaGallerySeeder::class,
            NotificationSeeder::class,
        ]);
    }
}
