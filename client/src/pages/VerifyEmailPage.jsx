import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import Spinner from '../components/Spinner';

export default function VerifyEmailPage() {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    api
      .get(`/auth/verify-email/${token}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div className="auth-page">
      <div className="auth-card text-center">
        {status === 'loading' && (
          <>
            <Spinner />
            <p>Verifying your email…</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="success-icon">✅</div>
            <h2>Email Verified!</h2>
            <p>Your email has been successfully verified.</p>
            <Link to="/dashboard" className="btn btn-primary btn-full" style={{ marginTop: '1rem' }}>
              Go to Dashboard
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="success-icon">❌</div>
            <h2>Verification Failed</h2>
            <p>The link is invalid or has expired. Please request a new one.</p>
            <Link to="/dashboard" className="btn btn-outline btn-full" style={{ marginTop: '1rem' }}>
              Go to Dashboard
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
