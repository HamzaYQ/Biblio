<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BookCopy extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'book_id',
        'barcode',
        'acquisition_date',
        'status',
        'location',
    ];

    protected $casts = [
        'acquisition_date' => 'date',
    ];

    public function book(): BelongsTo
    {
        return $this->belongsTo(Book::class, 'book_id');
    }

    // Historique des prêts pour cet exemplaire
    public function loans(): HasMany
    {
        return $this->hasMany(Loan::class, 'book_copy_id');
    }
}
