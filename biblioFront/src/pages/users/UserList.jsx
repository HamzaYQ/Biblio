import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiUsers, FiMail, FiPhone } from 'react-icons/fi';
import Modal from '../../components/common/Modal';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    role: 'member',
    phone: '',
    address: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formData };
      if (selectedUser && !data.password) {
        delete data.password;
      }
      
      if (selectedUser) {
        await api.put(`/users/${selectedUser.id}`, data);
        toast.success('Utilisateur modifié avec succès');
      } else {
        await api.post('/users', data);
        toast.success('Utilisateur ajouté avec succès');
      }
      fetchUsers();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'opération');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur?')) {
      try {
        await api.delete(`/users/${id}`);
        toast.success('Utilisateur supprimé avec succès');
        fetchUsers();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const openModal = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        password: '',
        role: user.role || 'member',
        phone: user.phone || '',
        address: user.address || '',
      });
    } else {
      setSelectedUser(null);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        role: 'member',
        phone: '',
        address: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const getRoleBadge = (role) => {
    const badges = {
      admin: 'badge-error',
      staff: 'badge-warning',
      member: 'badge-primary',
    };
    return badges[role] || 'badge-primary';
  };

  const filteredUsers = users.filter(user => 
    user.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="page-title">Utilisateurs</h1>
          <p className="page-subtitle">Gérez les utilisateurs de la bibliothèque</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FiPlus /> Ajouter un utilisateur
        </button>
      </div>

      {/* Search */}
      <div className="search-bar mb-xl">
        <FiSearch />
        <input
          type="text"
          placeholder="Rechercher un utilisateur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      {filteredUsers.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="flex items-center gap-md">
                      <div className="avatar avatar-sm">
                        {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
                      </div>
                      <div>
                        <p style={{ fontWeight: 500 }}>{user.first_name} {user.last_name}</p>
                        <p className="text-sm text-muted">#{user.membership_number || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-sm">
                      <FiMail className="text-muted" />
                      {user.email}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-sm">
                      <FiPhone className="text-muted" />
                      {user.phone || '-'}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getRoleBadge(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${user.is_active ? 'badge-success' : 'badge-error'}`}>
                      {user.is_active ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-sm">
                      <button 
                        className="btn btn-ghost btn-icon btn-sm"
                        onClick={() => openModal(user)}
                        title="Modifier"
                      >
                        <FiEdit2 />
                      </button>
                      <button 
                        className="btn btn-ghost btn-icon btn-sm"
                        onClick={() => handleDelete(user.id)}
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
          <FiUsers />
          <h3>Aucun utilisateur trouvé</h3>
          <p>Commencez par ajouter des utilisateurs</p>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <FiPlus /> Ajouter un utilisateur
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <Modal
          title={selectedUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Prénom *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Nom *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Mot de passe {selectedUser ? '(laisser vide pour ne pas modifier)' : '*'}
              </label>
              <input
                type="password"
                className="form-input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!selectedUser}
                minLength={selectedUser ? 0 : 8}
              />
            </div>

            <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Rôle</label>
                <select
                  className="form-input form-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                >
                  <option value="member">Membre</option>
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Téléphone</label>
                <input
                  type="tel"
                  className="form-input"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Adresse</label>
              <textarea
                className="form-input form-textarea"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows="2"
              />
            </div>

            <div className="modal-footer" style={{ margin: '0 -1.5rem -1.5rem', padding: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Annuler
              </button>
              <button type="submit" className="btn btn-primary">
                {selectedUser ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default UserList;
