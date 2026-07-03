import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import SearchBar from '../components/SearchBar';
import EquipmentCard from '../components/EquipmentCard';
import { getAllEquipment } from '../services/equipment';
import { Loader2, Tractor } from 'lucide-react';

export const Equipment = () => {
  const [equipmentList, setEquipmentList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEquipment = async (filters = {}) => {
    setLoading(true);
    setError('');
    try {
      const data = await getAllEquipment(filters);
      setEquipmentList(data);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve equipment listings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const handleSearch = (filters) => {
    fetchEquipment(filters);
  };

  return (
    <MainLayout>
      <div style={{ paddingBottom: '3rem' }}>
        
        {/* Title Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Search Agricultural Machinery</h1>
          <p style={{ color: 'var(--text-muted)' }}>Browse, filter, and choose the best tools for your agricultural needs</p>
        </div>

        {/* Search filter form */}
        <SearchBar onSearch={handleSearch} />

        {/* Grid list of cards */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '1rem', color: 'var(--primary)' }}>
            <Loader2 size={40} className="spin" style={{ animation: 'spin 1.5s linear infinite' }} />
            <span style={{ fontWeight: 600 }}>Loading machinery listings...</span>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#b91c1c', fontWeight: 600 }}>
            {error}
          </div>
        ) : equipmentList.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
            <Tractor size={48} style={{ margin: '0 auto 1rem', color: 'var(--text-muted)', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>No Machinery Found</h3>
            <p style={{ marginTop: '0.25rem' }}>Try adjusting your filters or search term to discover other options.</p>
          </div>
        ) : (
          <div className="grid-container">
            {equipmentList.map((equipment) => (
              <EquipmentCard key={equipment.id} equipment={equipment} />
            ))}
          </div>
        )}

      </div>
    </MainLayout>
  );
};
export default Equipment;
