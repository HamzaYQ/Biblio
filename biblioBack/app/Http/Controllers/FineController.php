<?php

namespace App\Http\Controllers;

use App\Models\Fine;
use Illuminate\Http\Request;

class FineController extends Controller
{
    public function index()
    {
        $fines = Fine::with(['user', 'loan.bookCopy.book', 'issuedBy', 'handledBy'])->get();
        return response()->json($fines);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'loan_id' => 'nullable|exists:loans,id',
            'amount' => 'required|numeric|min:0',
            'reason' => 'nullable|string',
            'issued_by' => 'nullable|exists:users,id',
            'issued_at' => 'required|date',
        ]);

        $fine = Fine::create($validated);
        return response()->json($fine->load(['user', 'loan', 'issuedBy']), 201);
    }

    public function show(Fine $fine)
    {
        return response()->json($fine->load(['user', 'loan.bookCopy.book', 'issuedBy', 'handledBy']));
    }

    public function update(Request $request, Fine $fine)
    {
        $validated = $request->validate([
            'user_id' => 'sometimes|required|exists:users,id',
            'loan_id' => 'nullable|exists:loans,id',
            'amount' => 'sometimes|required|numeric|min:0',
            'reason' => 'nullable|string',
            'issued_by' => 'nullable|exists:users,id',
            'issued_at' => 'sometimes|required|date',
            'paid' => 'nullable|boolean',
            'paid_at' => 'nullable|date',
            'payment_method' => 'nullable|string|max:50',
            'payment_reference' => 'nullable|string|max:255',
            'handled_by' => 'nullable|exists:users,id',
        ]);

        $fine->update($validated);
        return response()->json($fine->load(['user', 'loan', 'issuedBy', 'handledBy']));
    }

    public function destroy(Fine $fine)
    {
        $fine->delete();
        return response()->json(['message' => 'Amende supprimée avec succès']);
    }

    public function pay(Request $request, Fine $fine)
    {
        $validated = $request->validate([
            'payment_method' => 'nullable|string|max:50',
            'payment_reference' => 'nullable|string|max:255',
            'handled_by' => 'nullable|exists:users,id',
        ]);

        $fine->update([
            'paid' => true,
            'paid_at' => now(),
            'payment_method' => $validated['payment_method'] ?? null,
            'payment_reference' => $validated['payment_reference'] ?? null,
            'handled_by' => $validated['handled_by'] ?? null,
        ]);

        return response()->json($fine->load(['user', 'loan', 'handledBy']));
    }
}
