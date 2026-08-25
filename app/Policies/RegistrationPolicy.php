<?php

namespace App\Policies;

use App\Models\Registration;
use App\Models\User;

class RegistrationPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return null;
    }

    public function view(User $user, Registration $registration): bool
    {
        return $user->id === $registration->student_id || $user->id === $registration->event->organizer_id;
    }

    public function create(User $user): bool
    {
        return $user->isParticipant();
    }

    public function cancel(User $user, Registration $registration): bool
    {
        return $user->id === $registration->student_id;
    }
}
