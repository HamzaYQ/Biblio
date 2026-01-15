<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function index()
    {
        $books = Book::with(['publisher', 'authors', 'categories', 'copies'])->get();
        return response()->json($books);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'isbn' => 'nullable|string|unique:books',
            'publisher_id' => 'nullable|exists:publishers,id',
            'published_year' => 'nullable|integer|min:1000|max:' . date('Y'),
            'pages' => 'nullable|integer|min:1',
            'language' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'cover_url' => 'nullable|string|max:255',
            'total_copies' => 'nullable|integer|min:0',
            'author_ids' => 'nullable|array',
            'author_ids.*' => 'exists:authors,id',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id',
        ]);

        $book = Book::create($validated);

        if (isset($validated['author_ids'])) {
            $book->authors()->sync($validated['author_ids']);
        }

        if (isset($validated['category_ids'])) {
            $book->categories()->sync($validated['category_ids']);
        }

        return response()->json($book->load(['publisher', 'authors', 'categories']), 201);
    }

    public function show(Book $book)
    {
        return response()->json($book->load(['publisher', 'authors', 'categories', 'copies']));
    }

    public function update(Request $request, Book $book)
    {
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'isbn' => 'nullable|string|unique:books,isbn,' . $book->id,
            'publisher_id' => 'nullable|exists:publishers,id',
            'published_year' => 'nullable|integer|min:1000|max:' . date('Y'),
            'pages' => 'nullable|integer|min:1',
            'language' => 'nullable|string|max:50',
            'description' => 'nullable|string',
            'cover_url' => 'nullable|string|max:255',
            'total_copies' => 'nullable|integer|min:0',
            'author_ids' => 'nullable|array',
            'author_ids.*' => 'exists:authors,id',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id',
        ]);

        $book->update($validated);

        if (isset($validated['author_ids'])) {
            $book->authors()->sync($validated['author_ids']);
        }

        if (isset($validated['category_ids'])) {
            $book->categories()->sync($validated['category_ids']);
        }

        return response()->json($book->load(['publisher', 'authors', 'categories']));
    }

    public function destroy(Book $book)
    {
        $book->delete();
        return response()->json(['message' => 'Livre supprimé avec succès']);
    }
}
