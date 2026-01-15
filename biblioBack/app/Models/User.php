<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, Notifiable, SoftDeletes, HasApiTokens;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'role',
        'membership_number',
        'phone',
        'address',
        'membership_start',
        'membership_end',
        'fines_balance',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'membership_start'  => 'date',
        'membership_end'    => 'date',
        'fines_balance'     => 'decimal:2',
        'is_active'         => 'boolean',
    ];

    // Emprunts réalisés par l'utilisateur (membre)
    public function loans(): HasMany
    {
        return $this->hasMany(Loan::class, 'user_id');
    }

    // Prêts émis par cet utilisateur (staff) : issued_by
    public function issuedLoans(): HasMany
    {
        return $this->hasMany(Loan::class, 'issued_by');
    }

    // Pénalités liées à l'utilisateur (comme débiteur)
    public function fines(): HasMany
    {
        return $this->hasMany(Fine::class, 'user_id');
    }

    // Pénalités encaissées / traitées par ce staff (handled_by)
    public function handledFines(): HasMany
    {
        return $this->hasMany(Fine::class, 'handled_by');
    }

    // Réservations faites par l'utilisateur
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class, 'user_id');
    }
}
