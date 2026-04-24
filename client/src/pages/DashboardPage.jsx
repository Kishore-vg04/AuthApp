import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const STATS = [
  { label: 'Account Status', value: 'Active', icon: '✅' },
  { label: 'Member Since', value: null, icon: '📅' },
  { label: 'Security', value: 'JWT Secured', icon: '🔐' },
  { label: 'Database', value: 'MongoDB', icon: '🗄️' },
];

export default function DashboardPage() {
  const { user } = useAuth();

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Today';

  const stats = STATS.map((s) =>
    s.label === 'Member Since' ? { ...s, value: memberSince } : s
  );

  return (
    <div className="page-container">
      <div className="dashboard-hero">
        <div className="avatar-large">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} />
          ) : (
            <span>{user?.name?.[0]?.toUpperCase() || 'U'}</span>
          )}
        </div>
        <div>
          <h1>Welcome, {user?.name}! 👋</h1>
          <p className="text-muted">{user?.email}</p>
          {!user?.isEmailVerified && (
            <span className="badge badge-warning">Email not verified</span>
          )}
          {user?.isEmailVerified && (
            <span className="badge badge-success">Verified ✓</span>
          )}
        </div>
      </div>

      {user?.bio && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <p className="text-muted" style={{ margin: 0 }}>{user.bio}</p>
        </div>
      )}

      <div className="stats-grid">
        {stats.map(({ label, value, icon }) => (
          <div key={label} className="stat-card">
            <span className="stat-icon">{icon}</span>
            <div>
              <p className="stat-value">{value}</p>
              <p className="stat-label">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>Quick Actions</h2>
        <div className="quick-actions">
          <Link to="/profile" className="btn btn-outline">
            ✏️ Edit Profile
          </Link>
          <Link to="/profile?tab=security" className="btn btn-outline">
            🔒 Change Password
          </Link>
        </div>
      </div>

      <div className="card tech-stack">
        <h2>Tech Stack</h2>
        <div className="tech-badges">
          {['MongoDB', 'Express.js', 'React', 'Node.js', 'JWT', 'bcrypt'].map((t) => (
            <span key={t} className="tech-badge">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
