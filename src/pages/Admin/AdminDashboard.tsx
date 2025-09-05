import React, { useEffect, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import axios from 'axios';
import UserManagement from './UserManagement';
import ApplicationReview from './ApplicationReview';
import PaymentManagement from './PaymentManagement';
import AdminHeader from '../../components/Header/AdminHeader';
import AdminNavigation from '../../components/Header/AdminNavigation';
import './AdminDashboard.css';

// Create dedicated axios instance for Admin API
const adminApi = axios.create({
  baseURL: 'http://localhost:8003/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Add auth token to admin requests
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface DashboardStats {
  total_applications: number;
  pending_review: number;
  accepted: number;
  rejected: number;
  total_users: number;
  total_documents: number;
  total_payments: number;
  total_revenue: number;
}

interface Application {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  status: string;
  submitted_at: string;
  program_type: string;
  decision_date?: string;
  review_comments?: string;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<'overview' | 'applications' | 'users' | 'reports' | 'review' | 'payments' | 'communications' | 'settings' | 'audit'>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.removeItem('admin_login_intent');
    loadOverviewData();
  }, []);

  const handleSectionChange = (section: 'overview' | 'applications' | 'users' | 'reports' | 'review' | 'payments' | 'communications' | 'settings' | 'audit') => {
    setActiveSection(section);
    setError('');
    
    if (section === 'applications') {
      loadApplications();
    } else if (section === 'overview') {
      loadOverviewData();
    }
  };

  const loadOverviewData = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get('/admin/dashboard');
      
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get('/admin/applications');
      
      if (response.data.success) {
        setApplications(response.data.data.data || []);
      }
    } catch (error) {
      console.error('Error loading applications:', error);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId: number, status: string, comments: string = '') => {
    try {
      await adminApi.put(`/admin/applications/${applicationId}/status`, {
        status,
        comments
      });
      
      // Reload applications to show updated status
      loadApplications();
      loadOverviewData(); // Also reload stats
      
    } catch (error) {
      console.error('Error updating application:', error);
      setError('Failed to update application status');
    }
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="admin-content-section">
          <div className="error-alert">
            <i className="fas fa-exclamation-triangle"></i>
            {error}
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case 'overview':
        return (
          <div className="admin-content-section">
            <div className="admin-section-header">
              <h2>
                <i className="fas fa-chart-pie"></i>
                System Overview
                <span className="status-badge">
                  <span className="status-dot"></span>
                  System Online
                </span>
              </h2>
              <p>Monitor system performance and key metrics</p>
            </div>
            
            {loading ? (
              <div className="loading-state">Loading dashboard statistics...</div>
            ) : (
              <div className="admin-cards-grid">
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3>Total Applications</h3>
                    <i className="fas fa-file-alt"></i>
                  </div>
                  <div className="admin-card-value">{stats?.total_applications || 0}</div>
                  <div className="admin-card-change neutral">All time submissions</div>
                </div>
                
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3>Pending Review</h3>
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="admin-card-value">{stats?.pending_review || 0}</div>
                  <div className="admin-card-change neutral">
                    {(stats?.pending_review || 0) > 0 ? 'Requires attention' : 'All caught up'}
                  </div>
                </div>
                
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3>Approved</h3>
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="admin-card-value">{stats?.accepted || 0}</div>
                  <div className="admin-card-change positive">Applications approved</div>
                </div>
                
                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3>Rejected</h3>
                    <i className="fas fa-times-circle"></i>
                  </div>
                  <div className="admin-card-value">{stats?.rejected || 0}</div>
                  <div className="admin-card-change negative">Applications rejected</div>
                </div>

                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3>Total Users</h3>
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="admin-card-value">{stats?.total_users || 0}</div>
                  <div className="admin-card-change neutral">Registered users</div>
                </div>

                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3>Total Documents</h3>
                    <i className="fas fa-file-alt"></i>
                  </div>
                  <div className="admin-card-value">{stats?.total_documents || 0}</div>
                  <div className="admin-card-change neutral">Uploaded files</div>
                </div>

                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3>Total Payments</h3>
                    <i className="fas fa-credit-card"></i>
                  </div>
                  <div className="admin-card-value">{stats?.total_payments || 0}</div>
                  <div className="admin-card-change neutral">Processed payments</div>
                </div>

                <div className="admin-card">
                  <div className="admin-card-header">
                    <h3>Total Revenue</h3>
                    <i className="fas fa-dollar-sign"></i>
                  </div>
                  <div className="admin-card-value">MWK {stats?.total_revenue?.toLocaleString() || 0}</div>
                  <div className="admin-card-change positive">Application fees</div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="quick-actions-section">
              <h3>Quick Actions</h3>
              <div className="quick-actions-grid">
                <button 
                  className="quick-action-btn"
                  onClick={() => handleSectionChange('applications')}
                >
                  <i className="fas fa-clipboard-list"></i>
                  <span>All Applications</span>
                </button>
                <button 
                  className="quick-action-btn"
                  onClick={() => handleSectionChange('review')}
                >
                  <i className="fas fa-clipboard-check"></i>
                  <span>Review Verified</span>
                </button>
                <button 
                  className="quick-action-btn"
                  onClick={() => handleSectionChange('payments')}
                >
                  <i className="fas fa-credit-card"></i>
                  <span>Manage Payments</span>
                </button>
                <button 
                  className="quick-action-btn"
                  onClick={() => handleSectionChange('users')}
                >
                  <i className="fas fa-users-cog"></i>
                  <span>User Management</span>
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'applications':
        return (
          <div className="admin-content-section">
            <div className="admin-section-header">
              <h2>
                <i className="fas fa-clipboard-list"></i>
                Application Review
              </h2>
              <p>Review and manage submitted applications</p>
            </div>
            
            {loading ? (
              <div className="loading-state">Loading applications...</div>
            ) : applications.length > 0 ? (
              <div className="data-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Email</th>
                      <th>Program</th>
                      <th>Status</th>
                      <th>Submitted Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map(app => (
                      <tr key={app.id}>
                        <td className="student-name">{app.user.name}</td>
                        <td>{app.user.email}</td>
                        <td>{app.program_type || 'Not specified'}</td>
                        <td>
                          <span className={`status-tag ${app.status}`}>
                            {app.status}
                          </span>
                        </td>
                        <td>{new Date(app.submitted_at).toLocaleDateString()}</td>
                        <td>
                          <div className="action-buttons">
                            {app.status === 'submitted' && (
                              <>
                                <button 
                                  onClick={() => updateApplicationStatus(app.id, 'accepted')}
                                  className="btn-approve"
                                  title="Approve Application"
                                >
                                  <i className="fas fa-check"></i> Approve
                                </button>
                                <button 
                                  onClick={() => updateApplicationStatus(app.id, 'rejected')}
                                  className="btn-reject"
                                  title="Reject Application"
                                >
                                  <i className="fas fa-times"></i> Reject
                                </button>
                              </>
                            )}
                            {app.status !== 'submitted' && (
                              <span className="status-final">
                                {app.status === 'accepted' ? '✅ Approved' : '❌ Rejected'}
                                {app.decision_date && (
                                  <small> on {new Date(app.decision_date).toLocaleDateString()}</small>
                                )}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="admin-placeholder">
                <p>No applications submitted yet</p>
              </div>
            )}
          </div>
        );
      
      case 'users':
        return (
          <div className="admin-content-section">
            <UserManagement />
          </div>
        );

      case 'review':
        return (
          <div className="admin-content-section">
            <ApplicationReview />
          </div>
        );

      case 'payments':
        return (
          <div className="admin-content-section">
            <PaymentManagement />
          </div>
        );
      
      case 'communications':
        return (
          <div className="admin-content-section">
            <div className="admin-section-header">
              <h2>
                <i className="fas fa-envelope"></i>
                Communications Center
              </h2>
              <p>Manage email and SMS communications</p>
            </div>
            
            <div className="communications-grid">
              <div className="comm-card">
                <h3><i className="fas fa-envelope"></i> Email Templates</h3>
                <p>Manage email templates for notifications</p>
                <button className="btn-secondary" onClick={() => setError('Email templates coming soon')}>
                  <i className="fas fa-cog"></i> Manage Templates
                </button>
              </div>
              
              <div className="comm-card">
                <h3><i className="fas fa-sms"></i> SMS Notifications</h3>
                <p>Configure SMS notification settings</p>
                <button className="btn-secondary" onClick={() => setError('SMS integration coming soon')}>
                  <i className="fas fa-cog"></i> SMS Settings
                </button>
              </div>
              
              <div className="comm-card">
                <h3><i className="fas fa-bell"></i> Notification Logs</h3>
                <p>View sent notifications and delivery status</p>
                <button className="btn-secondary" onClick={() => setError('Notification logs coming soon')}>
                  <i className="fas fa-list"></i> View Logs
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'reports':
        return (
          <div className="admin-content-section">
            <div className="admin-section-header">
              <h2>
                <i className="fas fa-file-chart-line"></i>
                Reports & Analytics
              </h2>
              <p>Generate and view system reports</p>
            </div>
            
            <div className="reports-grid">
              <div className="report-card">
                <h3><i className="fas fa-chart-bar"></i> Application Trends</h3>
                <p>View application submission patterns and trends over time</p>
                <div className="report-stats">
                  <div>Total: {stats?.total_applications || 0}</div>
                  <div>Pending: {stats?.pending_review || 0}</div>
                  <div>Success Rate: {stats?.total_applications ? Math.round(((stats?.accepted || 0) / stats.total_applications) * 100) : 0}%</div>
                </div>
                <button className="btn-secondary" onClick={() => setError('Detailed reports coming soon')}>
                  <i className="fas fa-chart-line"></i> View Trends
                </button>
              </div>
              
              <div className="report-card">
                <h3><i className="fas fa-users"></i> User Analytics</h3>
                <p>Monitor user engagement and system usage statistics</p>
                <div className="report-stats">
                  <div>Total Users: {stats?.total_users || 0}</div>
                  <div>Active Users: {Math.round((stats?.total_users || 0) * 0.8)}</div>
                  <div>Growth Rate: +15%</div>
                </div>
                <button className="btn-secondary" onClick={() => setError('User analytics coming soon')}>
                  <i className="fas fa-chart-pie"></i> View Analytics
                </button>
              </div>
              
              <div className="report-card">
                <h3><i className="fas fa-file-export"></i> Export Data</h3>
                <p>Export application and user data for external analysis</p>
                <button className="btn-secondary" onClick={() => setError('Export functionality coming soon')}>
                  <i className="fas fa-download"></i> Export CSV
                </button>
              </div>

              <div className="report-card">
                <h3><i className="fas fa-chart-line"></i> Financial Reports</h3>
                <p>Generate financial reports and revenue analytics</p>
                <div className="report-stats">
                  <div>Total Revenue: MWK {stats?.total_revenue?.toLocaleString() || 0}</div>
                  <div>Total Payments: {stats?.total_payments || 0}</div>
                  <div>Average Fee: MWK {stats?.total_payments ? Math.round((stats?.total_revenue || 0) / stats.total_payments) : 0}</div>
                </div>
                <button className="btn-secondary" onClick={() => setError('Financial reports coming soon')}>
                  <i className="fas fa-file-invoice-dollar"></i> View Reports
                </button>
              </div>
            </div>
          </div>
        );

      case 'audit':
        return (
          <div className="admin-content-section">
            <div className="admin-section-header">
              <h2>
                <i className="fas fa-history"></i>
                Audit Logs
              </h2>
              <p>Track system activities and user actions</p>
            </div>
            
            <div className="audit-grid">
              <div className="audit-card">
                <h3><i className="fas fa-user-clock"></i> User Activity</h3>
                <p>Monitor user login/logout and activity patterns</p>
                <button className="btn-secondary" onClick={() => setError('User activity logs coming soon')}>
                  <i className="fas fa-list"></i> View Activity
                </button>
              </div>
              
              <div className="audit-card">
                <h3><i className="fas fa-shield-alt"></i> Security Logs</h3>
                <p>Track security events and access attempts</p>
                <button className="btn-secondary" onClick={() => setError('Security logs coming soon')}>
                  <i className="fas fa-shield-alt"></i> View Security
                </button>
              </div>
              
              <div className="audit-card">
                <h3><i className="fas fa-database"></i> System Logs</h3>
                <p>Monitor system performance and errors</p>
                <button className="btn-secondary" onClick={() => setError('System logs coming soon')}>
                  <i className="fas fa-server"></i> View System
                </button>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="admin-content-section">
            <div className="admin-section-header">
              <h2>
                <i className="fas fa-cog"></i>
                System Settings
              </h2>
              <p>Configure system parameters and preferences</p>
            </div>
            
            <div className="settings-grid">
              <div className="setting-card">
                <h3><i className="fas fa-calendar-alt"></i> Application Periods</h3>
                <p>Set application opening and closing dates</p>
                <button className="btn-secondary" onClick={() => setError('Application periods coming soon')}>
                  <i className="fas fa-cog"></i> Configure
                </button>
              </div>
              
              <div className="setting-card">
                <h3><i className="fas fa-graduation-cap"></i> Program Management</h3>
                <p>Manage available programs and requirements</p>
                <button className="btn-secondary" onClick={() => setError('Program management coming soon')}>
                  <i className="fas fa-cog"></i> Manage Programs
                </button>
              </div>
              
              <div className="setting-card">
                <h3><i className="fas fa-bell"></i> Notification Settings</h3>
                <p>Configure system notification preferences</p>
                <button className="btn-secondary" onClick={() => setError('Notification settings coming soon')}>
                  <i className="fas fa-cog"></i> Configure
                </button>
              </div>

              <div className="setting-card">
                <h3><i className="fas fa-database"></i> System Backup</h3>
                <p>Manage system backups and data retention</p>
                <button className="btn-secondary" onClick={() => setError('Backup management coming soon')}>
                  <i className="fas fa-cog"></i> Manage Backup
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="admin-dashboard">
      <AdminHeader />
      <AdminNavigation 
        activeSection={activeSection} 
        onSectionChange={handleSectionChange} 
      />
      
      <main className="admin-main">
        <div className="admin-container">
          <div className="admin-welcome">
            <h1>Welcome back, {user?.name}</h1>
            <p>Here's what's happening with your system today.</p>
          </div>
          
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 