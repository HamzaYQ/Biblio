<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Staff extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'phone',
        'address',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active'         => 'boolean',
    ];

    // Prêts émis par ce bibliothécaire
    public function issuedLoans(): HasMany
    {
        return $this->hasMany(Loan::class, 'issued_by');
    }

    // Pénalités émises par ce bibliothécaire
    public function issuedFines(): HasMany
    {
        return $this->hasMany(Fine::class, 'issued_by');
    }

    // Pénalités encaissées / traitées par ce bibliothécaire
    public function handledFines(): HasMany
    {
        return $this->hasMany(Fine::class, 'handled_by');
    }
}
