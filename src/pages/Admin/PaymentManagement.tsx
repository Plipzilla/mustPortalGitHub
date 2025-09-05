import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PaymentManagement.css';

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



interface PaymentStats {
  total_payments: number;
  total_amount: number;
  pending_payments: number;
  completed_payments: number;
  failed_payments: number;
  refunded_payments: number;
  monthly_revenue: {
    [key: string]: number;
  };
}



const PaymentManagement: React.FC = () => {
  const [stats, setStats] = useState<PaymentStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Payment references (CSV) state
  const [refs, setRefs] = useState<any[]>([]);
  const [refsPage, setRefsPage] = useState(1);
  const [refsTotalPages, setRefsTotalPages] = useState(1);
  const [refsBusy, setRefsBusy] = useState(false);
  const [refsMsg, setRefsMsg] = useState('');
  
  // Verified users state
  const [verifiedUsers, setVerifiedUsers] = useState<any[]>([]);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotalPages, setUsersTotalPages] = useState(1);
  const [usersBusy, setUsersBusy] = useState(false);
  const [usersSearch, setUsersSearch] = useState('');

  useEffect(() => {
    loadStats();
    loadReferences(1);
    loadVerifiedUsers(1);
  }, []);



  const loadStats = async () => {
    try {
      const response = await adminApi.get('/admin/payments/stats');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error loading payment stats:', error);
    }
  };



  // Payment references helpers
  const loadReferences = async (page: number = 1) => {
    try {
      setRefsBusy(true);
      const res = await adminApi.get(`/admin/payment-references?page=${page}`);
      if (res.data?.success) {
        const pager = res.data.data;
        setRefs(pager.data || []);
        setRefsPage(pager.current_page || 1);
        setRefsTotalPages(pager.last_page || 1);
      }
    } catch (e) {
      // swallow, show nothing
    } finally {
      setRefsBusy(false);
    }
  };

  const uploadCsv = async (file: File) => {
    try {
      setRefsBusy(true);
      setRefsMsg('');
      const fd = new FormData();
      fd.append('file', file);
      const res = await adminApi.post('/admin/payment-references/import', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data?.success) {
        setRefsMsg(res.data.message || 'Upload completed');
        await loadReferences(1);
      } else {
        setRefsMsg('Upload failed');
      }
    } catch (e: any) {
      setRefsMsg(e.response?.data?.message || 'Upload failed');
    } finally {
      setRefsBusy(false);
    }
  };

  const updateReference = async (id: number, status: 'unused' | 'flagged' | 'used', notes: string = '') => {
    try {
      setRefsBusy(true);
      await adminApi.patch(`/admin/payment-references/${id}`, { status, notes });
      await loadReferences(refsPage);
    } catch (e) {
      // ignore
    } finally {
      setRefsBusy(false);
    }
  };

  // Verified users helpers
  const loadVerifiedUsers = async (page: number = 1) => {
    try {
      setUsersBusy(true);
      const params = new URLSearchParams();
      params.append('page', page.toString());
      if (usersSearch) params.append('search', usersSearch);
      
      const res = await adminApi.get(`/admin/verified-users?${params.toString()}`);
      if (res.data?.success) {
        const pager = res.data.data;
        setVerifiedUsers(pager.data || []);
        setUsersPage(pager.current_page || 1);
        setUsersTotalPages(pager.last_page || 1);
      }
    } catch (e) {
      // swallow, show nothing
    } finally {
      setUsersBusy(false);
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  return (
    <div className="payment-management">
      <div className="admin-section-header">
        <h2>
          <i className="fas fa-credit-card"></i>
          Payment Management Center
        </h2>
        <p>Track and manage application fee payments</p>
      </div>

      {error && (
        <div className="error-alert">
          <i className="fas fa-exclamation-triangle"></i>
          {error}
        </div>
      )}

      {/* Payment Statistics */}
      {stats && (
        <div className="payment-stats">
          <div className="stat-card">
            <h4>Total Payments</h4>
            <span className="stat-value">{stats.total_payments}</span>
          </div>
          <div className="stat-card">
            <h4>Total Revenue</h4>
            <span className="stat-value revenue">{formatCurrency(stats.total_amount, 'MWK')}</span>
          </div>
          <div className="stat-card">
            <h4>Pending</h4>
            <span className="stat-value pending">{stats.pending_payments}</span>
          </div>
          <div className="stat-card">
            <h4>Completed</h4>
            <span className="stat-value completed">{stats.completed_payments}</span>
          </div>
          <div className="stat-card">
            <h4>Failed</h4>
            <span className="stat-value failed">{stats.failed_payments}</span>
          </div>
          <div className="stat-card">
            <h4>Refunded</h4>
            <span className="stat-value refunded">{stats.refunded_payments}</span>
          </div>
        </div>
      )}



      {/* Payment Reference Manager */}
      <div className="refs-section">
        <div className="section-header">
          <h3>Payment Reference Manager</h3>
          <div className="refs-actions">
            <label className="upload-btn">
              <input
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadCsv(f);
                  e.currentTarget.value = '';
                }}
              />
              <i className="fas fa-file-upload"></i> Upload CSV
            </label>
            <button className="btn-primary" onClick={() => loadReferences(1)} disabled={refsBusy}>
              <i className="fas fa-sync-alt"></i> Refresh
            </button>
          </div>
        </div>
        <p className="helper-text">CSV formats supported: a single column of references or a file with a header named <strong>reference</strong>. Each line is one reference number.</p>
        {refsMsg && <div className="success-alert">{refsMsg}</div>}

        <div className="refs-table-container">
          {refsBusy ? (
            <div className="loading-state">Processing...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Status</th>
                  <th>Used By</th>
                  <th>Used At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {(!refs || refs.length === 0) ? (
                  <tr><td colSpan={5} className="no-data">No references uploaded</td></tr>
                ) : refs.map((r: any) => (
                  <tr key={r.id}>
                    <td>{r.reference}</td>
                    <td>
                      <span className={`status-tag ${r.status}`}>{r.status}</span>
                    </td>
                    <td>{r.used_by_user_id || '—'}</td>
                    <td>{r.used_at ? new Date(r.used_at).toLocaleString() : '—'}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-approve" title="Mark Unused" onClick={() => updateReference(r.id, 'unused')}>
                          <i className="fas fa-undo"></i>
                        </button>
                        <button className="btn-view" title="Flag" onClick={() => updateReference(r.id, 'flagged')}>
                          <i className="fas fa-flag"></i>
                        </button>
                        <button className="btn-approve" title="Mark Used" onClick={() => updateReference(r.id, 'used')}>
                          <i className="fas fa-check"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="pager">
          <button className="btn-secondary" disabled={refsPage <= 1 || refsBusy} onClick={() => loadReferences(refsPage - 1)}>Prev</button>
          <span>Page {refsPage} / {refsTotalPages}</span>
          <button className="btn-secondary" disabled={refsPage >= refsTotalPages || refsBusy} onClick={() => loadReferences(refsPage + 1)}>Next</button>
        </div>
      </div>

      {/* Verified Users Section */}
      <div className="refs-section">
        <div className="section-header">
          <h3>Verified Payment Users</h3>
          <div className="refs-actions">
            <input
              type="text"
              placeholder="Search users..."
              value={usersSearch}
              onChange={(e) => {
                setUsersSearch(e.target.value);
                loadVerifiedUsers(1);
              }}
              className="search-input"
            />
            <button className="btn-primary" onClick={() => loadVerifiedUsers(1)} disabled={usersBusy}>
              <i className="fas fa-sync-alt"></i> Refresh
            </button>
          </div>
        </div>
        <p className="helper-text">Users who have successfully submitted applications with verified payment references.</p>

        <div className="refs-table-container">
          {usersBusy ? (
            <div className="loading-state">Loading verified users...</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Application ID</th>
                  <th>Payment Reference</th>
                  <th>Application Type</th>
                  <th>Status</th>
                  <th>Submitted At</th>
                </tr>
              </thead>
              <tbody>
                {(!verifiedUsers || verifiedUsers.length === 0) ? (
                  <tr><td colSpan={6} className="no-data">No verified users found</td></tr>
                ) : verifiedUsers.map((user: any) => (
                  <tr key={user.id}>
                    <td className="student-info">
                      <div className="student-name">{user.user.name}</div>
                      <div className="student-email">{user.user.email}</div>
                    </td>
                    <td>{user.application_id}</td>
                    <td className="transaction-id">{user.payment_reference}</td>
                    <td>
                      <span className="payment-method-badge">
                        {user.application_type?.toUpperCase() || 'UNKNOWN'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-tag ${user.status}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{new Date(user.submitted_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="pager">
          <button className="btn-secondary" disabled={usersPage <= 1 || usersBusy} onClick={() => loadVerifiedUsers(usersPage - 1)}>Prev</button>
          <span>Page {usersPage} / {usersTotalPages}</span>
          <button className="btn-secondary" disabled={usersPage >= usersTotalPages || usersBusy} onClick={() => loadVerifiedUsers(usersPage + 1)}>Next</button>
        </div>
      </div>






    </div>
  );
};

export default PaymentManagement; 