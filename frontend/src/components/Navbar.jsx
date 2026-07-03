import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Tractor, LogOut, User as UserIcon, Calendar, ClipboardList, ShieldAlert } from 'lucide-react';

export const Navbar = () => {
  const { user, logoutUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/');
  };

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(255, 255, 255, 0.75)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.4)',
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '1rem 1.5rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800, fontSize: '1.4rem', color: 'var(--primary)' }}>
          <Tractor size={28} />
          <span>AgriRent <span style={{ color: 'var(--secondary-dark)' }}>Pro</span></span>
        </Link>

        {/* Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link to="/equipment" style={{ fontWeight: 500, color: 'var(--text-main)', transition: 'color 0.2s' }}>
            Browse Equipment
          </Link>

          {isAuthenticated ? (
            <>
              {user?.role === 'farmer' && (
                <Link to="/farmer-dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                  <Calendar size={18} />
                  <span>Farmer Panel</span>
                </Link>
              )}
              {user?.role === 'owner' && (
                <Link to="/owner-dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                  <ClipboardList size={18} />
                  <span>Owner Panel</span>
                </Link>
              )}
              {user?.role === 'admin' && (
                <Link to="/admin-dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500, color: '#dc2626' }}>
                  <ShieldAlert size={18} />
                  <span>Admin Panel</span>
                </Link>
              )}

              <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 500 }}>
                <UserIcon size={18} />
                <span>Profile</span>
              </Link>

              <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem' }}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
