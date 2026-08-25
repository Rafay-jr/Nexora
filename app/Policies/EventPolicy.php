<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;

class EventPolicy
{
    public function before(User $user, string $ability): ?bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return null;
    }

    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Event $event): bool
    {
        if ($event->approval_status === 'approved' && $event->status !== 'draft') {
            return true;
        }

        if (!$user) {
            return false;
        }

        return $user->id === $event->organizer_id;
    }

    public function create(User $user): bool
    {
        return $user->isOrganizer() || $user->isAdmin();
    }

    public function update(User $user, Event $event): bool
    {
        return $user->id === $event->organizer_id;
    }

    public function delete(User $user, Event $event): bool
    {
        return $user->isAdmin();
    }

    public function approve(User $user): bool
    {
        return $user->isAdmin();
    }
}
