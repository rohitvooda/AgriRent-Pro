import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';

export const DashboardLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <div className="dashboard-grid" style={{ flex: 1 }}>
        <Sidebar />
        <main style={{ padding: '2rem 2.5rem', backgroundColor: '#f8fafc' }}>
          <div className="animated-fade">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
export default DashboardLayout;
