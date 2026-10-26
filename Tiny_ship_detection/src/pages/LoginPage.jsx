import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, Check } from 'lucide-react';

export default function LoginPage() {
  const { isLoggedIn, login } = useApp();
  const navigate = useNavigate();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('jahnavi@example.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to /home
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/home', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const validate = () => {
    if (!email.trim()) {
      setError('Please enter your email address.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (!password) {
      setError('Please enter your password.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      login(email);
      setLoading(false);
      navigate('/home');
    }, 600);
  };

  const handleGoogleLogin = () => {
    login('jahnavi@example.com');
    navigate('/home');
  };

  return (
    <div className="login-wrapper">
      <div className="login-bg-overlay" />
      
      <div className="login-top-bar">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} />
          <span>Back to Landing Page</span>
        </Link>
      </div>

      <div className="login-card-container">
        <div className="login-card">
          {/* Logo & Header matching Reference Image 2 */}
          <div className="login-header">
            <div className="login-logo-box">
              <img src="/radar-icon.svg" alt="ShipDetect AI" className="login-logo-img" />
              <span className="login-brand-title">ShipDetect <span className="text-cyan">AI</span></span>
            </div>
            <h1 className="login-heading">{isRegisterMode ? 'Create Account' : 'Welcome Back'}</h1>
            <p className="login-subheading">
              {isRegisterMode 
                ? 'Sign up to start detecting small vessels in satellite imagery' 
                : 'Login to your account to continue'}
            </p>
          </div>

          {error && (
            <div className="login-error-alert">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="email-input">Email Address</label>
              <div className="input-with-icon">
                <Mail size={16} className="input-icon" />
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="form-input has-icon"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password-input">Password</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input
                  id="password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="form-input has-icon has-trailing"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="input-trailing-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {!isRegisterMode && (
              <div className="login-options-row">
                <label className="remember-checkbox">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember Me</span>
                </label>
                <button 
                  type="button" 
                  className="forgot-link"
                  onClick={() => setError('For demo access, any email and 6+ character password will log in!')}
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button 
              type="submit" 
              className="btn btn-primary login-submit-btn" 
              disabled={loading}
            >
              {loading ? 'Authenticating...' : (isRegisterMode ? 'Create Account' : 'Login')}
            </button>

            <div className="toggle-auth-row">
              <span>{isRegisterMode ? 'Already have an account?' : "Don't have an account?"}</span>
              <button
                type="button"
                className="toggle-auth-btn"
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setError('');
                }}
              >
                {isRegisterMode ? 'Login' : 'Create Account'}
              </button>
            </div>

            <div className="or-divider">
              <span>or continue with</span>
            </div>

            <button
              type="button"
              className="google-btn"
              onClick={handleGoogleLogin}
            >
              <svg className="google-icon" viewBox="0 0 24 24" width="18" height="18">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google</span>
            </button>
          </form>

          <div className="login-footer-hint">
            <ShieldCheck size={14} className="text-cyan" />
            <span>Academic demo: Default account prefilled</span>
          </div>
        </div>
      </div>

      <style>{`
        .login-wrapper {
          min-height: 100vh;
          position: relative;
          background: url('/images/hero_ocean.svg') center center / cover no-repeat;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
        }

        .login-bg-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(4, 19, 33, 0.85) 0%, rgba(4, 19, 33, 0.96) 100%);
        }

        .login-top-bar {
          position: absolute;
          top: 24px;
          left: 24px;
          z-index: 10;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: var(--text-secondary);
          transition: color 0.2s ease;
        }

        .back-link:hover {
          color: var(--primary-cyan);
        }

        .login-card-container {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 440px;
        }

        .login-card {
          background: rgba(9, 36, 58, 0.85);
          backdrop-filter: blur(16px);
          border: 1px solid var(--border-highlight);
          border-radius: var(--radius-xl);
          padding: 36px 32px;
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.6), var(--shadow-glow);
        }

        .login-header {
          text-align: center;
          margin-bottom: 24px;
        }

        .login-logo-box {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }

        .login-logo-img {
          width: 36px;
          height: 36px;
        }

        .login-brand-title {
          font-size: 20px;
          font-weight: 700;
        }

        .login-heading {
          font-size: 22px;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .login-subheading {
          font-size: 13px;
          color: var(--text-secondary);
        }

        .login-error-alert {
          background: rgba(255, 69, 69, 0.15);
          border: 1px solid rgba(255, 69, 69, 0.4);
          color: var(--detection-red);
          padding: 10px 14px;
          border-radius: var(--radius-md);
          font-size: 12px;
          margin-bottom: 16px;
          text-align: center;
        }

        .input-with-icon {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .has-icon {
          padding-left: 40px;
        }

        .has-trailing {
          padding-right: 40px;
        }

        .input-trailing-btn {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }

        .input-trailing-btn:hover {
          color: var(--primary-cyan);
        }

        .login-options-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          font-size: 12px;
        }

        .remember-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .remember-checkbox input {
          accent-color: var(--primary-cyan);
          cursor: pointer;
        }

        .forgot-link {
          background: none;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          transition: color 0.2s ease;
        }

        .forgot-link:hover {
          color: var(--primary-cyan);
        }

        .login-submit-btn {
          width: 100%;
          padding: 11px;
          font-size: 14px;
          margin-bottom: 18px;
        }

        .toggle-auth-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 12.5px;
          color: var(--text-secondary);
          margin-bottom: 20px;
        }

        .toggle-auth-btn {
          background: none;
          border: none;
          color: var(--primary-cyan);
          font-weight: 600;
          cursor: pointer;
        }

        .toggle-auth-btn:hover {
          text-decoration: underline;
        }

        .or-divider {
          position: relative;
          text-align: center;
          margin-bottom: 20px;
        }

        .or-divider::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          right: 0;
          height: 1px;
          background: var(--border-color);
        }

        .or-divider span {
          position: relative;
          background: rgba(9, 36, 58, 0.95);
          padding: 0 12px;
          font-size: 11px;
          color: var(--text-muted);
          text-transform: uppercase;
        }

        .google-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 10px;
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .google-btn:hover {
          border-color: var(--primary-cyan);
          background: var(--bg-hover);
        }

        .login-footer-hint {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 24px;
          font-size: 11px;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
