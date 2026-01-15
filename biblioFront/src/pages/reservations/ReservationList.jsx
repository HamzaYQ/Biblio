import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiCalendar } from 'react-icons/fi';
import Modal from '../../components/common/Modal';

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [formData, setFormData] = useState({
    book_id: '',
    user_id: '',
    reserved_at: new Date().toISOString().split('T')[0],
    expires_at: '',
    status: 'pending',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reservationsRes, usersRes, booksRes] = await Promise.all([
        api.get('/reservations'),
        api.get('/users'),
        api.get('/books'),
      ]);
      setReservations(reservationsRes.data);
      setUsers(usersRes.data);
      setBooks(booksRes.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedReservation) {
        await api.put(`/reservations/${selectedReservation.id}`, formData);
        toast.success('Réservation modifiée avec succès');
      } else {
        await api.post('/reservations', formData);
        toast.success('Réservation ajoutée avec succès');
      }
      fetchData();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'opération');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation?')) {
      try {
        await api.delete(`/reservations/${id}`);
        toast.success('Réservation supprimée avec succès');
        fetchData();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const openModal = (reservation = null) => {
    if (reservation) {
      setSelectedReservation(reservation);
      setFormData({
        book_id: reservation.book_id || '',
        user_id: reservation.user_id || '',
        reserved_at: reservation.reserved_at?.split('T')[0] || '',
        expires_at: reservation.expires_at?.split('T')[0] || '',
        status: reservation.status || 'pending',
      });
    } else {
      setSelectedReservation(null);
      const expiresDate = new Date();
      expiresDate.setDate(expiresDate.getDate() + 7);
      setFormData({
        book_id: '',
        user_id: '',
        reserved_at: new Date().toISOString().split('T')[0],
        expires_at: expiresDate.toISOString().split('T')[0],
        status: 'pending',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedReservation(null);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { class: 'badge-warning', text: 'En attente' },
      fulfilled: { class: 'badge-success', text: 'Satisfait' },
      cancelled: { class: 'badge-error', text: 'Annulé' },
      expired: { class: 'badge-error', text: 'Expiré' },
    };
    return badges[status] || { class: 'badge-primary', text: status };
  };

  const filteredReservations = reservations.filter(reservation => 
    reservation.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reservation.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="page-title">Réservations</h1>
          <p className="page-subtitle">Gérez les réservations de livres</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FiPlus /> Nouvelle réservation
        </button>
      </div>

      {/* Search */}
      <div className="search-bar mb-xl">
        <FiSearch />
        <input
          type="text"
          placeholder="Rechercher une réservation..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      {filteredReservations.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Livre</th>
                <th>Utilisateur</th>
                <th>Date de réservation</th>
                <th>Date d'expiration</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReservations.map((reservation) => {
                const status = getStatusBadge(reservation.status);
                return (
                  <tr key={reservation.id}>
                    <td style={{ fontWeight: 500 }}>
                      {reservation.book?.title || 'Livre inconnu'}
                    </td>
                    <td>
                      {reservation.user?.first_name} {reservation.user?.last_name}
                    </td>
                    <td>{new Date(reservation.reserved_at).toLocaleDateString('fr-FR')}</td>
                    <td>
                      {reservation.expires_at 
                        ? new Date(reservation.expires_at).toLocaleDateString('fr-FR')
                        : '-'}
                    </td>
                    <td>
                      <span className={`badge ${status.class}`}>{status.text}</span>
                    </td>
                    <td>
                      <div className="flex gap-sm">
                        <button 
                          className="btn btn-ghost btn-icon btn-sm"
                          onClick={() => openModal(reservation)}
                          title="Modifier"
                        >
                          <FiEdit2 />
                        </button>
                        <button 
                          className="btn btn-ghost btn-icon btn-sm"
                          onClick={() => handleDelete(reservation.id)}
                          title="Supprimer"
                          style={{ color: 'var(--error)' }}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <FiCalendar />
          <h3>Aucune réservation trouvée</h3>
          <p>Commencez par créer une réservation</p>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <FiPlus /> Nouvelle réservation
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <Modal
          title={selectedReservation ? 'Modifier la réservation' : 'Nouvelle réservation'}
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Livre *</label>
              <select
                className="form-input form-select"
                value={formData.book_id}
                onChange={(e) => setFormData({ ...formData, book_id: e.target.value })}
                required
              >
                <option value="">Sélectionner un livre</option>
                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Utilisateur *</label>
              <select
                className="form-input form-select"
                value={formData.user_id}
                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                required
              >
                <option value="">Sélectionner un utilisateur</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Date de réservation *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.reserved_at}
                  onChange={(e) => setFormData({ ...formData, reserved_at: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date d'expiration</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Statut</label>
              <select
                className="form-input form-select"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="pending">En attente</option>
                <option value="fulfilled">Satisfait</option>
                <option value="cancelled">Annulé</option>
                <option value="expired">Expiré</option>
              </select>
            </div>

            <div className="modal-footer" style={{ margin: '0 -1.5rem -1.5rem', padding: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Annuler
              </button>
              <button type="submit" className="btn btn-primary">
                {selectedReservation ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default ReservationList;
