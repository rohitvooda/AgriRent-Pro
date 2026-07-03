import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Tag } from 'lucide-react';
import { formatCurrency } from '../utils/formatDate';

export const EquipmentCard = ({ equipment }) => {
  const { id, name, category, price_per_day, location, image_url, is_available } = equipment;

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Image container */}
      <div style={{ position: 'relative', height: '180px', borderRadius: '8px', overflow: 'hidden', marginBottom: '1rem', backgroundColor: '#e2e8f0' }}>
        <img 
          src={image_url || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80'} 
          alt={name} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        <div style={{
          position: 'absolute',
          top: '0.75rem',
          right: '0.75rem',
          backgroundColor: is_available ? 'rgba(34, 197, 94, 0.95)' : 'rgba(239, 68, 68, 0.95)',
          color: 'white',
          padding: '0.25rem 0.75rem',
          borderRadius: '50px',
          fontSize: '0.75rem',
          fontWeight: 700
        }}>
          {is_available ? 'Available' : 'Rented'}
        </div>
      </div>

      {/* Body info */}
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase' }}>
          <Tag size={12} />
          <span>{category}</span>
        </div>
        
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, lineHeight: 1.3, color: 'var(--text-main)' }}>{name}</h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <MapPin size={16} />
          <span>{location}</span>
        </div>

        {/* Pricing & CTA */}
        <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>{formatCurrency(price_per_day)}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}> / day</span>
          </div>

          <Link to={`/equipment/${id}`} className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};
export default EquipmentCard;
