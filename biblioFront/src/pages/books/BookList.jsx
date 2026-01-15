import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiBook, FiEye } from 'react-icons/fi';
import Modal from '../../components/common/Modal';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    isbn: '',
    published_year: '',
    pages: '',
    language: 'Français',
    description: '',
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/books');
      setBooks(response.data);
    } catch (error) {
      toast.error('Erreur lors du chargement des livres');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedBook) {
        await api.put(`/books/${selectedBook.id}`, formData);
        toast.success('Livre modifié avec succès');
      } else {
        await api.post('/books', formData);
        toast.success('Livre ajouté avec succès');
      }
      fetchBooks();
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erreur lors de l\'opération');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce livre?')) {
      try {
        await api.delete(`/books/${id}`);
        toast.success('Livre supprimé avec succès');
        fetchBooks();
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const openModal = (book = null) => {
    if (book) {
      setSelectedBook(book);
      setFormData({
        title: book.title || '',
        isbn: book.isbn || '',
        published_year: book.published_year || '',
        pages: book.pages || '',
        language: book.language || 'Français',
        description: book.description || '',
      });
    } else {
      setSelectedBook(null);
      setFormData({
        title: '',
        isbn: '',
        published_year: '',
        pages: '',
        language: 'Français',
        description: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBook(null);
  };

  const filteredBooks = books.filter(book => 
    book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn?.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h1 className="page-title">Livres</h1>
          <p className="page-subtitle">Gérez votre collection de livres</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          <FiPlus /> Ajouter un livre
        </button>
      </div>

      {/* Search */}
      <div className="search-bar mb-xl">
        <FiSearch />
        <input
          type="text"
          placeholder="Rechercher un livre..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <div className="book-grid">
          {filteredBooks.map((book) => (
            <div key={book.id} className="book-card">
              <div className="book-cover">
                {book.cover_url ? (
                  <img src={book.cover_url} alt={book.title} />
                ) : (
                  <div className="book-cover-placeholder">
                    <FiBook />
                  </div>
                )}
              </div>
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">
                  {book.authors?.map(a => a.name).join(', ') || 'Auteur inconnu'}
                </p>
                <div className="book-meta">
                  <span className="badge badge-primary">
                    {book.published_year || 'N/A'}
                  </span>
                  <div className="flex gap-sm">
                    <button 
                      className="btn btn-ghost btn-icon btn-sm"
                      onClick={() => openModal(book)}
                      title="Modifier"
                    >
                      <FiEdit2 />
                    </button>
                    <button 
                      className="btn btn-ghost btn-icon btn-sm"
                      onClick={() => handleDelete(book.id)}
                      title="Supprimer"
                      style={{ color: 'var(--error)' }}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <FiBook />
          <h3>Aucun livre trouvé</h3>
          <p>Commencez par ajouter des livres à votre collection</p>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <FiPlus /> Ajouter un livre
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <Modal
          title={selectedBook ? 'Modifier le livre' : 'Ajouter un livre'}
          onClose={closeModal}
        >
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Titre *</label>
              <input
                type="text"
                className="form-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">ISBN</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Année de publication</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.published_year}
                  onChange={(e) => setFormData({ ...formData, published_year: e.target.value })}
                  min="1000"
                  max={new Date().getFullYear()}
                />
              </div>
            </div>

            <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">Nombre de pages</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.pages}
                  onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                  min="1"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Langue</label>
                <select
                  className="form-input form-select"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                >
                  <option value="Français">Français</option>
                  <option value="Anglais">Anglais</option>
                  <option value="Arabe">Arabe</option>
                  <option value="Espagnol">Espagnol</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
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
                {selectedBook ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default BookList;
