import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import BookingCard from '../components/BookingCard';
import { getBookings, updateBookingStatus } from '../services/booking';
import { submitReview } from '../services/payment';
import { Loader2, Calendar, Star, MessageSquare, X } from 'lucide-react';

export const FarmerDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Review Modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await getBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
      setError('Could not retrieve your bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    if (!window.confirm(`Are you sure you want to cancel this booking?`)) return;
    try {
      await updateBookingStatus(bookingId, newStatus);
      fetchBookings(); // Reload
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update booking status.');
    }
  };

  const handleReviewOpen = (bookingId) => {
    setSelectedBookingId(bookingId);
    setRating(5);
    setComment('');
    setReviewError('');
    setReviewModalOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSubmitting(true);
    
    try {
      await submitReview({
        booking_id: selectedBookingId,
        rating,
        comment
      });
      setReviewModalOpen(false);
      alert('Thank you for your feedback! Review submitted successfully.');
      fetchBookings();
    } catch (err) {
      console.error(err);
      setReviewError(err.response?.data?.detail || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Header */}
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Farmer Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Track rental bookings, complete payments, and review agricultural machinery</p>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '1rem', color: 'var(--primary)' }}>
            <Loader2 size={40} className="spin" style={{ animation: 'spin 1.5s linear infinite' }} />
            <span style={{ fontWeight: 600 }}>Loading bookings...</span>
          </div>
        ) : error ? (
          <div style={{ color: '#b91c1c', fontWeight: 600, textAlign: 'center', padding: '3rem' }}>
            {error}
          </div>
        ) : bookings.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
            <Calendar size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>No Bookings Yet</h3>
            <p style={{ marginTop: '0.25rem' }}>Browse our machinery and submit your first rental request.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {bookings.map((booking) => (
              <BookingCard 
                key={booking.id} 
                booking={booking} 
                role="farmer" 
                onStatusUpdate={handleStatusUpdate}
                onReviewOpen={handleReviewOpen}
              />
            ))}
          </div>
        )}

      </div>

      {/* Review Modal */}
      {reviewModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="glass-card" style={{ width: '100%', maxWidth: '450px', position: 'relative', animation: 'fadeIn 0.2s ease-out' }}>
            <button 
              onClick={() => setReviewModalOpen(false)} 
              style={{ position: 'absolute', top: '1rem', right: '1rem', color: 'var(--text-muted)' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>
              <MessageSquare size={22} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)' }}>Leave a Review</h3>
            </div>

            {reviewError && (
              <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
                {reviewError}
              </div>
            )}

            <form onSubmit={handleReviewSubmit}>
              
              {/* Rating selection */}
              <div className="form-group">
                <label>Rating (1 to 5 Stars)</label>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      style={{ color: '#eab308' }}
                    >
                      <Star size={28} fill={star <= rating ? '#eab308' : 'none'} stroke="#cbd5e1" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label htmlFor="comment">Comment / Feedback</label>
                <textarea 
                  id="comment"
                  className="form-control" 
                  placeholder="Share your experience with this equipment..." 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{ minHeight: '100px', resize: 'vertical' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'end' }}>
                <button type="button" onClick={() => setReviewModalOpen(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={reviewSubmitting}>
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};
export default FarmerDashboard;
