import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { getEquipmentDetails } from '../services/equipment';
import { requestBooking } from '../services/booking';
import { getEquipmentReviews } from '../services/payment';
import { useAuth } from '../hooks/useAuth';
import { formatDate, formatCurrency } from '../utils/formatDate';
import { MapPin, Tag, Calendar, User, Star, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export const EquipmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isFarmer, user } = useAuth();
  
  const [equipment, setEquipment] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Date inputs
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [totalCost, setTotalCost] = useState(0);

  const fetchDetails = async () => {
    try {
      const equipData = await getEquipmentDetails(id);
      setEquipment(equipData);
      
      const reviewData = await getEquipmentReviews(id);
      setReviews(reviewData);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch details for this equipment listing.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  // Recalculate price when dates change
  useEffect(() => {
    if (startDate && endDate && equipment) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      if (diffDays > 0 && start <= end) {
        setTotalCost(diffDays * Number(equipment.price_per_day));
      } else {
        setTotalCost(0);
      }
    } else {
      setTotalCost(0);
    }
  }, [startDate, endDate, equipment]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!startDate || !endDate) {
      setError('Please select both start and end rental dates.');
      return;
    }

    setBookingLoading(true);
    try {
      await requestBooking({
        equipment_id: id,
        start_date: startDate,
        end_date: endDate
      });
      setBookingSuccess(true);
      setTimeout(() => {
        navigate('/farmer-dashboard');
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.detail || 
        'Could not submit booking request. The dates might be overlapping with existing bookings.'
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '1rem', color: 'var(--primary)' }}>
          <Loader2 size={40} className="spin" style={{ animation: 'spin 1.5s linear infinite' }} />
          <span style={{ fontWeight: 600 }}>Loading listing details...</span>
        </div>
      </MainLayout>
    );
  }

  if (!equipment) {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h2 style={{ color: '#b91c1c' }}>Listing Not Found</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>The requested equipment listing could not be found.</p>
          <Link to="/equipment" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Back to Search</Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem', paddingBottom: '4rem' }}>
        
        {/* Left Side: Equipment Info & Reviews */}
        <div>
          <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
            {/* Category tag */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
              <Tag size={14} />
              <span>{equipment.category}</span>
            </div>

            <h1 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-main)' }}>{equipment.name}</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              <MapPin size={18} />
              <span>{equipment.location}</span>
            </div>

            {/* Main Image */}
            <div style={{ width: '100%', height: '360px', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem', backgroundColor: '#e2e8f0' }}>
              <img 
                src={equipment.image_url || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80'} 
                alt={equipment.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Description</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
              {equipment.description || 'No description provided by the equipment owner.'}
            </p>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', display: 'flex', gap: '2rem' }}>
              <div>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>LISTING PRICE</span>
                <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>{formatCurrency(equipment.price_per_day)}</span>
                <span style={{ color: 'var(--text-muted)' }}> / day</span>
              </div>
            </div>
          </div>

          {/* Reviews section */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Ratings & Reviews ({reviews.length})</h3>
            
            {reviews.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No reviews have been posted for this machinery yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {reviews.map((rev) => (
                  <div key={rev.id} style={{ borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#eab308' }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} fill={i < rev.rating ? '#eab308' : 'none'} stroke={i < rev.rating ? 'none' : '#cbd5e1'} />
                        ))}
                      </div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatDate(rev.created_at)}</span>
                    </div>
                    <p style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{rev.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Booking Form */}
        <div>
          <div className="glass-card" style={{ position: 'sticky', top: '100px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.25rem' }}>Request Rental</h3>
            
            {error && (
              <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', gap: '0.5rem', fontSize: '0.85rem' }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            {bookingSuccess && (
              <div style={{ backgroundColor: '#dcfce7', border: '1px solid #bbf7d0', color: '#15803d', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', gap: '0.5rem', fontSize: '0.85rem' }}>
                <CheckCircle size={16} style={{ flexShrink: 0 }} />
                <span>Booking request submitted! Redirecting...</span>
              </div>
            )}

            {!isAuthenticated ? (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.95rem' }}>Log in to submit a booking request for this machinery.</p>
                <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>Login to Book</Link>
              </div>
            ) : !isFarmer ? (
              <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Booking is restricted to users with the **Farmer** role. Currently logged in as **{user?.role}**.
              </div>
            ) : (
              <form onSubmit={handleBooking}>
                <div className="form-group">
                  <label htmlFor="start_date">Rental Start Date</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      id="start_date"
                      type="date" 
                      className="form-control" 
                      min={new Date().toISOString().split('T')[0]}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      style={{ paddingLeft: '2.5rem' }}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label htmlFor="end_date">Rental End Date</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input 
                      id="end_date"
                      type="date" 
                      className="form-control" 
                      min={startDate || new Date().toISOString().split('T')[0]}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      style={{ paddingLeft: '2.5rem' }}
                      required
                    />
                  </div>
                </div>

                {totalCost > 0 && (
                  <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.05)', border: '1px dashed var(--primary-light)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      <span>Price per Day:</span>
                      <span>{formatCurrency(equipment.price_per_day)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-muted)', margin: '0.25rem 0 0.5rem' }}>
                      <span>Duration:</span>
                      <span>
                        {Math.ceil(Math.abs(new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1} Days
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '0.5rem', fontWeight: 700 }}>
                      <span>Estimated Cost:</span>
                      <span style={{ color: 'var(--primary)' }}>{formatCurrency(totalCost)}</span>
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ width: '100%', padding: '0.85rem' }}
                  disabled={bookingLoading || bookingSuccess}
                >
                  {bookingLoading ? 'Requesting...' : 'Submit Booking Request'}
                </button>
              </form>
            )}

          </div>
        </div>

      </div>
    </MainLayout>
  );
};
export default EquipmentDetails;
