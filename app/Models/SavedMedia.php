<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SavedMedia extends Model
{
    use HasFactory;

    protected $table = 'saved_media';

    protected $fillable = ['user_id', 'media_id'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function media()
    {
        return $this->belongsTo(MediaGallery::class, 'media_id');
    }
}
