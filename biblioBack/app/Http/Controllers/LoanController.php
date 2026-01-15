<?php

namespace App\Http\Controllers;

use App\Models\Loan;
use Illuminate\Http\Request;

class LoanController extends Controller
{
    public function index()
    {
        $loans = Loan::with(['bookCopy.book', 'user', 'issuedBy'])->get();
        return response()->json($loans);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'book_copy_id' => 'required|exists:book_copies,id',
            'user_id' => 'required|exists:users,id',
            'issued_by' => 'nullable|exists:users,id',
            'loaned_at' => 'required|date',
            'due_at' => 'required|date|after:loaned_at',
            'status' => 'nullable|string|max:50',
        ]);

        $loan = Loan::create($validated);
        return response()->json($loan->load(['bookCopy.book', 'user', 'issuedBy']), 201);
    }

    public function show(Loan $loan)
    {
        return response()->json($loan->load(['bookCopy.book', 'user', 'issuedBy', 'fine']));
    }

    public function update(Request $request, Loan $loan)
    {
        $validated = $request->validate([
            'book_copy_id' => 'sometimes|required|exists:book_copies,id',
            'user_id' => 'sometimes|required|exists:users,id',
            'issued_by' => 'nullable|exists:users,id',
            'loaned_at' => 'sometimes|required|date',
            'due_at' => 'sometimes|required|date',
            'returned_at' => 'nullable|date',
            'status' => 'nullable|string|max:50',
        ]);

        $loan->update($validated);
        return response()->json($loan->load(['bookCopy.book', 'user', 'issuedBy']));
    }

    public function destroy(Loan $loan)
    {
        $loan->delete();
        return response()->json(['message' => 'Emprunt supprimé avec succès']);
    }

    public function returnBook(Loan $loan)
    {
        $loan->update([
            'returned_at' => now(),
            'status' => 'returned',
        ]);
        return response()->json($loan->load(['bookCopy.book', 'user']));
    }
}
