import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { FiMenu } from 'react-icons/fi';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="main-content">
        <Header />
        <main>
          <Outlet />
        </main>
      </div>
      
      <button 
        className="mobile-menu-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <FiMenu />
      </button>
    </div>
  );
};

export default Layout;
