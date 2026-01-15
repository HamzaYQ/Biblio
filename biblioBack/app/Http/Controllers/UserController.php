<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with(['loans', 'reservations', 'fines'])->get();
        return response()->json($users);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'nullable|in:member,staff,admin',
            'membership_number' => 'nullable|string|unique:users',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'membership_start' => 'nullable|date',
            'membership_end' => 'nullable|date',
            'is_active' => 'nullable|boolean',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $user = User::create($validated);
        return response()->json($user, 201);
    }

    public function show(User $user)
    {
        return response()->json($user->load(['loans', 'reservations', 'fines']));
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'first_name' => 'sometimes|required|string|max:255',
            'last_name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'role' => 'nullable|in:member,staff,admin',
            'membership_number' => 'nullable|string|unique:users,membership_number,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'membership_start' => 'nullable|date',
            'membership_end' => 'nullable|date',
            'is_active' => 'nullable|boolean',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);
        return response()->json($user);
    }

    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'Utilisateur supprimé avec succès']);
    }
}
