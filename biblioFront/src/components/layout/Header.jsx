import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    toast.success('Déconnexion réussie');
    navigate('/login');
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  return (
    <header className="header">
      <div className="header-title">
        <h1>Bienvenue, {user?.first_name} </h1>
      </div>
      
      <div className="header-actions">
        <div className="flex items-center gap-md">
          <div className="avatar">
            {user ? getInitials(user.first_name, user.last_name) : <FiUser />}
          </div>
          <div className="flex flex-col">
            <span className="text-sm" style={{ fontWeight: 500 }}>
              {user?.first_name} {user?.last_name}
            </span>
            <span className="text-sm text-muted">{user?.role}</span>
          </div>
        </div>
        
        <button 
          className="btn btn-ghost btn-icon" 
          onClick={handleLogout}
          title="Déconnexion"
        >
          <FiLogOut />
        </button>
      </div>
    </header>
  );
};

export default Header;
