<?php

namespace App\Http\Controllers;

use App\Models\Publisher;
use Illuminate\Http\Request;

class PublisherController extends Controller
{
    public function index()
    {
        $publishers = Publisher::with('books')->get();
        return response()->json($publishers);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
        ]);

        $publisher = Publisher::create($validated);
        return response()->json($publisher, 201);
    }

    public function show(Publisher $publisher)
    {
        return response()->json($publisher->load('books'));
    }

    public function update(Request $request, Publisher $publisher)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'address' => 'nullable|string',
        ]);

        $publisher->update($validated);
        return response()->json($publisher);
    }

    public function destroy(Publisher $publisher)
    {
        $publisher->delete();
        return response()->json(['message' => 'Éditeur supprimé avec succès']);
    }
}
