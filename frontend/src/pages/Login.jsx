import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, LogIn, UserCheck } from 'lucide-react';

const Login = () => {
  const { login, showToast } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      // Fetch user profile from localStorage to see role and navigate appropriately
      const profile = JSON.parse(localStorage.getItem('user'));
      if (profile.role === 'instructor') {
        navigate('/instructor');
      } else {
        navigate('/dashboard');
      }
    }
  };

  // Quick fill logins helper
  const handleQuickLogin = async (type) => {
    setLoading(true);
    let targetEmail = '';
    let targetPassword = 'password123';

    if (type === 'student') {
      targetEmail = 'student@edusphere.com';
    } else if (type === 'instructor') {
      targetEmail = 'instructor@edusphere.com';
    }

    setEmail(targetEmail);
    setPassword(targetPassword);

    const result = await login(targetEmail, targetPassword);
    setLoading(false);

    if (result.success) {
      if (type === 'instructor') {
        navigate('/instructor');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '40px 24px' }}>
      <div className="card" style={{
        width: '100%',
        maxWidth: '440px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--glass-border)',
        borderRadius: 'var(--border-radius-lg)',
        padding: '40px 30px',
        boxShadow: 'var(--shadow-lg)'
      }}>
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '8px', fontFamily: 'var(--font-title)' }}>
            Welcome Back
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            Sign in to access your dashboard and continue studying.
          </p>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '44px' }}
                required
              />
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label className="form-label" style={{ margin: 0 }}>Password</label>
              <a href="#" style={{ fontSize: '12px', color: 'var(--accent)' }}>Forgot Password?</a>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                style={{ paddingLeft: '44px' }}
                required
              />
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', marginBottom: '24px' }}>
            {loading ? 'Authenticating...' : <><LogIn size={16} /> Sign In</>}
          </button>
        </form>

        {/* Quick Logins for testing */}
        <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '24px', marginBottom: '24px' }}>
          <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '14px', fontWeight: '600', letterSpacing: '0.5px' }}>
            DEMO QUICK LOGINS
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => handleQuickLogin('student')}
              disabled={loading}
              className="btn btn-outline btn-sm"
              style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', padding: '10px' }}
            >
              <UserCheck size={14} color="var(--accent)" /> Demo Student
            </button>
            <button
              onClick={() => handleQuickLogin('instructor')}
              disabled={loading}
              className="btn btn-outline btn-sm"
              style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', padding: '10px' }}
            >
              <UserCheck size={14} color="var(--success)" /> Demo Instructor
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div style={{ textAlign: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Sign Up</Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
