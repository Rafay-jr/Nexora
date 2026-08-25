<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SubmitFeedbackRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isParticipant();
    }

    public function rules(): array
    {
        return [
            'event_id' => 'required|exists:events,id',
            'rating' => 'required|integer|min:1|max:5',
            'venue_rating' => 'nullable|integer|min:1|max:5',
            'coordination_rating' => 'nullable|integer|min:1|max:5',
            'technical_rating' => 'nullable|integer|min:1|max:5',
            'hospitality_rating' => 'nullable|integer|min:1|max:5',
            'comments' => 'nullable|string|max:1000',
        ];
    }
}
