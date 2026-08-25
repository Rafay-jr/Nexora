<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\OrganizerController;
use App\Http\Controllers\Api\ParticipantController;
use App\Http\Controllers\Api\PublicEventController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public / Visitor API Routes
|--------------------------------------------------------------------------
*/
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/events', [PublicEventController::class, 'index']);
Route::get('/events/{id}', [PublicEventController::class, 'show']);
Route::get('/gallery', [PublicEventController::class, 'gallery']);
Route::get('/announcements', [PublicEventController::class, 'announcements']);
Route::get('/sitemap', [PublicEventController::class, 'sitemap']);

/*
|--------------------------------------------------------------------------
| Authenticated User Routes (Sanctum Protected)
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
    Route::put('/auth/password', [AuthController::class, 'updatePassword']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Notifications
    Route::get('/notifications', [ParticipantController::class, 'getNotifications']);
    Route::post('/notifications/{id}/read', [ParticipantController::class, 'markNotificationRead']);

    /*
    |--------------------------------------------------------------------------
    | Participant Routes (Registered Student)
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:participant,organizer,admin')->prefix('participant')->group(function () {
        Route::get('/dashboard', [ParticipantController::class, 'dashboard']);
        Route::post('/register-event', [ParticipantController::class, 'registerForEvent']);
        Route::post('/cancel-registration/{id}', [ParticipantController::class, 'cancelRegistration']);
        Route::post('/feedback', [ParticipantController::class, 'submitFeedback']);
        Route::get('/certificates', [ParticipantController::class, 'certificates']);
        Route::post('/calendar-sync', [ParticipantController::class, 'calendarSync']);
        Route::post('/share-log', [ParticipantController::class, 'shareLog']);
        Route::get('/bookmarks', [ParticipantController::class, 'getBookmarks']);
        Route::post('/bookmark', [ParticipantController::class, 'toggleBookmark']);
        Route::get('/saved-media', [ParticipantController::class, 'getSavedMedia']);
        Route::post('/saved-media', [ParticipantController::class, 'toggleSavedMedia']);
    });

    /*
    |--------------------------------------------------------------------------
    | Organizer Routes (College Staff)
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:organizer,admin')->prefix('organizer')->group(function () {
        Route::get('/dashboard', [OrganizerController::class, 'dashboard']);
        Route::post('/events', [OrganizerController::class, 'storeEvent']);
        Route::put('/events/{id}', [OrganizerController::class, 'updateEvent']);
        Route::get('/events/{id}/registrations', [OrganizerController::class, 'getRegistrations']);
        Route::post('/attendance/scan', [OrganizerController::class, 'scanAttendance']);
        Route::post('/certificates/upload', [OrganizerController::class, 'uploadCertificate']);
        Route::post('/media/upload', [OrganizerController::class, 'uploadMedia']);
        Route::post('/announcements', [OrganizerController::class, 'sendAnnouncement']);
    });

    /*
    |--------------------------------------------------------------------------
    | Admin Routes (System Administrator)
    |--------------------------------------------------------------------------
    */
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        Route::get('/pending-events', [AdminController::class, 'pendingEvents']);
        Route::post('/events/{id}/approve', [AdminController::class, 'approveEvent']);
        Route::post('/events/{id}/reject', [AdminController::class, 'rejectEvent']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::put('/users/{id}/role', [AdminController::class, 'updateUserRole']);
        Route::put('/users/{id}/status', [AdminController::class, 'updateUserStatus']);
        Route::post('/users/{id}/reset-password', [AdminController::class, 'resetUserPassword']);
        Route::delete('/users/{id}', [AdminController::class, 'deleteUser']);
        Route::post('/events/{id}/capacity', [AdminController::class, 'adjustCapacity']);
        Route::delete('/feedback/{id}', [AdminController::class, 'deleteFeedback']);
        Route::delete('/media/{id}', [AdminController::class, 'deleteMedia']);
        Route::post('/announcements', [AdminController::class, 'broadcastAnnouncement']);
        Route::get('/reports', [AdminController::class, 'reports']);
    });
});
