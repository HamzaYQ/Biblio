<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function index()
    {
        $reservations = Reservation::with(['book', 'user'])->get();
        return response()->json($reservations);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'book_id' => 'required|exists:books,id',
            'user_id' => 'required|exists:users,id',
            'reserved_at' => 'required|date',
            'expires_at' => 'nullable|date|after:reserved_at',
            'position' => 'nullable|integer|min:1',
            'status' => 'nullable|string|max:50',
        ]);

        $reservation = Reservation::create($validated);
        return response()->json($reservation->load(['book', 'user']), 201);
    }

    public function show(Reservation $reservation)
    {
        return response()->json($reservation->load(['book', 'user']));
    }

    public function update(Request $request, Reservation $reservation)
    {
        $validated = $request->validate([
            'book_id' => 'sometimes|required|exists:books,id',
            'user_id' => 'sometimes|required|exists:users,id',
            'reserved_at' => 'sometimes|required|date',
            'expires_at' => 'nullable|date',
            'position' => 'nullable|integer|min:1',
            'status' => 'nullable|string|max:50',
            'notified_at' => 'nullable|date',
        ]);

        $reservation->update($validated);
        return response()->json($reservation->load(['book', 'user']));
    }

    public function destroy(Reservation $reservation)
    {
        $reservation->delete();
        return response()->json(['message' => 'Réservation supprimée avec succès']);
    }
}
