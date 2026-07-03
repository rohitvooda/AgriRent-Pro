import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const MainLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};
export default MainLayout;
