<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'nullable|in:participant,organizer',
            'mobile' => 'nullable|string|max:20',
            'department' => 'nullable|string|max:100',
            'enrollment_no' => 'nullable|string|max:100|unique:user_details,enrollment_no',
        ];
    }
}
