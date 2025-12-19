<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Book extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'isbn',
        'publisher_id',
        'published_year',
        'pages',
        'language',
        'description',
        'cover_url',
    ];

    protected $casts = [
        'published_year' => 'integer',
        'pages' => 'integer',
    ];

    public function publisher(): BelongsTo
    {
        return $this->belongsTo(Publisher::class, 'publisher_id');
    }

    public function authors(): BelongsToMany
    {
        return $this->belongsToMany(Author::class, 'book_author')->withTimestamps();
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class, 'book_category')->withTimestamps();
    }

    public function copies(): HasMany
    {
        return $this->hasMany(BookCopy::class, 'book_id');
    }

    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class, 'book_id');
    }

    /**
     * Accessor pour calculer le nombre total d'exemplaires
     * Utilisation : $book->total_copies
     */
    public function getTotalCopiesAttribute(): int
    {
        return $this->copies()->count();
    }
}
