<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\SubmitFeedbackRequest;
use App\Models\CalendarSync;
use App\Models\Certificate;
use App\Models\Event;
use App\Models\EventShareLog;
use App\Models\EventWaitlist;
use App\Models\Feedback;
use App\Models\Registration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ParticipantController extends Controller
{
    public function registerForEvent(Request $request): JsonResponse
    {
        $request->validate(['event_id' => 'required|exists:events,id']);
        $user = $request->user();
        $event = Event::findOrFail($request->event_id);

        if ($event->approval_status !== 'approved' || $event->status !== 'active') {
            return response()->json(['message' => 'Event is not open for registration.'], 400);
        }

        $existing = Registration::where('event_id', $event->id)
            ->where('student_id', $user->id)
            ->where('status', 'confirmed')
            ->first();

        if ($existing) {
            return response()->json(['message' => 'You are already registered for this event.'], 400);
        }

        // Check venue capacity
        if ($event->isFull()) {
            $waitlist = EventWaitlist::create([
                'event_id' => $event->id,
                'user_id' => $user->id,
                'waitlist_time' => now(),
                'status' => 'waiting',
            ]);

            return response()->json([
                'message' => 'Event venue is at full capacity. You have been added to the waitlist.',
                'status' => 'waitlist',
                'waitlist' => $waitlist,
            ], 200);
        }

        $registration = Registration::create([
            'event_id' => $event->id,
            'student_id' => $user->id,
            'registered_at' => now(),
            'status' => 'confirmed',
            'qr_code_token' => 'QR-' . strtoupper(Str::random(10)),
        ]);

        return response()->json([
            'message' => 'Successfully registered for event.',
            'status' => 'confirmed',
            'registration' => $registration->load('event'),
        ], 201);
    }

    public function cancelRegistration(int $id, Request $request): JsonResponse
    {
        $user = $request->user();
        $registration = Registration::where('id', $id)
            ->where('student_id', $user->id)
            ->firstOrFail();

        $registration->update(['status' => 'cancelled']);

        // Auto-promote waitlisted student if available
        $promotedRegistration = $registration->event->autoPromoteWaitlist();

        return response()->json([
            'message' => 'Registration cancelled successfully.',
            'auto_promoted_waitlist_user' => $promotedRegistration ? true : false,
        ]);
    }

    public function dashboard(Request $request): JsonResponse
    {
        $user = $request->user();

        $registrations = Registration::with('event')
            ->where('student_id', $user->id)
            ->get();

        $certificates = Certificate::with('event')
            ->where('student_id', $user->id)
            ->get();

        $waitlists = EventWaitlist::with('event')
            ->where('user_id', $user->id)
            ->get();

        return response()->json([
            'user' => $user->load('detail'),
            'registrations' => $registrations,
            'certificates' => $certificates,
            'waitlists' => $waitlists,
        ]);
    }

    public function submitFeedback(SubmitFeedbackRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        $feedback = Feedback::updateOrCreate(
            ['event_id' => $validated['event_id'], 'student_id' => $user->id],
            [
                'rating' => $validated['rating'],
                'venue_rating' => $validated['venue_rating'] ?? null,
                'coordination_rating' => $validated['coordination_rating'] ?? null,
                'technical_rating' => $validated['technical_rating'] ?? null,
                'hospitality_rating' => $validated['hospitality_rating'] ?? null,
                'comments' => $validated['comments'] ?? null,
                'submitted_at' => now(),
            ]
        );

        return response()->json([
            'message' => 'Feedback submitted successfully.',
            'feedback' => $feedback,
        ]);
    }

    public function certificates(Request $request): JsonResponse
    {
        $certificates = Certificate::with('event')
            ->where('student_id', $request->user()->id)
            ->get();

        return response()->json($certificates);
    }

    public function calendarSync(Request $request): JsonResponse
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'calendar_type' => 'required|in:google,outlook,apple',
        ]);

        $user = $request->user();
        $event = Event::findOrFail($request->event_id);

        $icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:{$event->title}\nDESCRIPTION:{$event->description}\nLOCATION:{$event->venue}\nEND:VEVENT\nEND:VCALENDAR";

        $sync = CalendarSync::create([
            'user_id' => $user->id,
            'event_id' => $event->id,
            'calendar_type' => $request->calendar_type,
            'ics_reference' => 'ICS-' . Str::uuid(),
            'synced_at' => now(),
        ]);

        return response()->json([
            'message' => 'Calendar synced successfully.',
            'sync' => $sync,
            'ics_content' => $icsContent,
        ]);
    }

    public function shareLog(Request $request): JsonResponse
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'platform' => 'required|in:facebook,whatsapp,twitter,linkedin,instagram,email',
            'share_message' => 'nullable|string',
        ]);

        $log = EventShareLog::create([
            'user_id' => $request->user()->id ?? null,
            'event_id' => $request->event_id,
            'platform' => $request->platform,
            'share_message' => $request->share_message,
            'shared_at' => now(),
        ]);

        return response()->json(['message' => 'Share logged successfully.', 'log' => $log]);
    }

    public function getBookmarks(Request $request): JsonResponse
    {
        $bookmarks = \App\Models\EventBookmark::with('event.organizer.detail')
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json($bookmarks);
    }

    public function toggleBookmark(Request $request): JsonResponse
    {
        $request->validate(['event_id' => 'required|exists:events,id']);
        $user = $request->user();

        $bookmark = \App\Models\EventBookmark::where('user_id', $user->id)
            ->where('event_id', $request->event_id)
            ->first();

        if ($bookmark) {
            $bookmark->delete();
            return response()->json(['message' => 'Event removed from bookmarks.', 'bookmarked' => false]);
        }

        $newBookmark = \App\Models\EventBookmark::create([
            'user_id' => $user->id,
            'event_id' => $request->event_id,
        ]);

        return response()->json(['message' => 'Event bookmarked.', 'bookmarked' => true, 'bookmark' => $newBookmark]);
    }

    public function getSavedMedia(Request $request): JsonResponse
    {
        $saved = \App\Models\SavedMedia::with('media.event')
            ->where('user_id', $request->user()->id)
            ->get();

        return response()->json($saved);
    }

    public function toggleSavedMedia(Request $request): JsonResponse
    {
        $request->validate(['media_id' => 'required|exists:media_galleries,id']);
        $user = $request->user();

        $saved = \App\Models\SavedMedia::where('user_id', $user->id)
            ->where('media_id', $request->media_id)
            ->first();

        if ($saved) {
            $saved->delete();
            return response()->json(['message' => 'Media removed from saved list.', 'saved' => false]);
        }

        $newSaved = \App\Models\SavedMedia::create([
            'user_id' => $user->id,
            'media_id' => $request->media_id,
        ]);

        return response()->json(['message' => 'Media saved to profile.', 'saved' => true, 'saved_item' => $newSaved]);
    }

    public function getNotifications(Request $request): JsonResponse
    {
        $user = $request->user();
        $notifications = \App\Models\Notification::where(function ($q) use ($user) {
            $q->where('user_id', $user->id)
              ->orWhereNull('user_id');
        })
        ->where(function ($q) use ($user) {
            $q->where('target_role', 'all')
              ->orWhere('target_role', $user->role)
              ->orWhereNull('target_role');
        })
        ->latest()
        ->get();

        return response()->json($notifications);
    }

    public function markNotificationRead(int $id, Request $request): JsonResponse
    {
        $notification = \App\Models\Notification::findOrFail($id);
        $notification->update(['read_at' => now()]);

        return response()->json(['message' => 'Notification marked as read.']);
    }
}
