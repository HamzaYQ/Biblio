<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PublisherController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\LoanController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\FineController;
use App\Http\Controllers\BookCopyController;
use App\Http\Controllers\DashboardController;

// Authentication routes (public)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public routes
Route::get('/books', [BookController::class, 'index']);
Route::get('/books/{book}', [BookController::class, 'show']);
Route::get('/authors', [AuthorController::class, 'index']);
Route::get('/authors/{author}', [AuthorController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);
Route::get('/publishers', [PublisherController::class, 'index']);
Route::get('/publishers/{publisher}', [PublisherController::class, 'show']);
Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Books CRUD
    Route::post('/books', [BookController::class, 'store']);
    Route::put('/books/{book}', [BookController::class, 'update']);
    Route::delete('/books/{book}', [BookController::class, 'destroy']);

    // Authors CRUD
    Route::post('/authors', [AuthorController::class, 'store']);
    Route::put('/authors/{author}', [AuthorController::class, 'update']);
    Route::delete('/authors/{author}', [AuthorController::class, 'destroy']);

    // Categories CRUD
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{category}', [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

    // Publishers CRUD
    Route::post('/publishers', [PublisherController::class, 'store']);
    Route::put('/publishers/{publisher}', [PublisherController::class, 'update']);
    Route::delete('/publishers/{publisher}', [PublisherController::class, 'destroy']);

    // Users CRUD
    Route::apiResource('users', UserController::class);

    // Loans CRUD
    Route::apiResource('loans', LoanController::class);
    Route::post('/loans/{loan}/return', [LoanController::class, 'returnBook']);

    // Reservations CRUD
    Route::apiResource('reservations', ReservationController::class);

    // Fines CRUD
    Route::apiResource('fines', FineController::class);
    Route::post('/fines/{fine}/pay', [FineController::class, 'pay']);

    // Book Copies CRUD
    Route::apiResource('book-copies', BookCopyController::class);
});

