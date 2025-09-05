import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './AdminHeader.css';
import { useAuth } from '../../auth/AuthContext';
import logo from '../../MUST images/Universal/logo-white.png';

const AdminHeader: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="admin-header-nav">
      <div className="admin-header-container">
        {/* Admin Logo Section */}
        <div className="admin-logo">
          <NavLink to="/admin" className="admin-logo-link">
            <img src={logo} alt="MUST Logo" className="admin-header-logo" />
            <div className="admin-logo-text">
              <h1>MUST Admin Portal</h1>
              <span>System Administration</span>
            </div>
          </NavLink>
        </div>
        
        {/* Admin User Actions */}
        <div className="admin-user-section">
          <div className="admin-user-info">
            <span className="admin-user-name">{user?.name}</span>
          </div>
          <div className="admin-actions">
            <NavLink to="/" className="admin-action-btn view-site">
              <i className="fas fa-external-link-alt"></i>
              <span>View Site</span>
            </NavLink>
            <button onClick={handleLogout} className="admin-action-btn logout">
              <i className="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader; 