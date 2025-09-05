import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import ApplicationService, { ApplicationSubmission } from '../../services/ApplicationService';
import './ApplicationSubmitted.css';

const ApplicationSubmitted: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const location = useLocation();
  const submissionFromNav = location.state?.submission as ApplicationSubmission;
  const [sub, setSub] = useState<any>(submissionFromNav || null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const loadIfNeeded = async () => {
      if (!sub && applicationId) {
        try {
          const fetched = await ApplicationService.getSubmission(applicationId);
          setSub(fetched);
        } catch (e) {
          // Keep page visible with minimal info
        }
      }
    };
    loadIfNeeded();
  }, [sub, applicationId]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeLabel = () => {
    const t = (sub?.application_type as string) || (submissionFromNav?.application_type as string) || '';
    if (!t) return 'Unknown';
    return t.charAt(0).toUpperCase() + t.slice(1);
  };

  const getProgramChoices = () => {
    // Support both raw submission and React-formatted payload
    const first = sub?.first_choice || sub?.step2?.programInfo?.firstChoice || '';
    const second = sub?.second_choice || sub?.step2?.programInfo?.secondChoice || '';
    const third = sub?.third_choice || sub?.step2?.programInfo?.thirdChoice || '';
    const fourth = sub?.fourth_choice || sub?.step2?.programInfo?.fourthChoice || '';
    return [first, second, third, fourth];
  };

  return (
    <div className="application-submitted">
      <div className="container">
        <div className="success-card">
          <div className="success-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          
          <div className="success-content">
            <h1>Application Submitted Successfully!</h1>
            <p className="success-message">
              Your application has been submitted and is now being processed. 
              You will receive email updates on the status of your application.
            </p>
            
            <div className="submission-details">
              <h3>Submission Details</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <label>Application ID</label>
                  <span className="application-id">{applicationId || sub?.application_id}</span>
                </div>
                <div className="detail-item">
                  <label>Application Type</label>
                  <span>{getTypeLabel()}</span>
                </div>
                <div className="detail-item">
                  <label>Submitted Date</label>
                  <span>{formatDate(sub?.submitted_at)}</span>
                </div>
                <div className="detail-item">
                  <label>Status</label>
                  <span className="status-badge submitted">
                    {sub?.status || 'Submitted'}
                  </span>
                </div>
              </div>
            </div>

            {/* Program choices (ensure all four are visible) */}
            <div className="submission-details">
              <h3>Program Choices</h3>
              <div className="details-grid">
                {getProgramChoices().map((choice, idx) => (
                  <div className="detail-item" key={idx}>
                    <label>{`Choice ${idx + 1}`}</label>
                    <span>{choice || '—'}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="next-steps">
              <h3>What Happens Next?</h3>
              <div className="steps-list">
                <div className="step-item completed">
                  <div className="step-icon">
                    <i className="fas fa-check"></i>
                  </div>
                  <div className="step-content">
                    <h4>Application Submitted</h4>
                    <p>Your application has been successfully submitted and received.</p>
                  </div>
                </div>
                
                <div className="step-item">
                  <div className="step-icon">
                    <i className="fas fa-search"></i>
                  </div>
                  <div className="step-content">
                    <h4>Initial Review</h4>
                    <p>Our admissions team will review your application for completeness.</p>
                  </div>
                </div>
                
                <div className="step-item">
                  <div className="step-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="step-content">
                    <h4>Academic Assessment</h4>
                    <p>Your application will be evaluated by the relevant academic committee.</p>
                  </div>
                </div>
                
                <div className="step-item">
                  <div className="step-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="step-content">
                    <h4>Decision Notification</h4>
                    <p>You will receive an email notification with the admission decision.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="important-notes">
              <h3>Important Notes</h3>
              <div className="notes-list">
                <div className="note-item">
                  <i className="fas fa-info-circle"></i>
                  <p>Processing time typically takes 2-4 weeks from the submission date.</p>
                </div>
                <div className="note-item">
                  <i className="fas fa-envelope"></i>
                  <p>All communication will be sent to your registered email address.</p>
                </div>
                <div className="note-item">
                  <i className="fas fa-phone"></i>
                  <p>For inquiries, contact the Admissions Office at admissions@must.ac.mw</p>
                </div>
                <div className="note-item">
                  <i className="fas fa-edit"></i>
                  <p>You cannot modify your application after submission. Please keep this reference number for your records.</p>
                </div>
              </div>
            </div>
            
            <div className="action-buttons">
              <Link to="/dashboard" className="btn btn-primary">
                <i className="fas fa-tachometer-alt"></i> Go to Dashboard
              </Link>
              <Link 
                to={`/application/view/${applicationId || sub?.application_id}`} 
                className="btn btn-secondary"
              >
                <i className="fas fa-eye"></i> View Application
              </Link>
            </div>
            
            <div className="download-section">
              <p>
                <strong>Keep this for your records:</strong> Screenshot or bookmark this page with your application ID.
              </p>
              <button 
                className="btn btn-outline"
                onClick={() => window.print()}
              >
                <i className="fas fa-print"></i> Print Confirmation
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationSubmitted; 