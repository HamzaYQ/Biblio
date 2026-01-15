<?php

namespace App\Http\Controllers;

use App\Models\BookCopy;
use Illuminate\Http\Request;

class BookCopyController extends Controller
{
    public function index()
    {
        $bookCopies = BookCopy::with(['book', 'loans'])->get();
        return response()->json($bookCopies);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'book_id' => 'required|exists:books,id',
            'barcode' => 'nullable|string|unique:book_copies',
            'acquisition_date' => 'nullable|date',
            'status' => 'nullable|string|max:50',
            'location' => 'nullable|string|max:255',
        ]);

        $bookCopy = BookCopy::create($validated);
        return response()->json($bookCopy->load('book'), 201);
    }

    public function show(BookCopy $bookCopy)
    {
        return response()->json($bookCopy->load(['book', 'loans']));
    }

    public function update(Request $request, BookCopy $bookCopy)
    {
        $validated = $request->validate([
            'book_id' => 'sometimes|required|exists:books,id',
            'barcode' => 'nullable|string|unique:book_copies,barcode,' . $bookCopy->id,
            'acquisition_date' => 'nullable|date',
            'status' => 'nullable|string|max:50',
            'location' => 'nullable|string|max:255',
        ]);

        $bookCopy->update($validated);
        return response()->json($bookCopy->load('book'));
    }

    public function destroy(BookCopy $bookCopy)
    {
        $bookCopy->delete();
        return response()->json(['message' => 'Exemplaire supprimé avec succès']);
    }
}
