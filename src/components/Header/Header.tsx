import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './Header.css';
import { useAuth } from '../../auth/AuthContext';
import logo from '../../MUST images/Universal/logo-white.png';

const Header: React.FC = () => {
  const { user, isLoading, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Debug function to log active state
  const debugActiveState = (isActive: boolean, path: string) => {
    if (isActive) {
      console.log(`Active link detected: ${path}`);
    }
    return `nav-link ${isActive ? 'active' : ''}`;
  };

  if (isLoading) {
    return (
      <header className="header">
        <div className="container header-container">
          <div className="logo">
            <NavLink to="/" className="logo">
              <img src={logo} alt="MUST Logo" className="header-logo" />
              <h1>MUST E-Admission</h1>
            </NavLink>
          </div>
          <div className="header-loading">Loading...</div>
        </div>
      </header>
    );
  }

  return (
    <header className="header">
      <div className="container header-container">
        <div className="logo">
          <NavLink to="/" className="logo">
            <img src={logo} alt="MUST Logo" className="header-logo" />
            <h1>MUST E-Admission</h1>
          </NavLink>
        </div>
        
        <nav>
          <ul>
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => debugActiveState(isActive, 'Home')}
                end
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/programs" 
                className={({ isActive }) => debugActiveState(isActive, 'Programs')}
              >
                Programs
              </NavLink>
            </li>
            {user && (
              <>
                {(() => {
                  const adminStatus = isAdmin();
                  console.log('🔍 HEADER DEBUG - User:', user);
                  console.log('🔍 HEADER DEBUG - isAdmin():', adminStatus);
                  return adminStatus;
                })() ? (
                  <li>
                    <NavLink 
                      to="/admin" 
                      className={({ isActive }) => debugActiveState(isActive, 'Admin')}
                    >
                      Admin Panel
                    </NavLink>
                  </li>
                ) : (
                  <>
                    <li>
                      <NavLink 
                        to="/application" 
                        className={({ isActive }) => debugActiveState(isActive, 'Application')}
                      >
                        Application
                      </NavLink>
                    </li>
                    <li>
                      <NavLink 
                        to="/dashboard" 
                        className={({ isActive }) => debugActiveState(isActive, 'Dashboard')}
                      >
                        Dashboard
                      </NavLink>
                    </li>

                  </>
                )}
              </>
            )}
            <li>
              <NavLink 
                to="/contact" 
                className={({ isActive }) => debugActiveState(isActive, 'Contact')}
              >
                Contact
              </NavLink>
            </li>
          </ul>
        </nav>
        
        <div className="auth-buttons">
          {!user ? (
            <>
              <NavLink 
                to="/login" 
                className={({ isActive }) => `btn btn-login ${isActive ? 'active' : ''}`}
              >
                <i className="fas fa-sign-in-alt"></i> Log in
              </NavLink>
              <NavLink 
                to="/signup" 
                className={({ isActive }) => `btn btn-signup ${isActive ? 'active' : ''}`}
              >
                <i className="fas fa-user-plus"></i> Sign up
              </NavLink>
            </>
          ) : (
            <button onClick={() => navigate('/logout')} className="btn btn-login">
              <i className="fas fa-sign-out-alt"></i> Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header; 