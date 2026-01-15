import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiDollarSign, FiCheck } from 'react-icons/fi';
import Modal from '../../components/common/Modal';

const FineList = () => {
  const [fines, setFines] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedFine, setSelectedFine] = useState(null);
  const [formData, setFormData] = useState({
    user_id: '',
    amount: '',
    reason: '',
    issued_at: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [finesRes, usersRes] = await Promise.all([
        api.get('/fines'),
        api.get('/users'),
      ]);
      setFines(finesRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedFine) {
        await api.put(`/fines/${selectedFine.id}`, formData);
        toast.success('Amende modifiée avec succès');
      } else {
        await api.post('/fines', formData);
        toast.success('Amende ajoutée avec succès');
      }
      fetchData();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'opération');
    }
  };

  const handlePay = async (id) => {
    if (window.confirm('Confirmer le paiement de cette amende?')) {
      try {
        await api.post(`/fines/${id}/pay`, { payment_method: 'cash' });
        toast.success('Amende payée avec succès');
        fetchData();
      } catch (error) {
        toast.error('Erreur lors du paiement');
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette amende?')) {
      try {
        await api.delete(`/fines/${id}`);
        toast.success('Amende supprimée avec succès');
        fetchData();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const openModal = (fine = null) => {
    if (fine) {
      setSelectedFine(fine);
      setFormData({
        user_id: fine.user_id || '',
        amount: fine.amount || '',
        reason: fine.reason || '',
        issued_at: fine.issued_at?.split('T')[0] || '',
      });
    } else {
      setSelectedFine(null);
      setFormData({
        user_id: '',
        amount: '',
        reason: '',
        issued_at: new Date().toISOString().split('T')[0],
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFine(null);
  };

  const filteredFines = fines.filter(fine => 
    fine.user?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fine.user?.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    fine.reason?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalUnpaid = fines.filter(f => !f.paid).reduce((sum, f) => sum + parseFloat(f.amount || 0), 0);

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
          <h1 className="page-title">Amendes</h1>
          <p className="page-subtitle">
            Gérez les amendes - Total impayé: <strong style={{ color: 'var(--warning)' }}>{totalUnpaid.toFixed(2)} MAD</strong>
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FiPlus /> Nouvelle amende
        </button>
      </div>

      {/* Search */}
      <div className="search-bar mb-xl">
        <FiSearch />
        <input
          type="text"
          placeholder="Rechercher une amende..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      {filteredFines.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Montant</th>
                <th>Raison</th>
                <th>Date d'émission</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFines.map((fine) => (
                <tr key={fine.id}>
                  <td style={{ fontWeight: 500 }}>
                    {fine.user?.first_name} {fine.user?.last_name}
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: 'var(--warning)' }}>
                      {parseFloat(fine.amount).toFixed(2)} MAD
                    </span>
                  </td>
                  <td className="text-muted">
                    {fine.reason || '-'}
                  </td>
                  <td>{new Date(fine.issued_at).toLocaleDateString('fr-FR')}</td>
                  <td>
                    <span className={`badge ${fine.paid ? 'badge-success' : 'badge-error'}`}>
                      {fine.paid ? 'Payé' : 'Non payé'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-sm">
                      {!fine.paid && (
                        <button 
                          className="btn btn-success btn-sm"
                          onClick={() => handlePay(fine.id)}
                          title="Marquer comme payé"
                        >
                          <FiCheck /> Payer
                        </button>
                      )}
                      <button 
                        className="btn btn-ghost btn-icon btn-sm"
                        onClick={() => openModal(fine)}
                        title="Modifier"
                      >
                        <FiEdit2 />
                      </button>
                      <button 
                        className="btn btn-ghost btn-icon btn-sm"
                        onClick={() => handleDelete(fine.id)}
                        title="Supprimer"
                        style={{ color: 'var(--error)' }}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <FiDollarSign />
          <h3>Aucune amende trouvée</h3>
          <p>Aucune amende n'a été enregistrée</p>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <FiPlus /> Nouvelle amende
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <Modal
          title={selectedFine ? 'Modifier l\'amende' : 'Nouvelle amende'}
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit}>
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
                <label className="form-label">Montant (MAD) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="form-input"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date d'émission *</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.issued_at}
                  onChange={(e) => setFormData({ ...formData, issued_at: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Raison</label>
              <textarea
                className="form-input form-textarea"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                rows="3"
                placeholder="Ex: Retard de 7 jours sur le livre..."
              />
            </div>

            <div className="modal-footer" style={{ margin: '0 -1.5rem -1.5rem', padding: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Annuler
              </button>
              <button type="submit" className="btn btn-primary">
                {selectedFine ? 'Modifier' : 'Créer'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default FineList;
