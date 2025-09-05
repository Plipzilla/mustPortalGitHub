import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';

const OAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthData } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');
        const errorParam = searchParams.get('error');

        if (errorParam) {
          setError(decodeURIComponent(errorParam));
          setLoading(false);
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 3000);
          return;
        }

        if (token && userParam) {
          const user = JSON.parse(decodeURIComponent(userParam));
          
          // Store auth data
          localStorage.setItem('token', token);
          localStorage.setItem('user', JSON.stringify(user));
          
          // Update auth context
          setAuthData(user, token);

          // Determine redirect path based on user role
          let redirectPath = '/dashboard';
          const hasAdminRole = user.roles?.some((role: any) => role.name === 'admin' || role === 'admin');
          
          if (hasAdminRole) {
            redirectPath = '/admin';
            localStorage.setItem('admin_login_intent', 'true');
          } else {
            localStorage.removeItem('admin_login_intent');
          }

          // Redirect to appropriate dashboard
          navigate(redirectPath, { replace: true });
        } else {
          setError('Invalid OAuth callback parameters');
          setLoading(false);
          setTimeout(() => {
            navigate('/login', { replace: true });
          }, 3000);
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        setError('OAuth authentication failed');
        setLoading(false);
        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 3000);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate, setAuthData]);

  if (loading) {
    return (
      <main className="page-content">
        <section className="auth-section">
          <div className="container">
            <div className="auth-container" style={{ justifyContent: 'center' }}>
              <div className="auth-form" style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <div className="loading-spinner" style={{ 
                    width: '40px', 
                    height: '40px', 
                    margin: '0 auto 1rem auto',
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid var(--primary)',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                </div>
                <h3>Completing sign in...</h3>
                <p>Please wait while we complete your authentication.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-content">
        <section className="auth-section">
          <div className="container">
            <div className="auth-container" style={{ justifyContent: 'center' }}>
              <div className="auth-form" style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ 
                  color: 'var(--danger)', 
                  backgroundColor: 'rgba(220, 38, 38, 0.1)',
                  padding: '1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}>
                  <h3>Authentication Error</h3>
                  <p>{error}</p>
                </div>
                <p>Redirecting to login page...</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return null;
};

export default OAuthCallback; 