import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, CreditCard, XCircle, CheckCircle, MessageSquare } from 'lucide-react';
import { formatDate, formatCurrency } from '../utils/formatDate';

export const BookingCard = ({ booking, role, onStatusUpdate, onReviewOpen }) => {
  const { id, start_date, end_date, total_price, status, equipment } = booking;
  const navigate = useNavigate();

  const handlePay = () => {
    navigate(`/payment/${id}`);
  };

  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      
      {/* Booking Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>BOOKING ID: {id.substring(0, 8).toUpperCase()}</span>
          <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.15rem' }}>
            {equipment?.name || 'Machinery Rental'}
          </h4>
        </div>
        <span className={`badge badge-${status}`}>{status}</span>
      </div>

      {/* Booking Body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.9rem' }}>
        <div>
          <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>RENTAL START</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
            <Calendar size={14} />
            {formatDate(start_date)}
          </span>
        </div>
        <div>
          <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 600 }}>RENTAL END</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 600 }}>
            <Calendar size={14} />
            {formatDate(end_date)}
          </span>
        </div>
      </div>

      {/* Pricing / Actions Footer */}
      <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Total Cost</span>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>{formatCurrency(total_price)}</span>
        </div>

        {/* Dynamic actions based on role */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          
          {/* Owner actions */}
          {role === 'owner' && status === 'pending' && (
            <>
              <button 
                onClick={() => onStatusUpdate(id, 'approved')} 
                className="btn btn-primary" 
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', backgroundColor: '#15803d' }}
              >
                <CheckCircle size={14} /> Approve
              </button>
              <button 
                onClick={() => onStatusUpdate(id, 'rejected')} 
                className="btn btn-secondary" 
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: '#b91c1c' }}
              >
                <XCircle size={14} /> Reject
              </button>
            </>
          )}

          {/* Farmer actions */}
          {role === 'farmer' && (
            <>
              {status === 'pending' && (
                <button 
                  onClick={() => onStatusUpdate(id, 'cancelled')} 
                  className="btn btn-secondary" 
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: '#b91c1c' }}
                >
                  <XCircle size={14} /> Cancel
                </button>
              )}
              {status === 'approved' && (
                <button 
                  onClick={handlePay} 
                  className="btn btn-accent" 
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', display: 'flex', gap: '0.25rem' }}
                >
                  <CreditCard size={14} /> Pay Now
                </button>
              )}
              {status === 'completed' && onReviewOpen && (
                <button 
                  onClick={() => onReviewOpen(id)} 
                  className="btn btn-primary" 
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                >
                  <MessageSquare size={14} /> Leave Review
                </button>
              )}
            </>
          )}

        </div>
      </div>

    </div>
  );
};
export default BookingCard;
