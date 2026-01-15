import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { 
  FiBook, 
  FiUsers, 
  FiBookOpen, 
  FiCalendar, 
  FiDollarSign,
  FiTrendingUp,
  FiAlertCircle
} from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Vue d'ensemble de votre bibliothèque</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon primary">
            <FiBook />
          </div>
          <div className="stat-value">{stats?.total_books || 0}</div>
          <div className="stat-label">Livres</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon info">
            <FiUsers />
          </div>
          <div className="stat-value">{stats?.total_users || 0}</div>
          <div className="stat-label">Utilisateurs</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon success">
            <FiBookOpen />
          </div>
          <div className="stat-value">{stats?.active_loans || 0}</div>
          <div className="stat-label">Emprunts Actifs</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon warning">
            <FiDollarSign />
          </div>
          <div className="stat-value">{stats?.total_fines_amount || 0} MAD</div>
          <div className="stat-label">Amendes Impayées</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-2" style={{ marginTop: '2rem' }}>
        {/* Recent Loans */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <FiBookOpen style={{ marginRight: '0.5rem' }} />
              Emprunts Récents
            </h3>
            <Link to="/loans" className="btn btn-sm btn-secondary">
              Voir tout
            </Link>
          </div>
          <div className="card-body">
            {stats?.recent_loans?.length > 0 ? (
              <div className="flex flex-col gap-md">
                {stats.recent_loans.map((loan) => (
                  <div key={loan.id} className="flex items-center justify-between" style={{ 
                    padding: '0.75rem',
                    background: 'var(--bg-glass)',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <div>
                      <p style={{ fontWeight: 500 }}>
                        {loan.book_copy?.book?.title || 'Livre inconnu'}
                      </p>
                      <p className="text-sm text-muted">
                        {loan.user?.first_name} {loan.user?.last_name}
                      </p>
                    </div>
                    <span className={`badge ${loan.returned_at ? 'badge-success' : 'badge-warning'}`}>
                      {loan.returned_at ? 'Retourné' : 'En cours'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <FiBookOpen />
                <p>Aucun emprunt récent</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Reservations */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <FiCalendar style={{ marginRight: '0.5rem' }} />
              Réservations Récentes
            </h3>
            <Link to="/reservations" className="btn btn-sm btn-secondary">
              Voir tout
            </Link>
          </div>
          <div className="card-body">
            {stats?.recent_reservations?.length > 0 ? (
              <div className="flex flex-col gap-md">
                {stats.recent_reservations.map((reservation) => (
                  <div key={reservation.id} className="flex items-center justify-between" style={{ 
                    padding: '0.75rem',
                    background: 'var(--bg-glass)',
                    borderRadius: 'var(--radius-md)'
                  }}>
                    <div>
                      <p style={{ fontWeight: 500 }}>
                        {reservation.book?.title || 'Livre inconnu'}
                      </p>
                      <p className="text-sm text-muted">
                        {reservation.user?.first_name} {reservation.user?.last_name}
                      </p>
                    </div>
                    <span className={`badge ${
                      reservation.status === 'pending' ? 'badge-warning' : 
                      reservation.status === 'fulfilled' ? 'badge-success' : 'badge-error'
                    }`}>
                      {reservation.status === 'pending' ? 'En attente' : 
                       reservation.status === 'fulfilled' ? 'Satisfait' : reservation.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state" style={{ padding: '2rem' }}>
                <FiCalendar />
                <p>Aucune réservation récente</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-3" style={{ marginTop: '2rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <FiTrendingUp style={{ fontSize: '2rem', color: 'var(--success)', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats?.total_authors || 0}</div>
          <div className="text-muted">Auteurs</div>
        </div>
        
        <div className="card" style={{ textAlign: 'center' }}>
          <FiCalendar style={{ fontSize: '2rem', color: 'var(--info)', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats?.pending_reservations || 0}</div>
          <div className="text-muted">Réservations en attente</div>
        </div>
        
        <div className="card" style={{ textAlign: 'center' }}>
          <FiAlertCircle style={{ fontSize: '2rem', color: 'var(--warning)', marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats?.unpaid_fines || 0}</div>
          <div className="text-muted">Amendes impayées</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
