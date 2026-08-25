<?php

namespace Database\Seeders;

use App\Models\Certificate;
use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Seeder;

class CertificateSeeder extends Seeder
{
    public function run(): void
    {
        $workshop = Event::where('title', 'like', '%AI & Machine Learning%')->first();
        $students = User::where('role', 'participant')->take(3)->get();

        foreach ($students as $index => $student) {
            Certificate::create([
                'event_id' => $workshop->id,
                'student_id' => $student->id,
                'certificate_url' => "/storage/certificates/cert_ai_workshop_{$student->id}.pdf",
                'fee_paid' => true,
                'issued_at' => date('Y-m-d H:i:s', strtotime('-3 days')),
            ]);
        }
    }
}
