<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Loan extends Model
{
    use HasFactory;

    protected $fillable = [
        'book_copy_id',
        'user_id',
        'issued_by',
        'loaned_at',
        'due_at',
        'returned_at',
        'status',
    ];

    protected $casts = [
        'loaned_at'   => 'datetime',
        'due_at'      => 'datetime',
        'returned_at' => 'datetime',
    ];

    public function bookCopy(): BelongsTo
    {
        return $this->belongsTo(BookCopy::class, 'book_copy_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // staff qui a émis le prêt
    public function issuedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'issued_by');
    }

    // Si besoin : fine associée à ce prêt
    public function fine(): HasOne
    {
        return $this->hasOne(Fine::class, 'loan_id');
    }
}
