<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organizer_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->enum('category', ['technical', 'cultural', 'sports', 'workshop', 'seminar', 'competition']);
            $table->date('event_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('venue');
            $table->integer('max_participants');
            $table->enum('status', ['draft', 'active', 'completed', 'cancelled'])->default('active');
            $table->enum('approval_status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->dateTime('registration_deadline');
            $table->string('cancellation_reason')->nullable();
            $table->timestamps();

            $table->index(['event_date', 'category', 'approval_status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
