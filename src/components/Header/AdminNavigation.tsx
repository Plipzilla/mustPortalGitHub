import React from 'react';
import './AdminNavigation.css';

interface AdminNavigationProps {
  activeSection: 'overview' | 'applications' | 'users' | 'reports' | 'review' | 'payments' | 'communications' | 'settings' | 'audit';
  onSectionChange: (section: 'overview' | 'applications' | 'users' | 'reports' | 'review' | 'payments' | 'communications' | 'settings' | 'audit') => void;
}

const AdminNavigation: React.FC<AdminNavigationProps> = ({ activeSection, onSectionChange }) => {
  const handleSectionClick = (section: 'overview' | 'applications' | 'users' | 'reports' | 'review' | 'payments' | 'communications' | 'settings' | 'audit') => {
    onSectionChange(section);
  };

  return (
    <nav className="admin-navigation">
      <div className="admin-nav-container">
        <ul className="admin-nav-list">
          <li>
            <button 
              className={`admin-nav-link ${activeSection === 'overview' ? 'active' : ''}`}
              onClick={() => handleSectionClick('overview')}
            >
              <i className="fas fa-chart-pie"></i>
              <span>System Overview</span>
            </button>
          </li>
          <li>
            <button 
              className={`admin-nav-link ${activeSection === 'applications' ? 'active' : ''}`}
              onClick={() => handleSectionClick('applications')}
            >
              <i className="fas fa-clipboard-list"></i>
              <span>All Applications</span>
              <span className="nav-badge">View All</span>
            </button>
          </li>
          <li>
            <button 
              className={`admin-nav-link ${activeSection === 'users' ? 'active' : ''}`}
              onClick={() => handleSectionClick('users')}
            >
              <i className="fas fa-users-cog"></i>
              <span>User Management</span>
              <span className="nav-badge">Manage Users</span>
            </button>
          </li>
          <li>
            <button 
              className={`admin-nav-link ${activeSection === 'review' ? 'active' : ''}`}
              onClick={() => handleSectionClick('review')}
            >
              <i className="fas fa-clipboard-check"></i>
              <span>Review Verified</span>
              <span className="nav-badge">Accept/Deny</span>
            </button>
          </li>
          <li>
            <button 
              className={`admin-nav-link ${activeSection === 'payments' ? 'active' : ''}`}
              onClick={() => handleSectionClick('payments')}
            >
              <i className="fas fa-credit-card"></i>
              <span>Payment Management</span>
              <span className="nav-badge">Track Fees</span>
            </button>
          </li>
          <li>
            <button 
              className={`admin-nav-link ${activeSection === 'communications' ? 'active' : ''}`}
              onClick={() => handleSectionClick('communications')}
            >
              <i className="fas fa-envelope"></i>
              <span>Communications</span>
              <span className="nav-badge">Email/SMS</span>
            </button>
          </li>
          <li>
            <button 
              className={`admin-nav-link ${activeSection === 'reports' ? 'active' : ''}`}
              onClick={() => handleSectionClick('reports')}
            >
              <i className="fas fa-file-chart-line"></i>
              <span>Reports & Analytics</span>
              <span className="nav-badge">Export Data</span>
            </button>
          </li>
          <li>
            <button 
              className={`admin-nav-link ${activeSection === 'audit' ? 'active' : ''}`}
              onClick={() => handleSectionClick('audit')}
            >
              <i className="fas fa-history"></i>
              <span>Audit Logs</span>
              <span className="nav-badge">Activity Track</span>
            </button>
          </li>
          <li>
            <button 
              className={`admin-nav-link ${activeSection === 'settings' ? 'active' : ''}`}
              onClick={() => handleSectionClick('settings')}
            >
              <i className="fas fa-cog"></i>
              <span>System Settings</span>
              <span className="nav-badge">Configure</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavigation; 