import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DocumentManagement.css';

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

interface ApplicationDocument {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  application: {
    id: number;
    application_id: string;
    program_type: string;
  };
  document_type: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  verification_notes?: string;
  uploaded_at: string;
  verified_at?: string;
  verified_by?: string;
}

interface DocumentStats {
  total_documents: number;
  pending_verification: number;
  verified: number;
  rejected: number;
  document_types: {
    [key: string]: number;
  };
}

const DocumentManagement: React.FC = () => {
  const [documents, setDocuments] = useState<ApplicationDocument[]>([]);
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedDocument, setSelectedDocument] = useState<ApplicationDocument | null>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'verified' | 'rejected'>('verified');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDocuments();
    loadStats();
  }, [filterStatus, filterType, searchTerm]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      if (filterStatus) params.append('status', filterStatus);
      if (filterType) params.append('type', filterType);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await adminApi.get(`/admin/documents?${params.toString()}`);

      if (response.data.success) {
        setDocuments(response.data.data.data || []);
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await adminApi.get('/admin/documents/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error loading document stats:', error);
    }
  };

  const handleVerification = async () => {
    if (!selectedDocument) return;

    try {
      setLoading(true);
      await adminApi.put(`/admin/documents/${selectedDocument.id}/verify`, {
        status: verificationStatus,
        notes: verificationNotes
      });

      setShowVerificationModal(false);
      setSelectedDocument(null);
      setVerificationNotes('');
      loadDocuments();
      loadStats();
    } catch (error: any) {
      console.error('Error verifying document:', error);
      setError(error.response?.data?.message || 'Failed to verify document');
    } finally {
      setLoading(false);
    }
  };

  const openVerificationModal = (doc: ApplicationDocument) => {
    setSelectedDocument(doc);
    setVerificationNotes(doc.verification_notes || '');
    setVerificationStatus(doc.verification_status === 'verified' ? 'verified' : 'rejected');
    setShowVerificationModal(true);
  };

  const downloadDocument = async (doc: ApplicationDocument) => {
    try {
      const response = await adminApi.get(`/admin/documents/${doc.id}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', doc.file_name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading document:', error);
      setError('Failed to download document');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'verified': return 'green';
      case 'rejected': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="document-management">
      <div className="admin-section-header">
        <h2>
          <i className="fas fa-file-alt"></i>
          Document Management Center
        </h2>
        <p>Verify and manage uploaded application documents</p>
      </div>

      {error && (
        <div className="error-alert">
          <i className="fas fa-exclamation-triangle"></i>
          {error}
        </div>
      )}

      {/* Document Statistics */}
      {stats && (
        <div className="document-stats">
          <div className="stat-card">
            <h4>Total Documents</h4>
            <span className="stat-value">{stats.total_documents}</span>
          </div>
          <div className="stat-card">
            <h4>Pending Verification</h4>
            <span className="stat-value pending">{stats.pending_verification}</span>
          </div>
          <div className="stat-card">
            <h4>Verified</h4>
            <span className="stat-value verified">{stats.verified}</span>
          </div>
          <div className="stat-card">
            <h4>Rejected</h4>
            <span className="stat-value rejected">{stats.rejected}</span>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="document-controls">
        <div className="search-filters">
          <input
            type="text"
            placeholder="Search by student name or document type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="">All Types</option>
            <option value="passport_photo">Passport Photo</option>
            <option value="academic_transcript">Academic Transcript</option>
            <option value="motivation_letter">Motivation Letter</option>
            <option value="certificate">Certificate</option>
            <option value="id_document">ID Document</option>
          </select>
        </div>
        <button 
          className="btn-primary"
          onClick={loadDocuments}
          disabled={loading}
        >
          <i className="fas fa-sync-alt"></i>
          Refresh
        </button>
      </div>

      {/* Documents Table */}
      <div className="documents-table-container">
        {loading ? (
          <div className="loading-state">Loading documents...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Application ID</th>
                <th>Document Type</th>
                <th>File Name</th>
                <th>Size</th>
                <th>Status</th>
                <th>Uploaded</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="no-data">No documents found</td>
                </tr>
              ) : (
                documents.map(doc => (
                  <tr key={doc.id}>
                    <td className="student-info">
                      <div className="student-name">{doc.user.name}</div>
                      <div className="student-email">{doc.user.email}</div>
                    </td>
                    <td>{doc.application.application_id}</td>
                    <td>
                      <span className="document-type-badge">
                        {doc.document_type.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="file-name">{doc.file_name}</td>
                    <td>{formatFileSize(doc.file_size)}</td>
                    <td>
                      <span className={`status-tag ${doc.verification_status}`}>
                        {doc.verification_status}
                      </span>
                    </td>
                    <td>{new Date(doc.uploaded_at).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-download"
                          onClick={() => downloadDocument(doc)}
                          title="Download Document"
                        >
                          <i className="fas fa-download"></i>
                        </button>
                        <button 
                          className="btn-verify"
                          onClick={() => openVerificationModal(doc)}
                          title="Verify Document"
                        >
                          <i className="fas fa-check-circle"></i>
                        </button>
                        {doc.verification_notes && (
                          <button 
                            className="btn-notes"
                            onClick={() => {
                              setSelectedDocument(doc);
                              setVerificationNotes(doc.verification_notes || '');
                              setShowVerificationModal(true);
                            }}
                            title="View Notes"
                          >
                            <i className="fas fa-sticky-note"></i>
                          </button>
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

      {/* Verification Modal */}
      {showVerificationModal && selectedDocument && (
        <div className="modal-overlay" onClick={() => setShowVerificationModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Verify Document</h3>
              <button className="modal-close" onClick={() => setShowVerificationModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="document-info">
                <h4>Document Details</h4>
                <p><strong>Student:</strong> {selectedDocument.user.name}</p>
                <p><strong>Type:</strong> {selectedDocument.document_type}</p>
                <p><strong>File:</strong> {selectedDocument.file_name}</p>
                <p><strong>Size:</strong> {formatFileSize(selectedDocument.file_size)}</p>
              </div>
              
              <div className="verification-form">
                <div className="form-group">
                  <label>Verification Status</label>
                  <select
                    value={verificationStatus}
                    onChange={(e) => setVerificationStatus(e.target.value as 'verified' | 'rejected')}
                    className="form-control"
                  >
                    <option value="verified">Verified</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Verification Notes</label>
                  <textarea
                    value={verificationNotes}
                    onChange={(e) => setVerificationNotes(e.target.value)}
                    className="form-control"
                    rows={4}
                    placeholder="Add verification notes or reasons for rejection..."
                  />
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowVerificationModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                className={`btn ${verificationStatus === 'verified' ? 'btn-success' : 'btn-danger'}`}
                onClick={handleVerification}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Processing...
                  </>
                ) : (
                  <>
                    <i className={`fas fa-${verificationStatus === 'verified' ? 'check' : 'times'}`}></i>
                    {verificationStatus === 'verified' ? 'Verify' : 'Reject'} Document
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentManagement; 