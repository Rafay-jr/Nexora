<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserDetail;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('password123');

        // Admin Account
        $admin = User::create([
            'name' => 'System Administrator',
            'username' => 'admin',
            'email' => 'admin@eventsphere.test',
            'password' => $password,
            'role' => 'admin',
            'status' => 'active',
        ]);
        UserDetail::create([
            'user_id' => $admin->id,
            'full_name' => 'System Administrator',
            'mobile' => '+919876543210',
            'department' => 'Administration',
            'enrollment_no' => 'ADM-2026-001',
        ]);

        // Organizer Accounts
        $org1 = User::create([
            'name' => 'Prof. Rajesh Sharma',
            'username' => 'prof_sharma',
            'email' => 'prof.sharma@eventsphere.test',
            'password' => $password,
            'role' => 'organizer',
            'status' => 'active',
        ]);
        UserDetail::create([
            'user_id' => $org1->id,
            'full_name' => 'Prof. Rajesh Sharma',
            'mobile' => '+919876543211',
            'department' => 'Computer Science & Engineering',
            'enrollment_no' => 'FAC-CSE-012',
        ]);

        $org2 = User::create([
            'name' => 'Dr. Meera Verma',
            'username' => 'dr_verma',
            'email' => 'dr.verma@eventsphere.test',
            'password' => $password,
            'role' => 'organizer',
            'status' => 'active',
        ]);
        UserDetail::create([
            'user_id' => $org2->id,
            'full_name' => 'Dr. Meera Verma',
            'mobile' => '+919876543212',
            'department' => 'Cultural & Fine Arts Board',
            'enrollment_no' => 'FAC-CULT-005',
        ]);

        // Participant Accounts (Students)
        $students = [
            ['name' => 'Aarav Patel', 'username' => 'aarav_patel', 'email' => 'student1@eventsphere.test', 'dept' => 'Computer Science', 'enroll' => 'EN2024001'],
            ['name' => 'Ananya Roy', 'username' => 'ananya_roy', 'email' => 'student2@eventsphere.test', 'dept' => 'Information Technology', 'enroll' => 'EN2024002'],
            ['name' => 'Rohan Gupta', 'username' => 'rohan_gupta', 'email' => 'student3@eventsphere.test', 'dept' => 'Mechanical Engineering', 'enroll' => 'EN2024003'],
            ['name' => 'Sneha Rao', 'username' => 'sneha_rao', 'email' => 'student4@eventsphere.test', 'dept' => 'Electronics & Telecom', 'enroll' => 'EN2024004'],
            ['name' => 'Vikram Singh', 'username' => 'vikram_singh', 'email' => 'student5@eventsphere.test', 'dept' => 'Civil Engineering', 'enroll' => 'EN2024005'],
        ];

        foreach ($students as $stu) {
            $user = User::create([
                'name' => $stu['name'],
                'username' => $stu['username'],
                'email' => $stu['email'],
                'password' => $password,
                'role' => 'participant',
                'status' => 'active',
            ]);

            UserDetail::create([
                'user_id' => $user->id,
                'full_name' => $stu['name'],
                'mobile' => '+9198' . rand(10000000, 99999999),
                'department' => $stu['dept'],
                'enrollment_no' => $stu['enroll'],
            ]);
        }
    }
}
