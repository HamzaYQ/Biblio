<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\User;
use App\Models\Loan;
use App\Models\Reservation;
use App\Models\Fine;
use App\Models\Author;
use App\Models\Category;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats()
    {
        $stats = [
            'total_books' => Book::count(),
            'total_users' => User::count(),
            'total_authors' => Author::count(),
            'total_categories' => Category::count(),
            'active_loans' => Loan::whereNull('returned_at')->count(),
            'pending_reservations' => Reservation::where('status', 'pending')->count(),
            'unpaid_fines' => Fine::where('paid', false)->count(),
            'total_fines_amount' => Fine::where('paid', false)->sum('amount'),
            'recent_loans' => Loan::with(['bookCopy.book', 'user'])
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get(),
            'recent_reservations' => Reservation::with(['book', 'user'])
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get(),
        ];

        return response()->json($stats);
    }
}
