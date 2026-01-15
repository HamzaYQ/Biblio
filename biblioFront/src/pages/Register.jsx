import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiUser, FiBook } from 'react-icons/fi';

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.password_confirmation) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    
    setLoading(true);

    try {
      await register(formData);
      toast.success('Inscription réussie!');
      navigate('/');
    } catch (error) {
      const message = error.response?.data?.message || 'Erreur lors de l\'inscription';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <FiBook style={{ fontSize: '3rem', color: 'var(--primary-500)' }} />
          <h1>Biblio</h1>
          <p className="text-muted">Créez votre compte</p>
        </div>
        
        <h2 className="auth-title">Inscription</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Prénom</label>
              <div style={{ position: 'relative' }}>
                <FiUser style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }} />
                <input
                  type="text"
                  name="first_name"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="Jean"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Nom</label>
              <div style={{ position: 'relative' }}>
                <FiUser style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }} />
                <input
                  type="text"
                  name="last_name"
                  className="form-input"
                  style={{ paddingLeft: '40px' }}
                  placeholder="Dupont"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <div style={{ position: 'relative' }}>
              <FiMail style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                type="email"
                name="email"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                type="password"
                name="password"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={8}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Confirmer le mot de passe</label>
            <div style={{ position: 'relative' }}>
              <FiLock style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                type="password"
                name="password_confirmation"
                className="form-input"
                style={{ paddingLeft: '40px' }}
                placeholder="••••••••"
                value={formData.password_confirmation}
                onChange={handleChange}
                required
                minLength={8}
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-lg" 
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Inscription...' : 'S\'inscrire'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>
            Déjà un compte?{' '}
            <Link to="/login">Se connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
