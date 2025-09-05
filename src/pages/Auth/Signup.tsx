import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import './Auth.css';

// Helper to map API errors to user-friendly messages for signup
const getSignupFriendlyError = (error: any, context: 'form' | 'google' | 'facebook') => {
  if (!error) return 'Something went wrong. Please try again.';
  
  const message = typeof error === 'string' ? error : error.message || 'Something went wrong. Please try again.';
  
  // Map common Laravel validation errors
  if (message.includes('email') && message.includes('taken')) {
    return 'An account already exists with this email.';
  }
  if (message.includes('email')) {
    return 'Please enter a valid email address.';
  }
  if (message.includes('password') && message.includes('characters')) {
    return 'Password must be at least 8 characters long.';
  }
  if (message.includes('password') && message.includes('confirmation')) {
    return 'Password confirmation does not match.';
  }
  if (message.includes('name')) {
    return 'Please enter your full name.';
  }
  if (message.includes('too many attempts')) {
    return 'Too many attempts. Please try again later.';
  }
  if (context === 'google' && message.includes('cancelled')) {
    return 'The Google sign-up was cancelled.';
  }
  if (context === 'facebook' && message.includes('cancelled')) {
    return 'The Facebook sign-up was cancelled.';
  }
  
  return message;
};

const Signup: React.FC = () => {
  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailExists, setEmailExists] = useState<boolean | null>(null);
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [loadingButton, setLoadingButton] = useState<'form' | 'google' | 'facebook' | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoadingButton('form');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      setLoadingButton(null);
      return;
    }

    try {
      const response = await AuthService.register({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        password_confirmation: confirmPassword
      });
      
      const { user } = response;
      
      // Clear any previous session data
      sessionStorage.clear();
      
      // Store user info in localStorage for legacy compatibility
      localStorage.setItem('currentUser', JSON.stringify({
        uid: user.id.toString(),
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
        photoURL: null
      }));

      // Set session timestamp
      localStorage.setItem('sessionTimestamp', Date.now().toString());

      // Determine redirect path based on user role
      let redirectPath = '/dashboard';
      if (user.roles?.includes('admin')) {
        redirectPath = '/admin';

      }
      
      // Prevent back button access to signup page
      window.history.replaceState(null, '', redirectPath);
      navigate(redirectPath, { replace: true });
    } catch (error: any) {
      setError(getSignupFriendlyError(error, 'form'));
    } finally {
      setLoading(false);
      setLoadingButton(null);
    }
  };

  // Google sign up handler
  const handleGoogleSignup = async () => {
    setLoading(true);
    setLoadingButton('google');
    setError('');
    
    try {
      await AuthService.loginWithGoogle();
      // The OAuth flow will redirect to Google and back to our callback
    } catch (error: any) {
      setError(getSignupFriendlyError(error, 'google'));
      setLoading(false);
      setLoadingButton(null);
    }
  };

  // Facebook sign up handler
  const handleFacebookSignup = async () => {
    setLoading(true);
    setLoadingButton('facebook');
    setError('');
    
    try {
      await AuthService.loginWithFacebook();
      // The OAuth flow will redirect to Facebook and back to our callback
    } catch (error: any) {
      setError(getSignupFriendlyError(error, 'facebook'));
      setLoading(false);
      setLoadingButton(null);
    }
  };

  return (
    <main className="page-content">
      <section className="auth-section">
        <div className="container">
          <div className="auth-container">
            <div className="auth-info">
              <h2>Join MUST E-Admission Portal</h2>
              <p>Create your account to start your application journey at Malawi University of Science and Technology</p>
              <ul>
                <li><i className="fas fa-check-circle"></i> Easy application process</li>
                <li><i className="fas fa-check-circle"></i> Track your admission status</li>
                <li><i className="fas fa-check-circle"></i> Secure document upload</li>
                <li><i className="fas fa-check-circle"></i> Real-time notifications</li>
              </ul>
            </div>
            
            <div className="auth-form">
              <h2>Create Account</h2>
              <p>Fill in your details to get started</p>
              
              {error && <div className="error-message">{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="form-control"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={async (e) => {
                      const value = e.target.value;
                      setEmail(value);
                      setEmailExists(null);
                      setError('');
                      if (value && /.+@.+\..+/.test(value)) {
                        setCheckingEmail(true);
                        try {
                          const exists = await AuthService.checkEmailExists(value);
                          setEmailExists(exists);
                          if (exists) {
                            setError('An account already exists with this email. Please sign in.');
                          }
                        } finally {
                          setCheckingEmail(false);
                        }
                      }
                    }}
                    className="form-control"
                    required
                  />
                  {checkingEmail && (
                    <small className="form-text" aria-live="polite">Checking email...</small>
                  )}
                  {emailExists === true && !checkingEmail && (
                    <div className="error-message" role="alert">This email is already registered. <Link to="/login">Sign in</Link> instead.</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    required
                    minLength={8}
                  />
                  <small className="form-text">Password must be at least 8 characters long</small>
                </div>
                
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="form-control"
                    required
                  />
                </div>
                
                <div className="terms-agreement">
                  <label className="checkbox-label">
                    <input 
                      type="checkbox" 
                      required 
                      style={{
                        width: '18px',
                        height: '18px',
                        accentColor: 'var(--primary)',
                        cursor: 'pointer'
                      }}
                    />
                    <span>
                      I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link>
                    </span>
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary btn-block"
                  disabled={loading || checkingEmail || emailExists === true}
                >
                  {loadingButton === 'form' ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>
              
              
              
              <div className="auth-footer">
                <p>Already have an account? <Link to="/login">Sign In</Link></p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Signup; 