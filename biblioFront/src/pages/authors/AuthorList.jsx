import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiEdit3 } from 'react-icons/fi';
import Modal from '../../components/common/Modal';

const AuthorList = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
  });

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await api.get('/authors');
      setAuthors(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des auteurs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedAuthor) {
        await api.put(`/authors/${selectedAuthor.id}`, formData);
        toast.success('Auteur modifié avec succès');
      } else {
        await api.post('/authors', formData);
        toast.success('Auteur ajouté avec succès');
      }
      fetchAuthors();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'opération');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet auteur?')) {
      try {
        await api.delete(`/authors/${id}`);
        toast.success('Auteur supprimé avec succès');
        fetchAuthors();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const openModal = (author = null) => {
    if (author) {
      setSelectedAuthor(author);
      setFormData({
        name: author.name || '',
        bio: author.bio || '',
      });
    } else {
      setSelectedAuthor(null);
      setFormData({ name: '', bio: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAuthor(null);
  };

  const filteredAuthors = authors.filter(author => 
    author.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="page-title">Auteurs</h1>
          <p className="page-subtitle">Gérez les auteurs de votre bibliothèque</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FiPlus /> Ajouter un auteur
        </button>
      </div>

      {/* Search */}
      <div className="search-bar mb-xl">
        <FiSearch />
        <input
          type="text"
          placeholder="Rechercher un auteur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      {filteredAuthors.length > 0 ? (
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Biographie</th>
                <th>Livres</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAuthors.map((author) => (
                <tr key={author.id}>
                  <td style={{ fontWeight: 500 }}>{author.name}</td>
                  <td className="text-muted">
                    {author.bio ? (author.bio.length > 100 ? author.bio.substring(0, 100) + '...' : author.bio) : '-'}
                  </td>
                  <td>
                    <span className="badge badge-primary">{author.books?.length || 0}</span>
                  </td>
                  <td>
                    <div className="flex gap-sm">
                      <button 
                        className="btn btn-ghost btn-icon btn-sm"
                        onClick={() => openModal(author)}
                        title="Modifier"
                      >
                        <FiEdit2 />
                      </button>
                      <button 
                        className="btn btn-ghost btn-icon btn-sm"
                        onClick={() => handleDelete(author.id)}
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
          <FiEdit3 />
          <h3>Aucun auteur trouvé</h3>
          <p>Commencez par ajouter des auteurs</p>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <FiPlus /> Ajouter un auteur
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <Modal
          title={selectedAuthor ? 'Modifier l\'auteur' : 'Ajouter un auteur'}
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nom *</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Biographie</label>
              <textarea
                className="form-input form-textarea"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows="4"
              />
            </div>

            <div className="modal-footer" style={{ margin: '0 -1.5rem -1.5rem', padding: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Annuler
              </button>
              <button type="submit" className="btn btn-primary">
                {selectedAuthor ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default AuthorList;
