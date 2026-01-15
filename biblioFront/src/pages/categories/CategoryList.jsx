import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiTag } from 'react-icons/fi';
import Modal from '../../components/common/Modal';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des catégories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCategory) {
        await api.put(`/categories/${selectedCategory.id}`, formData);
        toast.success('Catégorie modifiée avec succès');
      } else {
        await api.post('/categories', formData);
        toast.success('Catégorie ajoutée avec succès');
      }
      fetchCategories();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'opération');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie?')) {
      try {
        await api.delete(`/categories/${id}`);
        toast.success('Catégorie supprimée avec succès');
        fetchCategories();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const openModal = (category = null) => {
    if (category) {
      setSelectedCategory(category);
      setFormData({
        name: category.name || '',
        description: category.description || '',
      });
    } else {
      setSelectedCategory(null);
      setFormData({ name: '', description: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
  };

  const filteredCategories = categories.filter(category => 
    category.name?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="page-title">Catégories</h1>
          <p className="page-subtitle">Gérez les catégories de livres</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FiPlus /> Ajouter une catégorie
        </button>
      </div>

      {/* Search */}
      <div className="search-bar mb-xl">
        <FiSearch />
        <input
          type="text"
          placeholder="Rechercher une catégorie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Grid */}
      {filteredCategories.length > 0 ? (
        <div className="grid grid-cols-3">
          {filteredCategories.map((category) => (
            <div key={category.id} className="card">
              <div className="flex items-center justify-between mb-md">
                <div className="flex items-center gap-md">
                  <div className="stat-icon primary" style={{ width: '40px', height: '40px' }}>
                    <FiTag />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>{category.name}</h3>
                    <span className="badge badge-primary">{category.books?.length || 0} livres</span>
                  </div>
                </div>
                <div className="flex gap-sm">
                  <button 
                    className="btn btn-ghost btn-icon btn-sm"
                    onClick={() => openModal(category)}
                  >
                    <FiEdit2 />
                  </button>
                  <button 
                    className="btn btn-ghost btn-icon btn-sm"
                    onClick={() => handleDelete(category.id)}
                    style={{ color: 'var(--error)' }}
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
              <p className="text-sm text-muted">
                {category.description || 'Aucune description'}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <FiTag />
          <h3>Aucune catégorie trouvée</h3>
          <p>Commencez par ajouter des catégories</p>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <FiPlus /> Ajouter une catégorie
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <Modal
          title={selectedCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
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
              <label className="form-label">Description</label>
              <textarea
                className="form-input form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
              />
            </div>

            <div className="modal-footer" style={{ margin: '0 -1.5rem -1.5rem', padding: '1.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Annuler
              </button>
              <button type="submit" className="btn btn-primary">
                {selectedCategory ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CategoryList;
