<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Certificate;
use App\Models\Event;
use App\Models\Registration;
use App\Models\User;
use App\Models\UserDetail;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function dashboard(): JsonResponse
    {
        $totalUsers = User::count();
        $usersByRole = User::selectRaw('role, count(*) as count')->groupBy('role')->pluck('count', 'role');
        $totalEvents = Event::count();
        $eventsByApproval = Event::selectRaw('approval_status, count(*) as count')->groupBy('approval_status')->pluck('count', 'approval_status');
        $totalRegistrations = Registration::count();

        return response()->json([
            'total_users' => $totalUsers,
            'users_by_role' => $usersByRole,
            'total_events' => $totalEvents,
            'events_by_approval' => $eventsByApproval,
            'total_registrations' => $totalRegistrations,
        ]);
    }

    public function pendingEvents(): JsonResponse
    {
        $events = Event::with('organizer.detail')
            ->where('approval_status', 'pending')
            ->get();

        return response()->json($events);
    }

    public function approveEvent(int $id): JsonResponse
    {
        $event = Event::findOrFail($id);
        $event->update(['approval_status' => 'approved']);

        return response()->json(['message' => 'Event approved successfully.', 'event' => $event]);
    }

    public function rejectEvent(int $id, Request $request): JsonResponse
    {
        $event = Event::findOrFail($id);
        $event->update([
            'approval_status' => 'rejected',
            'cancellation_reason' => $request->reason ?? 'Rejected by Admin.',
        ]);

        return response()->json(['message' => 'Event rejected.', 'event' => $event]);
    }

    public function users(): JsonResponse
    {
        $users = User::with('detail')->latest()->paginate(20);
        return response()->json($users);
    }

    public function updateUserRole(int $id, Request $request): JsonResponse
    {
        $request->validate(['role' => 'required|in:admin,organizer,participant']);

        $user = User::findOrFail($id);
        $user->update(['role' => $request->role]);

        return response()->json(['message' => "User role updated to {$request->role}.", 'user' => $user]);
    }

    public function updateUserStatus(int $id, Request $request): JsonResponse
    {
        $request->validate(['status' => 'required|in:active,suspended']);

        $user = User::findOrFail($id);
        $user->update(['status' => $request->status]);

        return response()->json(['message' => "User status updated to {$request->status}.", 'user' => $user]);
    }

    public function updateUserProfile(int $id, Request $request): JsonResponse
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username,'.$user->id,
            'email' => 'required|email|max:255|unique:users,email,'.$user->id,
        ]);

        $user->update([
            'name' => $request->name,
            'username' => $request->username,
            'email' => $request->email,
        ]);

        if ($request->hasAny(['mobile', 'department', 'enrollment_no'])) {
            UserDetail::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'mobile' => $request->mobile,
                    'department' => $request->department,
                    'enrollment_no' => $request->enrollment_no,
                ]
            );
        }

        return response()->json(['message' => 'User profile updated.', 'user' => $user->load('detail')]);
    }

    public function adjustCapacity(int $eventId, Request $request): JsonResponse
    {
        $request->validate(['max_participants' => 'required|integer|min:1']);

        $event = Event::findOrFail($eventId);
        $event->update(['max_participants' => $request->max_participants]);

        $event->autoPromoteWaitlist();

        return response()->json([
            'message' => 'Event capacity updated.',
            'event' => $event,
            'available_seats' => $event->availableSeats(),
        ]);
    }

    public function reports(): JsonResponse
    {
        return response()->json([
            'events_summary' => Event::selectRaw('category, count(*) as count')->groupBy('category')->get(),
            'total_registrations' => Registration::count(),
            'total_attendances' => Attendance::count(),
            'total_certificates' => Certificate::count(),
        ]);
    }

    public function deleteFeedback(int $id): JsonResponse
    {
        $feedback = \App\Models\Feedback::findOrFail($id);
        $feedback->delete();

        return response()->json(['message' => 'Feedback deleted by admin moderation.']);
    }

    public function deleteMedia(int $id): JsonResponse
    {
        $media = \App\Models\MediaGallery::findOrFail($id);
        $media->delete();

        return response()->json(['message' => 'Media item deleted by admin moderation.']);
    }

    public function resetUserPassword(int $id, Request $request): JsonResponse
    {
        $request->validate(['password' => 'required|string|min:8']);

        $user = User::findOrFail($id);
        $user->update(['password' => \Illuminate\Support\Facades\Hash::make($request->password)]);

        return response()->json(['message' => "Password reset for {$user->email}."]);
    }

    public function deleteUser(int $id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User account deleted.']);
    }

    public function broadcastAnnouncement(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'message' => 'required|string',
            'target_role' => 'required|in:all,participant,organizer,admin',
        ]);

        $notification = \App\Models\Notification::create([
            'user_id' => null,
            'target_role' => $request->target_role,
            'title' => $request->title,
            'message' => $request->message,
            'type' => 'admin_announcement',
        ]);

        return response()->json(['message' => 'Broadcast announcement sent.', 'notification' => $notification]);
    }
}
