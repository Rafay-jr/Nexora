<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateEventRequest;
use App\Http\Requests\UpdateEventRequest;
use App\Models\Attendance;
use App\Models\Certificate;
use App\Models\Event;
use App\Models\MediaGallery;
use App\Models\Registration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrganizerController extends Controller
{
    public function dashboard(Request $request): JsonResponse
    {
        $user = $request->user();

        $events = Event::withCount(['registrations', 'attendances', 'feedback'])
            ->where('organizer_id', $user->id)
            ->latest()
            ->get();

        return response()->json([
            'organizer' => $user->load('detail'),
            'total_events' => $events->count(),
            'events' => $events,
        ]);
    }

    public function storeEvent(CreateEventRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $user = $request->user();

        $event = Event::create([
            'organizer_id' => $user->id,
            'title' => $validated['title'],
            'description' => $validated['description'],
            'category' => $validated['category'],
            'event_date' => $validated['event_date'],
            'start_time' => $validated['start_time'],
            'end_time' => $validated['end_time'],
            'venue' => $validated['venue'],
            'max_participants' => $validated['max_participants'],
            'status' => 'active',
            'approval_status' => 'pending', // Requires admin approval
            'registration_deadline' => $validated['registration_deadline'],
        ]);

        return response()->json([
            'message' => 'Event created successfully and submitted for Admin approval.',
            'event' => $event,
        ], 201);
    }

    public function updateEvent(int $id, UpdateEventRequest $request): JsonResponse
    {
        $event = Event::findOrFail($id);
        $user = $request->user();

        if (!$user->isAdmin() && $event->organizer_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized to update this event.'], 403);
        }

        $event->update($request->validated());

        return response()->json([
            'message' => 'Event updated successfully.',
            'event' => $event,
        ]);
    }

    public function getRegistrations(int $eventId, Request $request): JsonResponse
    {
        $event = Event::findOrFail($eventId);
        $user = $request->user();

        if (!$user->isAdmin() && $event->organizer_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $registrations = Registration::with('student.detail')
            ->where('event_id', $eventId)
            ->get();

        return response()->json($registrations);
    }

    public function scanAttendance(Request $request): JsonResponse
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'qr_code_token' => 'required|string',
        ]);

        $user = $request->user();
        $registration = Registration::where('event_id', $request->event_id)
            ->where('qr_code_token', $request->qr_code_token)
            ->first();

        if (!$registration) {
            return response()->json(['message' => 'Invalid QR Code Token.'], 404);
        }

        $attendance = Attendance::updateOrCreate(
            ['event_id' => $request->event_id, 'student_id' => $registration->student_id],
            [
                'attended' => true,
                'marked_at' => now(),
                'marked_by' => $user->id,
            ]
        );

        return response()->json([
            'message' => 'Attendance marked successfully.',
            'attendance' => $attendance->load('student.detail'),
        ]);
    }

    public function uploadCertificate(Request $request): JsonResponse
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'student_id' => 'required|exists:users,id',
            'certificate_url' => 'required|string',
            'fee_paid' => 'nullable|boolean',
        ]);

        $certificate = Certificate::updateOrCreate(
            ['event_id' => $request->event_id, 'student_id' => $request->student_id],
            [
                'certificate_url' => $request->certificate_url,
                'fee_paid' => $request->fee_paid ?? false,
                'issued_at' => now(),
            ]
        );

        return response()->json([
            'message' => 'Certificate uploaded/issued successfully.',
            'certificate' => $certificate,
        ]);
    }

    public function uploadMedia(Request $request): JsonResponse
    {
        $request->validate([
            'event_id' => 'nullable|exists:events,id',
            'file_type' => 'required|in:image,video',
            'file_url' => 'required|string',
            'caption' => 'nullable|string',
            'category' => 'required|string',
            'department' => 'nullable|string',
            'year' => 'nullable|integer',
        ]);

        $media = MediaGallery::create([
            'event_id' => $request->event_id,
            'uploaded_by' => $request->user()->id,
            'file_type' => $request->file_type,
            'file_url' => $request->file_url,
            'caption' => $request->caption,
            'category' => $request->category,
            'department' => $request->department,
            'year' => $request->year ?? date('Y'),
        ]);

        return response()->json([
            'message' => 'Media uploaded successfully.',
            'media' => $media,
        ], 201);
    }

    public function sendAnnouncement(Request $request): JsonResponse
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'title' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $event = Event::findOrFail($request->event_id);
        if (!$request->user()->isAdmin() && $event->organizer_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $registrations = Registration::where('event_id', $event->id)->get();

        foreach ($registrations as $reg) {
            \App\Models\Notification::create([
                'user_id' => $reg->student_id,
                'target_role' => 'participant',
                'title' => "Announcement for {$event->title}: {$request->title}",
                'message' => $request->message,
                'type' => 'organizer_announcement',
            ]);
        }

        return response()->json([
            'message' => 'Announcement sent to all registered participants.',
            'recipients_count' => $registrations->count(),
        ]);
    }
}
