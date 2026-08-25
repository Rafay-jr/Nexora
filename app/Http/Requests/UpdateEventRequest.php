<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && ($this->user()->isOrganizer() || $this->user()->isAdmin());
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'category' => 'sometimes|in:technical,cultural,sports,workshop,seminar,competition',
            'event_date' => 'sometimes|date',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i',
            'venue' => 'sometimes|string|max:255',
            'max_participants' => 'sometimes|integer|min:1',
            'status' => 'sometimes|in:draft,active,completed,cancelled',
            'registration_deadline' => 'sometimes|date',
            'cancellation_reason' => 'nullable|string|max:255',
        ];
    }
}
