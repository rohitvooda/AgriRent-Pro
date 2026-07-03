import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../hooks/useAuth';
import { UserPlus, Mail, Lock, User, Phone, MapPin, AlertCircle } from 'lucide-react';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('farmer'); // Default: farmer
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const profile = await registerUser({
        email,
        password,
        name,
        role,
        phone,
        address
      });
      
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
        'Registration failed. Please make sure your inputs are valid.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div style={{ maxWidth: '500px', margin: '2rem auto', width: '100%' }}>
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
              <UserPlus size={24} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Create Account</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>Join AgriRent Pro platform today</p>
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
            
            {/* Role selection */}
            <div className="form-group">
              <label>Select User Type</label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                <label style={{ 
                  flex: 1, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem', 
                  borderRadius: '8px', 
                  border: '1px solid ' + (role === 'farmer' ? 'var(--primary-light)' : 'var(--border)'),
                  backgroundColor: role === 'farmer' ? 'rgba(34, 197, 94, 0.05)' : 'white',
                  cursor: 'pointer',
                  fontWeight: 600
                }}>
                  <input 
                    type="radio" 
                    name="role" 
                    value="farmer" 
                    checked={role === 'farmer'} 
                    onChange={() => setRole('farmer')} 
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  Farmer
                </label>

                <label style={{ 
                  flex: 1, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem', 
                  borderRadius: '8px', 
                  border: '1px solid ' + (role === 'owner' ? 'var(--primary-light)' : 'var(--border)'),
                  backgroundColor: role === 'owner' ? 'rgba(34, 197, 94, 0.05)' : 'white',
                  cursor: 'pointer',
                  fontWeight: 600
                }}>
                  <input 
                    type="radio" 
                    name="role" 
                    value="owner" 
                    checked={role === 'owner'} 
                    onChange={() => setRole('owner')} 
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  Equipment Owner
                </label>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  id="name"
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Suresh Kumar" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>

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

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  id="phone"
                  type="tel" 
                  className="form-control" 
                  placeholder="e.g. +91 98765 43210" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Village Address</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '0.75rem', top: '12px', color: 'var(--text-muted)' }} />
                <textarea 
                  id="address"
                  className="form-control" 
                  placeholder="Village name, district, state..." 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ paddingLeft: '2.5rem', minHeight: '80px', resize: 'vertical' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label htmlFor="password">Create Password (min 6 chars)</label>
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
                  minLength={6}
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
              {submitting ? 'Registering...' : 'Register Account'}
            </button>
          </form>

          {/* Login Link */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};
export default Register;
