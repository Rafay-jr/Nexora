<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'organizer_id',
        'title',
        'description',
        'category',
        'event_date',
        'start_time',
        'end_time',
        'venue',
        'max_participants',
        'status',
        'approval_status',
        'registration_deadline',
        'cancellation_reason',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
            'registration_deadline' => 'datetime',
            'max_participants' => 'integer',
        ];
    }

    public function organizer()
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    public function registrations()
    {
        return $this->hasMany(Registration::class, 'event_id');
    }

    public function activeRegistrations()
    {
        return $this->registrations()->where('status', 'confirmed');
    }

    public function attendances()
    {
        return $this->hasMany(Attendance::class, 'event_id');
    }

    public function feedback()
    {
        return $this->hasMany(Feedback::class, 'event_id');
    }

    public function certificates()
    {
        return $this->hasMany(Certificate::class, 'event_id');
    }

    public function media()
    {
        return $this->hasMany(MediaGallery::class, 'event_id');
    }

    public function waitlists()
    {
        return $this->hasMany(EventWaitlist::class, 'event_id');
    }

    public function calendarSyncs()
    {
        return $this->hasMany(CalendarSync::class, 'event_id');
    }

    public function shareLogs()
    {
        return $this->hasMany(EventShareLog::class, 'event_id');
    }

    public function confirmedRegistrationsCount(): int
    {
        return $this->activeRegistrations()->count();
    }

    public function availableSeats(): int
    {
        $seatsLeft = $this->max_participants - $this->confirmedRegistrationsCount();
        return max(0, $seatsLeft);
    }

    public function isFull(): bool
    {
        return $this->availableSeats() <= 0;
    }

    public function autoPromoteWaitlist(): ?Registration
    {
        if ($this->isFull()) {
            return null;
        }

        $nextWaitlisted = $this->waitlists()
            ->where('status', 'waiting')
            ->orderBy('waitlist_time', 'asc')
            ->first();

        if (!$nextWaitlisted) {
            return null;
        }

        $nextWaitlisted->update(['status' => 'confirmed']);

        $registration = Registration::create([
            'event_id' => $this->id,
            'student_id' => $nextWaitlisted->user_id,
            'status' => 'confirmed',
            'qr_code_token' => 'QR-' . strtoupper(\Illuminate\Support\Str::random(10)),
        ]);

        return $registration;
    }
}
