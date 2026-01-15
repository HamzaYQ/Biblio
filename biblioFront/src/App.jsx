import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BookList from './pages/books/BookList';
import BookForm from './pages/books/BookForm';
import AuthorList from './pages/authors/AuthorList';
import CategoryList from './pages/categories/CategoryList';
import UserList from './pages/users/UserList';
import LoanList from './pages/loans/LoanList';
import ReservationList from './pages/reservations/ReservationList';
import FineList from './pages/fines/FineList';

// Component de protection des routes
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Routes protégées */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="books" element={<BookList />} />
        <Route path="books/new" element={<BookForm />} />
        <Route path="books/:id/edit" element={<BookForm />} />
        <Route path="authors" element={<AuthorList />} />
        <Route path="categories" element={<CategoryList />} />
        <Route path="users" element={<UserList />} />
        <Route path="loans" element={<LoanList />} />
        <Route path="reservations" element={<ReservationList />} />
        <Route path="fines" element={<FineList />} />
      </Route>
      
      {/* Redirection par défaut */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
