import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LayoutDashboard, Tractor, Calendar, DollarSign, User, ShieldAlert, ChevronRight } from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getLinks = () => {
    if (user?.role === 'owner') {
      return [
        { path: '/owner-dashboard', label: 'Overview', icon: <LayoutDashboard size={20} /> },
        { path: '/equipment', label: 'Browse Listings', icon: <Tractor size={20} /> },
        { path: '/profile', label: 'My Profile', icon: <User size={20} /> },
      ];
    } else if (user?.role === 'admin') {
      return [
        { path: '/admin-dashboard', label: 'Admin Metrics', icon: <ShieldAlert size={20} /> },
        { path: '/equipment', label: 'Manage listings', icon: <Tractor size={20} /> },
        { path: '/profile', label: 'My Profile', icon: <User size={20} /> },
      ];
    } else {
      // Farmer
      return [
        { path: '/farmer-dashboard', label: 'Bookings List', icon: <Calendar size={20} /> },
        { path: '/equipment', label: 'Search Equipment', icon: <Tractor size={20} /> },
        { path: '/profile', label: 'My Profile', icon: <User size={20} /> },
      ];
    }
  };

  const links = getLinks();

  return (
    <aside style={{
      background: 'rgba(255, 255, 255, 0.7)',
      backdropFilter: 'blur(10px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.4)',
      padding: '2rem 1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    }}>
      <div>
        <h4 style={{ textTransform: 'uppercase', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '1rem' }}>
          Navigation
        </h4>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  color: isActive ? 'var(--primary)' : 'var(--text-main)',
                  backgroundColor: isActive ? 'rgba(34, 197, 94, 0.1)' : 'transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {link.icon}
                  <span>{link.label}</span>
                </div>
                {isActive && <ChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div style={{ marginTop: 'auto', padding: '1rem', borderRadius: '8px', backgroundColor: 'rgba(15, 80, 61, 0.05)', border: '1px dashed rgba(21, 128, 61, 0.2)' }}>
        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.25rem' }}>Logged in as:</p>
        <p style={{ fontSize: '0.9rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</p>
        <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Role: {user?.role}</p>
      </div>
    </aside>
  );
};
export default Sidebar;
