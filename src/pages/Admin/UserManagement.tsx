import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserManagement.css';

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

interface User {
  id: number;
  name: string;
  email: string;
  role_names: string[];
  created_at: string;
  status: 'active' | 'inactive';
  last_login: string;
}

interface UserFormData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [formData, setFormData] = useState<UserFormData>({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    loadUsers();
  }, [searchTerm, roleFilter, statusFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (roleFilter) params.append('role', roleFilter);
      if (statusFilter) params.append('status', statusFilter);
      params.append('sort_by', 'created_at');
      params.append('sort_direction', 'desc');
      
      const response = await adminApi.get(`/admin/users?${params.toString()}`);

      if (response.data.success) {
        setUsers(response.data.data.data || []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      await adminApi.post('/admin/users', formData);

      setFormData({ name: '', email: '', password: '', role: 'user' });
      setShowCreateForm(false);
      loadUsers();
    } catch (error: any) {
      console.error('Error creating user:', error);
      setError(error.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: number, newRole: 'admin' | 'user') => {
    try {
      await adminApi.put(`/admin/users/${userId}/role`, {
        role: newRole
      });

      loadUsers();
    } catch (error: any) {
      console.error('Error updating user role:', error);
      setError(error.response?.data?.message || 'Failed to update user role');
    }
  };

  const deleteUser = async (userId: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await adminApi.delete(`/admin/users/${userId}`);

      loadUsers();
    } catch (error: any) {
      console.error('Error deleting user:', error);
      setError(error.response?.data?.message || 'Failed to delete user');
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="user-management">
      <div className="admin-section-header">
        <h2>
          <i className="fas fa-users-cog"></i>
          User Management
        </h2>
        <p>Manage system users and their permissions</p>
      </div>

      {error && (
        <div className="error-alert">
          <i className="fas fa-exclamation-triangle"></i>
          {error}
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="user-controls">
        <div className="search-filters">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">User</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button 
          className="btn-primary"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          <i className="fas fa-user-plus"></i>
          Add New User
        </button>
      </div>

      {/* Create User Form */}
      {showCreateForm && (
        <div className="create-user-form">
          <h3>Create New User</h3>
          <form onSubmit={createUser}>
            <div className="form-grid">
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={8}
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create User'}
              </button>
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="users-table-container">
        {loading ? (
          <div className="loading-state">Loading users...</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Roles</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="no-data">No users found</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id}>
                    <td className="user-name">{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <div className="role-badges">
                        {user.role_names.map(role => (
                          <span key={role} className={`role-badge role-${role}`}>
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className={`status-tag ${user.status}`}>
                        {user.status}
                      </span>
                    </td>
                    <td>{user.last_login}</td>
                    <td>{formatDate(user.created_at)}</td>
                    <td>
                      <div className="action-buttons">
                        <select
                          onChange={(e) => updateUserRole(user.id, e.target.value as 'admin' | 'user')}
                          value={user.role_names[0] || 'user'}
                          className="role-selector"
                          title="Change Role"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button 
                          className="btn-reject"
                          onClick={() => deleteUser(user.id)}
                          title="Delete User"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* User Stats Summary */}
      <div className="user-stats">
        <div className="stat-card">
          <h4>Total Users</h4>
          <span className="stat-value">{users.length}</span>
        </div>
        <div className="stat-card">
          <h4>Active Users</h4>
          <span className="stat-value">{users.filter(u => u.status === 'active').length}</span>
        </div>
        <div className="stat-card">
          <h4>Admins</h4>
          <span className="stat-value">{users.filter(u => u.role_names.includes('admin')).length}</span>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
