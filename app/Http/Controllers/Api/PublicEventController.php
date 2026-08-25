<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\MediaGallery;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicEventController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Event::with('organizer.detail')
            ->where('approval_status', 'approved')
            ->where('status', '!=', 'draft');

        if ($request->has('category') && !empty($request->category)) {
            $query->where('category', $request->category);
        }

        if ($request->has('status') && !empty($request->status)) {
            $query->where('status', $request->status);
        }

        if ($request->has('department') && !empty($request->department)) {
            $query->whereHas('organizer.detail', function ($q) use ($request) {
                $q->where('department', $request->department);
            });
        }

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('venue', 'like', "%{$search}%");
            });
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('event_date', [$request->start_date, $request->end_date]);
        }

        $events = $query->orderBy('event_date', 'asc')->paginate(15);

        // Add computed dynamic capacity counts
        $events->getCollection()->transform(function ($event) {
            $event->confirmed_registrations = $event->confirmedRegistrationsCount();
            $event->available_seats = $event->availableSeats();
            $event->is_full = $event->isFull();
            return $event;
        });

        return response()->json($events);
    }

    public function show(int $id): JsonResponse
    {
        $event = Event::with(['organizer.detail', 'feedback.student', 'media'])
            ->where('approval_status', 'approved')
            ->findOrFail($id);

        $event->confirmed_registrations = $event->confirmedRegistrationsCount();
        $event->available_seats = $event->availableSeats();
        $event->is_full = $event->isFull();

        return response()->json($event);
    }

    public function gallery(Request $request): JsonResponse
    {
        $query = MediaGallery::with('event');

        if ($request->has('category') && !empty($request->category)) {
            $query->where('category', $request->category);
        }

        if ($request->has('department') && !empty($request->department)) {
            $query->where('department', $request->department);
        }

        if ($request->has('year') && !empty($request->year)) {
            $query->where('year', $request->year);
        }

        $media = $query->latest()->paginate(20);

        return response()->json($media);
    }

    public function announcements(): JsonResponse
    {
        $announcements = Notification::whereNull('user_id')
            ->where(function ($q) {
                $q->where('target_role', 'all')->orWhereNull('target_role');
            })
            ->latest()
            ->take(10)
            ->get();

        return response()->json($announcements);
    }

    public function sitemap(): JsonResponse
    {
        $pages = [
            ['name' => 'Home', 'url' => '/'],
            ['name' => 'Events', 'url' => '/events'],
            ['name' => 'Media Gallery', 'url' => '/gallery'],
            ['name' => 'About Us', 'url' => '/about'],
            ['name' => 'Contact Us', 'url' => '/contact'],
            ['name' => 'Login / Signup', 'url' => '/login'],
        ];

        $events = Event::where('approval_status', 'approved')
            ->select('id', 'title', 'event_date')
            ->get()
            ->map(fn($e) => ['name' => $e->title, 'url' => "/events/{$e->id}"]);

        return response()->json([
            'static_pages' => $pages,
            'event_pages' => $events,
        ]);
    }
}
