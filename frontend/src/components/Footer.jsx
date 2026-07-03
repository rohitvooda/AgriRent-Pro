import React from 'react';

export const Footer = () => {
  return (
    <footer style={{
      background: 'rgba(15, 23, 42, 0.95)',
      color: '#94a3b8',
      padding: '3rem 1.5rem 1.5rem',
      marginTop: 'auto',
      borderTop: '1px solid #1e293b'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2.5rem',
        marginBottom: '3rem'
      }}>
        <div>
          <h3 style={{ color: 'white', marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 700 }}>🌾 AgriRent Pro</h3>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
            Connecting farmers with agricultural machinery owners to improve crop productivity, minimize waste, and generate passive rental income.
          </p>
        </div>
        <div>
          <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>Quick Links</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
            <li><a href="/equipment" style={{ hover: { color: 'white' } }}>Find Equipment</a></li>
            <li><a href="/register">List Equipment (Owners)</a></li>
            <li><a href="/login">Farmer Portal</a></li>
          </ul>
        </div>
        <div>
          <h4 style={{ color: 'white', marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>Contact Support</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
            <li>Email: support@agrirentpro.com</li>
            <li>Helpline: +91 1800-420-RENT</li>
            <li>Address: GreenFields Inc., New Delhi, India</li>
          </ul>
        </div>
      </div>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        paddingTop: '1.5rem',
        borderTop: '1px solid #334155',
        textAlign: 'center',
        fontSize: '0.85rem'
      }}>
        <p>&copy; {new Date().getFullYear()} AgriRent Pro. All rights reserved. Helping farmers harvest success.</p>
      </div>
    </footer>
  );
};
export default Footer;
