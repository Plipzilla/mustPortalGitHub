import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ApplicationReview.css';

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

interface ApplicationSubmission {
  id: number;
  application_id: string;
  application_type: string;
  status: string;
  submitted_at: string;
  payment_reference: string;
  payment_verified: boolean;
  user: {
    id: number;
    name: string;
    email: string;
  };
  // Personal Information
  title: string;
  surname: string;
  first_name: string;
  marital_status: string;
  maiden_name?: string;
  date_of_birth: string;
  place_of_birth: string;
  nationality: string;
  country_of_residence: string;
  gender: string;
  passport_photo_path?: string;
  correspondence_address: string;
  telephone_numbers: string;
  email_address: string;
  permanent_address?: string;
  show_permanent_address: boolean;
  
  // Program Information
  level_of_study: string;
  first_choice: string;
  second_choice?: string;
  third_choice?: string;
  fourth_choice?: string;
  method_of_study: string;
  
  // Education History
  school_name?: string;
  school_from_date?: string;
  school_to_date?: string;
  subjects_studied?: string;
  examination_year?: string;
  results_year?: string;
  grades_achieved?: string;
  subjects_and_grades?: Array<{id: string, subject: string, grade: string}>;
  university_college?: string;
  uni_from_date?: string;
  uni_to_date?: string;
  programme?: string;
  qualification?: string;
  date_of_award?: string;
  class_of_award?: string;
  
  // Work Experience & Motivation
  motivation_essay?: string;
  upload_motivation_note: boolean;
  motivation_file_path?: string;
  
  // Special Needs
  has_disability: boolean;
  disability_description?: string;
  
  // Declaration
  declaration_agreed: boolean;
  declaration_full_name: string;
  declaration_date: string;
  all_sections_completed: boolean;
  all_documents_uploaded: boolean;
  deposit_slip_attached: boolean;
  
  // Metadata
  program_title: string;
  faculty: string;
  review_comments?: string;
  decision_date?: string;
  
  // Related data
  work_experiences?: Array<{
    from_date: string;
    to_date: string;
    organization: string;
    position: string;
  }>;
  referees?: Array<{
    name: string;
    position: string;
    institution: string;
    address: string;
    email: string;
  }>;
}

const ApplicationReview: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationSubmission[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationSubmission | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reviewComments, setReviewComments] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadApplications();
  }, [currentPage, searchTerm, statusFilter, typeFilter]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('per_page', '10');
      if (searchTerm) params.append('search', searchTerm);
      if (statusFilter) params.append('status', statusFilter);
      if (typeFilter) params.append('type', typeFilter);
      
      const response = await adminApi.get(`/admin/verified-applications?${params.toString()}`);
      
      if (response.data.success) {
        setApplications(response.data.data.data || []);
        setTotalPages(response.data.data.last_page || 1);
      }
    } catch (error: any) {
      console.error('Error loading applications:', error);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (applicationId: number, status: 'accepted' | 'rejected') => {
    try {
      setProcessing(true);
      await adminApi.put(`/admin/applications/${applicationId}/status`, {
        status,
        comments: reviewComments
      });
      
      setReviewComments('');
      setSelectedApplication(null);
      await loadApplications();
    } catch (error: any) {
      console.error('Error updating application status:', error);
      setError('Failed to update application status');
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted': return 'orange';
      case 'review': return 'blue';
      case 'accepted': return 'green';
      case 'rejected': return 'red';
      default: return 'gray';
    }
  };

  const renderApplicationDetails = (app: ApplicationSubmission) => {
    return (
      <div className="application-details">
        <div className="details-section">
          <h4>Personal Information</h4>
          <div className="details-grid">
            <div><strong>Name:</strong> {app.title} {app.first_name} {app.surname}</div>
            <div><strong>Email:</strong> {app.email_address}</div>
            <div><strong>Phone:</strong> {app.telephone_numbers}</div>
            <div><strong>Date of Birth:</strong> {new Date(app.date_of_birth).toLocaleDateString()}</div>
            <div><strong>Nationality:</strong> {app.nationality}</div>
            <div><strong>Gender:</strong> {app.gender}</div>
            <div><strong>Marital Status:</strong> {app.marital_status}</div>
            {app.maiden_name && <div><strong>Maiden Name:</strong> {app.maiden_name}</div>}
          </div>
          
          {app.passport_photo_path && (
            <div className="image-section">
              <h5>Passport Photo</h5>
              <img 
                src={`http://localhost:8003/storage/${app.passport_photo_path}`} 
                alt="Passport Photo" 
                className="document-image"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        <div className="details-section">
          <h4>Program Choices</h4>
          <div className="program-choices">
            <div className="choice-item">
              <strong>1st Choice:</strong> {app.first_choice}
            </div>
            {app.second_choice && (
              <div className="choice-item">
                <strong>2nd Choice:</strong> {app.second_choice}
              </div>
            )}
            {app.third_choice && (
              <div className="choice-item">
                <strong>3rd Choice:</strong> {app.third_choice}
              </div>
            )}
            {app.fourth_choice && (
              <div className="choice-item">
                <strong>4th Choice:</strong> {app.fourth_choice}
              </div>
            )}
          </div>
        </div>

        <div className="details-section">
          <h4>Education History</h4>
          {app.level_of_study === 'undergraduate' ? (
            <div>
              <div><strong>School:</strong> {app.school_name}</div>
              <div><strong>Period:</strong> {app.school_from_date} - {app.school_to_date}</div>
              <div><strong>Examination Year:</strong> {app.examination_year}</div>
              <div><strong>Results Year:</strong> {app.results_year}</div>
              
              {app.subjects_and_grades && app.subjects_and_grades.length > 0 && (
                <div className="grades-section">
                  <h5>Subjects and Grades</h5>
                  <div className="grades-grid">
                    {app.subjects_and_grades.map((item, index) => (
                      <div key={index} className="grade-item">
                        <span className="subject">{item.subject}</span>
                        <span className="grade">{item.grade}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div><strong>University/College:</strong> {app.university_college}</div>
              <div><strong>Programme:</strong> {app.programme}</div>
              <div><strong>Qualification:</strong> {app.qualification}</div>
              <div><strong>Period:</strong> {app.uni_from_date} - {app.uni_to_date}</div>
              <div><strong>Date of Award:</strong> {app.date_of_award}</div>
              <div><strong>Class of Award:</strong> {app.class_of_award}</div>
            </div>
          )}
        </div>

        {app.level_of_study === 'postgraduate' && app.work_experiences && app.work_experiences.length > 0 && (
          <div className="details-section">
            <h4>Work Experience</h4>
            {app.work_experiences.map((work, index) => (
              <div key={index} className="work-item">
                <div><strong>Position:</strong> {work.position}</div>
                <div><strong>Organization:</strong> {work.organization}</div>
                <div><strong>Period:</strong> {work.from_date} - {work.to_date}</div>
              </div>
            ))}
          </div>
        )}

        {app.level_of_study === 'postgraduate' && app.motivation_essay && (
          <div className="details-section">
            <h4>Motivation Essay</h4>
            <div className="essay-content">{app.motivation_essay}</div>
          </div>
        )}

        {app.has_disability && (
          <div className="details-section">
            <h4>Special Needs</h4>
            <div>{app.disability_description}</div>
          </div>
        )}

        <div className="details-section">
          <h4>Referees</h4>
          {app.referees && app.referees.map((referee, index) => (
            <div key={index} className="referee-item">
              <div><strong>Name:</strong> {referee.name}</div>
              <div><strong>Position:</strong> {referee.position}</div>
              <div><strong>Institution:</strong> {referee.institution}</div>
              <div><strong>Email:</strong> {referee.email}</div>
              <div><strong>Address:</strong> {referee.address}</div>
            </div>
          ))}
        </div>

        <div className="details-section">
          <h4>Payment Information</h4>
          <div><strong>Payment Reference:</strong> {app.payment_reference}</div>
          <div><strong>Payment Verified:</strong> {app.payment_verified ? 'Yes' : 'No'}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="application-review">
      <div className="admin-section-header">
        <h2>
          <i className="fas fa-clipboard-check"></i>
          Application Review Center
        </h2>
        <p>Review and make decisions on verified applications</p>
      </div>

      {error && (
        <div className="error-alert">
          <i className="fas fa-exclamation-triangle"></i>
          {error}
        </div>
      )}

      {/* Filters and Search */}
      <div className="review-controls">
        <div className="search-filters">
          <input
            type="text"
            placeholder="Search by name, email, or application ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="review">Under Review</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Types</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="postgraduate">Postgraduate</option>
          </select>
        </div>
        <button 
          className="btn-primary"
          onClick={loadApplications}
          disabled={loading}
        >
          <i className="fas fa-sync-alt"></i>
          Refresh
        </button>
      </div>

      {/* Applications List */}
      <div className="applications-table-container">
        {loading ? (
          <div className="loading-state">Loading applications...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Student</th>
                <th>Program</th>
                <th>Type</th>
                <th>Payment Ref</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={8} className="no-data">No applications found</td>
                </tr>
              ) : (
                applications.map(app => (
                  <tr key={app.id}>
                    <td className="application-id">{app.application_id}</td>
                    <td className="student-info">
                      <div className="student-name">{app.user.name}</div>
                      <div className="student-email">{app.user.email}</div>
                    </td>
                    <td>{app.first_choice}</td>
                    <td>
                      <span className="type-badge">
                        {app.application_type.toUpperCase()}
                      </span>
                    </td>
                    <td className="payment-ref">{app.payment_reference}</td>
                    <td>
                      <span className={`status-tag ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>{formatDate(app.submitted_at)}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-view"
                          onClick={() => setSelectedApplication(app)}
                          title="Review Application"
                        >
                          <i className="fas fa-eye"></i>
                        </button>
                        {app.status === 'submitted' && (
                          <>
                            <button 
                              className="btn-accept"
                              onClick={() => handleStatusUpdate(app.id, 'accepted')}
                              title="Accept Application"
                              disabled={processing}
                            >
                              <i className="fas fa-check"></i>
                            </button>
                            <button 
                              className="btn-reject"
                              onClick={() => handleStatusUpdate(app.id, 'rejected')}
                              title="Reject Application"
                              disabled={processing}
                            >
                              <i className="fas fa-times"></i>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button 
          className="btn-secondary" 
          disabled={currentPage <= 1 || loading} 
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button 
          className="btn-secondary" 
          disabled={currentPage >= totalPages || loading} 
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>

      {/* Application Details Modal */}
      {selectedApplication && (
        <div className="modal-overlay" onClick={() => setSelectedApplication(null)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Application Review - {selectedApplication.application_id}</h3>
              <button className="modal-close" onClick={() => setSelectedApplication(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              {renderApplicationDetails(selectedApplication)}
              
              {selectedApplication.status === 'submitted' && (
                <div className="review-actions">
                  <h4>Review Comments</h4>
                  <textarea
                    value={reviewComments}
                    onChange={(e) => setReviewComments(e.target.value)}
                    placeholder="Add review comments (optional)..."
                    className="review-comments"
                    rows={3}
                  />
                  <div className="action-buttons">
                    <button 
                      className="btn btn-success"
                      onClick={() => handleStatusUpdate(selectedApplication.id, 'accepted')}
                      disabled={processing}
                    >
                      <i className="fas fa-check"></i> Accept Application
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleStatusUpdate(selectedApplication.id, 'rejected')}
                      disabled={processing}
                    >
                      <i className="fas fa-times"></i> Reject Application
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationReview;
