import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { User, Mail, Phone, MapPin, Shield, Edit2, CheckCircle } from 'lucide-react';

export const Profile = () => {
  const { user, updateUserProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSubmitting(true);

    try {
      const response = await api.put('/users/profile', {
        name,
        phone,
        address
      });
      updateUserProfile(response.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      setError('Failed to update profile information. Please verify details.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: '650px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Header */}
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Account Profile</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your personal details and contact address</p>
        </div>

        {/* Form Container */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50px', backgroundColor: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <User size={30} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{user?.name}</h3>
              <span className={`badge badge-${user?.role === 'admin' ? 'completed' : user?.role === 'owner' ? 'approved' : 'pending'}`}>
                {user?.role} Account
              </span>
            </div>
          </div>

          {/* Success Banner */}
          {success && (
            <div style={{ backgroundColor: '#dcfce7', border: '1px solid #bbf7d0', color: '#15803d', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', gap: '0.5rem', fontSize: '0.9rem', alignItems: 'center' }}>
              <CheckCircle size={18} />
              <span>Profile updated successfully!</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="profile-name">Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  id="profile-name"
                  type="text" 
                  className="form-control" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                  required
                />
              </div>
            </div>

            {/* Email (Readonly) */}
            <div className="form-group">
              <label htmlFor="profile-email">Email Address (Cannot change)</label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  id="profile-email"
                  type="email" 
                  className="form-control" 
                  value={user?.email || ''} 
                  style={{ paddingLeft: '2.5rem', backgroundColor: '#e2e8f0', color: 'var(--text-muted)', cursor: 'not-allowed' }}
                  disabled
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="profile-phone">Phone Number</label>
              <div style={{ position: 'relative' }}>
                <Phone size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  id="profile-phone"
                  type="tel" 
                  className="form-control" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label htmlFor="profile-addr">Village Address</label>
              <div style={{ position: 'relative' }}>
                <MapPin size={18} style={{ position: 'absolute', left: '0.75rem', top: '12px', color: 'var(--text-muted)' }} />
                <textarea 
                  id="profile-addr"
                  className="form-control" 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  style={{ paddingLeft: '2.5rem', minHeight: '80px', resize: 'vertical' }}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', padding: '0.85rem', display: 'flex', gap: '0.5rem' }}
              disabled={submitting}
            >
              <Edit2 size={16} />
              {submitting ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>

        </div>

      </div>
    </DashboardLayout>
  );
};
export default Profile;
