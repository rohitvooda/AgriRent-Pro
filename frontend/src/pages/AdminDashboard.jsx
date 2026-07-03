import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import api from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatDate';
import { Loader2, Users, ShieldAlert, BarChart3, TrendingUp, UserCheck } from 'lucide-react';

export const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      // Fetch dashboard metrics
      const dashboardRes = await api.get('/admin/dashboard');
      setMetrics(dashboardRes.data.metrics);
      setRecentBookings(dashboardRes.data.recent_bookings);
      
      // Fetch users list
      const usersRes = await api.get('/admin/users');
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve administrative metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleRoleChange = async (userId, currentRole) => {
    const newRole = currentRole === 'farmer' ? 'owner' : currentRole === 'owner' ? 'admin' : 'farmer';
    if (!window.confirm(`Update user role to '${newRole.toUpperCase()}'?`)) return;
    
    try {
      await api.put(`/admin/users/${userId}/role?role=${newRole}`);
      fetchAdminData(); // Reload data
    } catch (err) {
      alert('Failed to update user role.');
    }
  };

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Title */}
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Admin Console</h1>
          <p style={{ color: 'var(--text-muted)' }}>Platform administrative metrics, user accounts, and booking statistics</p>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '1rem', color: 'var(--primary)' }}>
            <Loader2 size={40} className="spin" style={{ animation: 'spin 1.5s linear infinite' }} />
            <span style={{ fontWeight: 600 }}>Loading admin metrics...</span>
          </div>
        ) : error ? (
          <div style={{ color: '#b91c1c', fontWeight: 600, textAlign: 'center', padding: '3rem' }}>
            {error}
          </div>
        ) : (
          <>
            {/* Metrics cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
              <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '8px', backgroundColor: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <Users size={22} />
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL FARMERS</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>{metrics?.total_farmers}</span>
                </div>
              </div>

              <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '8px', backgroundColor: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <UserCheck size={22} />
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL OWNERS</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>{metrics?.total_owners}</span>
                </div>
              </div>

              <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '8px', backgroundColor: 'rgba(234, 179, 8, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary-dark)' }}>
                  <BarChart3 size={22} />
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>ACTIVE LISTINGS</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800 }}>{metrics?.total_listings}</span>
                </div>
              </div>

              <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '8px', backgroundColor: 'rgba(21, 128, 61, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                  <TrendingUp size={22} />
                </div>
                <div>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>PLATFORM REVENUE</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>{formatCurrency(metrics?.total_revenue)}</span>
                </div>
              </div>
            </div>

            {/* Split view: Users vs Bookings */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
              
              {/* Users management */}
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={18} /> Registered Users
                </h3>
                
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Name</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Email</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Role</th>
                        <th style={{ padding: '0.75rem 0.5rem' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>{u.name}</td>
                          <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>{u.email}</td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <span className={`badge badge-${u.role === 'admin' ? 'completed' : u.role === 'owner' ? 'approved' : 'pending'}`}>
                              {u.role}
                            </span>
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>
                            <button 
                              onClick={() => handleRoleChange(u.id, u.role)} 
                              className="btn btn-secondary" 
                              style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                            >
                              Toggle Role
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="glass-card" style={{ padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldAlert size={18} /> Recent Bookings
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {recentBookings.map(b => (
                    <div key={b.id} style={{ padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(b.created_at)}</span>
                        <h4 style={{ fontWeight: 700, fontSize: '0.95rem', margin: '0.15rem 0' }}>{b.equipment_name}</h4>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Farmer: {b.farmer_name}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ display: 'block', fontWeight: 700, color: 'var(--primary)' }}>{formatCurrency(b.total_price)}</span>
                        <span className={`badge badge-${b.status}`} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', marginTop: '0.25rem' }}>{b.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </>
        )}

      </div>
    </DashboardLayout>
  );
};
export default AdminDashboard;
