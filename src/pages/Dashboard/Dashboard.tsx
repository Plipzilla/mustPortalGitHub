import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ApplicationService, { UserApplication, DraftsByType } from '../../services/ApplicationService';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Guest User');
  const [applications, setApplications] = useState<UserApplication[]>([]);
  const [draftsByType, setDraftsByType] = useState<DraftsByType>({ undergraduate: null, postgraduate: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingDraft, setDeletingDraft] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    show: boolean;
    applicationType: 'undergraduate' | 'postgraduate' | null;
    applicationTitle: string;
  }>({ show: false, applicationType: null, applicationTitle: '' });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Check if this is an admin who should be redirected to admin panel
    const adminIntent = localStorage.getItem('admin_login_intent');
    if (adminIntent === 'true') {
      console.log('🔍 DASHBOARD DEBUG - Admin intent detected, redirecting to admin panel');
      localStorage.removeItem('admin_login_intent'); // Clear the flag
      navigate('/admin', { replace: true });
      return;
    }
    
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const user = JSON.parse(currentUser);
      setUserName(user.name || user.email);
    }
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load all applications (drafts and submissions)
      const applicationsData = await ApplicationService.getUserApplications();
      setApplications(applicationsData);
      
      // Load drafts by type for quick access
      const draftsData = await ApplicationService.getDraftsByType();
      setDraftsByType(draftsData);
      
    } catch (err: any) {
      console.error('Failed to load dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'incomplete': return 'Action Needed';
      case 'submitted': return 'Submitted';
      case 'under_review': return 'In Review';
      case 'approved': return 'Approved';
      case 'rejected': return 'Rejected';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'blue';
      case 'incomplete': return 'orange';
      case 'submitted': return 'green';
      case 'under_review': return 'purple';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      default: return 'gray';
    }
  };

  const handleContinueDraft = (applicationType: 'undergraduate' | 'postgraduate') => {
    // Navigate to application form with specific application type
    navigate(`/application?type=${applicationType}`);
  };

  const handleViewApplication = (applicationId: string) => {
    // Navigate to view application details
    navigate(`/application/view/${applicationId}`);
  };

  const handleDeleteDraft = (applicationType: 'undergraduate' | 'postgraduate', applicationTitle: string) => {
    setShowDeleteConfirm({
      show: true,
      applicationType,
      applicationTitle,
    });
  };

  const confirmDeleteDraft = async () => {
    if (!showDeleteConfirm.applicationType) return;

    try {
      setDeletingDraft(showDeleteConfirm.applicationType);
      await ApplicationService.deleteDraft(showDeleteConfirm.applicationType);
      
      // Refresh dashboard data
      await loadDashboardData();
      
      setShowDeleteConfirm({ show: false, applicationType: null, applicationTitle: '' });
    } catch (err: any) {
      console.error('Failed to delete draft:', err);
      setError(err.message || 'Failed to delete draft');
    } finally {
      setDeletingDraft(null);
    }
  };

  const cancelDeleteDraft = () => {
    setShowDeleteConfirm({ show: false, applicationType: null, applicationTitle: '' });
  };

  return (
    <main className="page-content">
      <section className="dashboard">
        <div className="container">
          <div className="dashboard-header">
            <div className="user-welcome">
              <h2>Welcome, {userName}</h2>
              <p>Track and manage your applications here</p>
            </div>
            <div className="dashboard-actions">
              {applications.filter(app => app.is_draft).length >= 2 ? (
                <button 
                  className="btn btn-secondary"
                  disabled
                  title="Maximum of 3 drafts allowed. Delete a draft to create a new one."
                >
                  <i className="fas fa-exclamation-triangle"></i> Max Drafts (3/3)
                </button>
              ) : (
                <Link to="/application" className="btn btn-primary">
                  <i className="fas fa-plus"></i> New Application
                </Link>
              )}
            </div>
          </div>
          
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-icon blue">
                <i className="fas fa-file-alt"></i>
              </div>
              <div className="stat-info">
                <h3>{applications.length}</h3>
                <p>Total Applications</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon green">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-info">
                <h3>{applications.filter(app => app.status === 'accepted').length}</h3>
                <p>Accepted</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon orange">
                <i className="fas fa-hourglass-half"></i>
              </div>
              <div className="stat-info">
                <h3>{applications.filter(app => app.status === 'review').length}</h3>
                <p>In Review</p>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon purple">
                <i className="fas fa-exclamation-circle"></i>
              </div>
              <div className="stat-info">
                <h3>{applications.filter(app => app.status === 'incomplete' || app.status === 'draft').length}</h3>
                <p>Action Needed</p>
              </div>
            </div>
          </div>
          
          <div className="dashboard-section">
            <div className="section-header">
              <h3>Your Applications</h3>
              <div className="section-filter">
                <select className="form-control">
                  <option>All Applications</option>
                  <option>Drafts</option>
                  <option>Incomplete</option>
                  <option>Submitted</option>
                  <option>In Review</option>
                  <option>Accepted</option>
                  <option>Rejected</option>
                </select>
              </div>
            </div>
            
            {applications.map(application => (
              <div key={application.id} className="application-card">
                <div className="app-header">
                  <div className="app-title">{application.title}</div>
                  <div className={`app-status ${application.status}`}>
                    {getStatusText(application.status)}
                    {application.is_draft && application.completion_percentage !== undefined && (
                      <span className="completion-percentage">
                        {Math.round(application.completion_percentage)}% Complete
                      </span>
                    )}
                  </div>
                </div>
                <p>{application.faculty}</p>
                <div className="app-details">
                  <div className="detail-item">
                    <p>Application ID</p>
                    <h4>{application.application_id}</h4>
                  </div>
                  <div className="detail-item">
                    <p>Submitted Date</p>
                    <h4>{application.submitted_date}</h4>
                  </div>
                  <div className="detail-item">
                    <p>Status Updated</p>
                    <h4>{application.last_updated}</h4>
                  </div>
                </div>
                <div className="app-actions">
                  {application.status === 'accepted' && (
                    <>
                      <button className="btn-action">
                        <i className="fas fa-download"></i> Offer Letter
                      </button>
                      <button className="btn-action">
                        <i className="fas fa-print"></i> Print
                      </button>
                    </>
                  )}
                  {application.status === 'review' && (
                    <button className="btn-action">
                      <i className="fas fa-eye"></i> View Details
                    </button>
                  )}
                  {(application.status === 'incomplete' || application.status === 'draft') && (
                    <>
                      <button 
                        className="btn-action"
                        onClick={() => handleContinueDraft(application.application_type)}
                      >
                        <i className="fas fa-edit"></i> Continue Application
                      </button>
                      {application.is_draft && (
                        <button 
                          className="btn-action btn-delete"
                          onClick={() => handleDeleteDraft(application.application_type, application.title)}
                          disabled={deletingDraft === application.application_type}
                        >
                          {deletingDraft === application.application_type ? (
                            <>
                              <i className="fas fa-spinner fa-spin"></i> Deleting...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-trash"></i> Delete Draft
                            </>
                          )}
                        </button>
                      )}
                    </>
                  )}
                  {application.status === 'submitted' && (
                    <button className="btn-action">
                      <i className="fas fa-eye"></i> View Application
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="dashboard-section">
            <div className="section-header">
              <h3>Application Deadlines</h3>
            </div>
            <div className="deadline-list">
              <div className="deadline-item">
                <h4>Postgraduate Programs</h4>
                <p>Closing Date: 15 November 2023</p>
                <div className="progress">
                  <div className="progress-bar" style={{width: '75%'}}>75% time remaining</div>
                </div>
              </div>
              <div className="deadline-item">
                <h4>ODL Programs</h4>
                <p>Closing Date: 30 November 2023</p>
                <div className="progress">
                  <div className="progress-bar" style={{width: '85%'}}>85% time remaining</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm.show && (
        <div className="modal-overlay" onClick={cancelDeleteDraft}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Confirm Delete Draft</h3>
              <button className="modal-close" onClick={cancelDeleteDraft}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="warning-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <p>
                Are you sure you want to delete the draft for <strong>"{showDeleteConfirm.applicationTitle}"</strong>?
              </p>
              <div className="warning-text">
                <i className="fas fa-info-circle"></i>
                This action cannot be undone. All your progress on this application will be permanently lost.
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="btn btn-secondary" 
                onClick={cancelDeleteDraft}
                disabled={deletingDraft !== null}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger" 
                onClick={confirmDeleteDraft}
                disabled={deletingDraft !== null}
              >
                {deletingDraft ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Deleting...
                  </>
                ) : (
                  <>
                    <i className="fas fa-trash"></i> Delete Draft
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Dashboard; 