import { NavLink } from "react-router-dom";
import {
  FiHome,
  FiBook,
  FiUsers,
  FiBookOpen,
  FiCalendar,
  FiDollarSign,
  FiTag,
  FiEdit3,
  FiX,
} from "react-icons/fi";

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { to: "/", icon: FiHome, label: "Dashboard", exact: true },
    { to: "/books", icon: FiBook, label: "Livres" },
    { to: "/authors", icon: FiEdit3, label: "Auteurs" },
    { to: "/categories", icon: FiTag, label: "Catégories" },
    { to: "/users", icon: FiUsers, label: "Utilisateurs" },
    { to: "/loans", icon: FiBookOpen, label: "Emprunts" },
    { to: "/reservations", icon: FiCalendar, label: "Réservations" },
    { to: "/fines", icon: FiDollarSign, label: "Amendes" },
  ];

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <FiBook />
          <span>Bibliotique</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section">
          <span className="nav-section-title">Menu Principal</span>
          {navItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              end={item.exact}
              onClick={onClose}
            >
              <item.icon />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>

        <div className="nav-section">
          <span className="nav-section-title">Gestion</span>
          {navItems.slice(5).map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
              onClick={onClose}
            >
              <item.icon />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="sidebar-footer">
        <p className="text-sm text-muted">© 2024 Biblio</p>
      </div>
    </aside>
  );
};

export default Sidebar;
