import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { Tractor, ShieldCheck, CreditCard, ChevronRight } from 'lucide-react';

export const Home = () => {
  return (
    <MainLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem', paddingBottom: '3rem' }}>
        
        {/* Hero Section */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: '2.5rem',
          alignItems: 'center',
          padding: '3rem 0',
        }}>
          <div>
            <h1 style={{
              fontSize: '3.5rem',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '1.5rem',
              color: 'var(--text-main)'
            }}>
              Access Modern <span style={{ color: 'var(--primary)' }}>Farming Equipment</span> On Demand
            </h1>
            <p style={{
              fontSize: '1.2rem',
              color: 'var(--text-muted)',
              marginBottom: '2rem',
              lineHeight: 1.6
            }}>
              AgriRent Pro connects small-scale farmers with equipment owners, offering affordable tractors, harvesters, seed drills, and rotavators with online scheduling and transparent pricing.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/equipment" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
                Find Equipment <ChevronRight size={20} />
              </Link>
              <Link to="/register" className="btn btn-secondary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
                List Your Machinery
              </Link>
            </div>
          </div>
          
          {/* Hero Image */}
          <div style={{
            height: '420px',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-lg)',
            border: '8px solid white'
          }}>
            <img 
              src="https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80" 
              alt="Farming machinery tractor" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
        </section>

        {/* Benefits Section */}
        <section style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '3rem' }}>Why Choose AgriRent Pro?</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            <div className="glass-card" style={{ padding: '2.5rem 2rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50px', backgroundColor: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                <Tractor size={32} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem' }}>Verified Machinery</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Access a wide range of reliable agricultural tools listed by verified local owners, ready for field deployment.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2.5rem 2rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50px', backgroundColor: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                <ShieldCheck size={32} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem' }}>Secure Bookings</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                Our automated calendar prevention checks ensure that equipment is never double-booked, offering you absolute reliability.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2.5rem 2rem' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50px', backgroundColor: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '1.5rem' }}>
                <CreditCard size={32} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem' }}>Transparent Payments</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                View complete pricing details upfront with no hidden transaction fees. Securely pay online after owner approval.
              </p>
            </div>
          </div>
        </section>

      </div>
    </MainLayout>
  );
};
export default Home;
