<?php

namespace App\Http\Controllers;

use App\Models\Author;
use Illuminate\Http\Request;

class AuthorController extends Controller
{
    public function index()
    {
        $authors = Author::with('books')->get();
        return response()->json($authors);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'bio' => 'nullable|string',
        ]);

        $author = Author::create($validated);
        return response()->json($author, 201);
    }

    public function show(Author $author)
    {
        return response()->json($author->load('books'));
    }

    public function update(Request $request, Author $author)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'bio' => 'nullable|string',
        ]);

        $author->update($validated);
        return response()->json($author);
    }

    public function destroy(Author $author)
    {
        $author->delete();
        return response()->json(['message' => 'Auteur supprimé avec succès']);
    }
}
