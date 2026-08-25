<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certificate extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'student_id',
        'certificate_url',
        'fee_paid',
        'issued_at',
    ];

    protected function casts(): array
    {
        return [
            'fee_paid' => 'boolean',
            'issued_at' => 'datetime',
        ];
    }

    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id');
    }

    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }
}
