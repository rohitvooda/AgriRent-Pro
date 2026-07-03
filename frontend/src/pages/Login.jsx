import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../hooks/useAuth';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    
    try {
      const profile = await loginUser(email, password);
      
      // Redirect based on role
      if (profile.role === 'admin') {
        navigate('/admin-dashboard');
      } else if (profile.role === 'owner') {
        navigate('/owner-dashboard');
      } else {
        navigate('/farmer-dashboard');
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || 
        'Login failed. Please verify your email and password credentials.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: '450px', margin: '4rem auto', width: '100%' }}>
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ 
              width: '50px', 
              height: '50px', 
              borderRadius: '50px', 
              backgroundColor: 'rgba(34, 197, 94, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'var(--primary)',
              margin: '0 auto 1rem'
            }}>
              <LogIn size={24} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Welcome Back</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Log in to access your dashboard</p>
          </div>

          {/* Error Banner */}
          {error && (
            <div style={{ 
              backgroundColor: '#fee2e2', 
              border: '1px solid #fecaca', 
              color: '#991b1b', 
              padding: '0.75rem 1rem', 
              borderRadius: '8px', 
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  id="email"
                  type="email" 
                  className="form-control" 
                  placeholder="name@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label htmlFor="password">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  id="password"
                  type="password" 
                  className="form-control" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '0.85rem' }}
              disabled={submitting}
            >
              {submitting ? 'Logging in...' : 'Sign In'}
            </button>
          </form>

          {/* Register Link */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Register Here
            </Link>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};
export default Login;
