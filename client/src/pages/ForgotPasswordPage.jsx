import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');

    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="auth-page">
        <div className="auth-card text-center">
          <div className="success-icon">✉️</div>
          <h2>Check your inbox</h2>
          <p>If an account with <strong>{email}</strong> exists, we&apos;ve sent a password reset link. Check your spam folder too.</p>
          <Link to="/login" className="btn btn-primary btn-full" style={{ marginTop: '1.5rem' }}>
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Forgot password?</h1>
          <p>Enter your email and we&apos;ll send you a reset link.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? <Spinner /> : 'Send Reset Link'}
          </button>
        </form>

        <p className="auth-footer">
          <Link to="/login">← Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
