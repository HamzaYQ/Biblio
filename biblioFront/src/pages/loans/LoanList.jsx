import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiBookOpen, FiCheck } from 'react-icons/fi';
import Modal from '../../components/common/Modal';

const LoanList = () => {
  const [loans, setLoans] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookCopies, setBookCopies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [formData, setFormData] = useState({
    book_copy_id: '',
    user_id: '',
    loaned_at: new Date().toISOString().split('T')[0],
    due_at: '',
    status: 'active',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [loansRes, usersRes, copiesRes] = await Promise.all([
        api.get('/loans'),
        api.get('/users'),
        api.get('/book-copies'),
      ]);
      setLoans(loansRes.data);
      setUsers(usersRes.data);
      setBookCopies(copiesRes.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedLoan) {
        await api.put(`/loans/${selectedLoan.id}`, formData);
        toast.success('Emprunt modifié avec succès');
      } else {
        await api.post('/loans', formData);
        toast.success('Emprunt ajouté avec succès');
      }
      fetchData();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'opération');
    }
  };

  const handleReturn = async (id) => {
    if (window.confirm('Confirmer le retour de ce livre?')) {
      try {
        await api.post(`/loans/${id}/return`);
        toast.success('Livre retourné avec succès');
        fetchData();
      } catch (error) {
        toast.error('Erreur lors du retour');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet emprunt?')) {
      try {
        await api.delete(`/loans/${id}`);
        toast.success('Emprunt supprimé avec succès');
        fetchData();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const openModal = (loan = null) => {
    if (loan) {
      setSelectedLoan(loan);
      setFormData({
        book_copy_id: loan.book_copy_id || '',
        user_id: loan.user_id || '',
        loaned_at: loan.loaned_at?.split('T')[0] || '',
        due_at: loan.due_at?.split('T')[0] || '',
        status: loan.status || 'active',
      });
    } else {
      setSelectedLoan(null);
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);
      setFormData({
        book_copy_id: '',
        user_id: '',
        loaned_at: new Date().toISOString().split('T')[0],
        due_at: dueDate.toISOString().split('T')[0],
        status: 'active',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedLoan(null);
  };

  const getStatusBadge = (loan) => {
    if (loan.returned_at) return { class: 'badge-success', text: 'Retourné' };
    if (new Date(loan.due_at) < new Date()) return { class: 'badge-error', text: 'En retard' };
    return { class: 'badge-warning', text: 'En cours' };
  };

  const filteredLoans = loans.filter(loan => 
    loan.book_copy?.book?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    loan.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="page-title">Emprunts</h1>
          <p className="page-subtitle">Gérez les emprunts de livres</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FiPlus /> Nouvel emprunt
        </button>
      </div>

      {/* Search */}
      <div className="search-bar mb-xl">
        <FiSearch />
        <input
          type="text"
          placeholder="Rechercher un emprunt..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      {filteredLoans.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Livre</th>
                <th>Emprunteur</th>
                <th>Date d'emprunt</th>
                <th>Date de retour prévue</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLoans.map((loan) => {
                const status = getStatusBadge(loan);
                return (
                  <tr key={loan.id}>
                    <td style={{ fontWeight: 500 }}>
                      {loan.book_copy?.book?.title || 'Livre inconnu'}
                    </td>
                    <td>
                      {loan.user?.first_name} {loan.user?.last_name}
                    </td>
                    <td>{new Date(loan.loaned_at).toLocaleDateString('fr-FR')}</td>
                    <td>{new Date(loan.due_at).toLocaleDateString('fr-FR')}</td>
                    <td>
                      <span className={`badge ${status.class}`}>{status.text}</span>
                    </td>
                    <td>
                      <div className="flex gap-sm">
                        {!loan.returned_at && (
                          <button 
                            className="btn btn-success btn-sm"
                            onClick={() => handleReturn(loan.id)}
                            title="Marquer comme retourné"
                          >
                            <FiCheck /> Retourner
                          </button>
                        )}
                        <button 
                          className="btn btn-ghost btn-icon btn-sm"
                          onClick={() => openModal(loan)}
                          title="Modifier"
                        >
                          <FiEdit2 />
                        </button>
                        <button 
                          className="btn btn-ghost btn-icon btn-sm"
                          onClick={() => handleDelete(loan.id)}
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
          <FiBookOpen />
          <h3>Aucun emprunt trouvé</h3>
          <p>Commencez par créer un emprunt</p>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <FiPlus /> Nouvel emprunt
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <Modal
          title={selectedLoan ? 'Modifier l\'emprunt' : 'Nouvel emprunt'}
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Exemplaire du livre *</label>
              <select
                className="form-input form-select"
                value={formData.book_copy_id}
                onChange={(e) => setFormData({ ...formData, book_copy_id: e.target.value })}
                required
              >
                <option value="">Sélectionner un exemplaire</option>
                {bookCopies.map((copy) => (
                  <option key={copy.id} value={copy.id}>
                    {copy.book?.title} - {copy.barcode || `#${copy.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Emprunteur *</label>
              <select
                className="form-input form-select"
                value={formData.user_id}
                onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
                required
              >
                <option value="">Sélectionner un utilisateur</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.first_name} {user.last_name} - {user.email}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Date d'emprunt *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.loaned_at}
                  onChange={(e) => setFormData({ ...formData, loaned_at: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date de retour prévue *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.due_at}
                  onChange={(e) => setFormData({ ...formData, due_at: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="modal-footer" style={{ margin: '0 -1.5rem -1.5rem', padding: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Annuler
              </button>
              <button type="submit" className="btn btn-primary">
                {selectedLoan ? 'Modifier' : 'Créer l\'emprunt'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default LoanList;
