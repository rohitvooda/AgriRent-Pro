import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { getBookingDetails } from '../services/booking';
import { makePayment } from '../services/payment';
import { formatCurrency, formatDate } from '../utils/formatDate';
import { Loader2, CreditCard, ChevronLeft, ShieldCheck, AlertCircle } from 'lucide-react';

export const Payment = () => {
  const { id } = useParams(); // Booking ID
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBookingDetails(id);
        setBooking(data);
      } catch (err) {
        console.error(err);
        setError('Could not retrieve booking details for checkout.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await makePayment({
        booking_id: id,
        amount: Number(booking.total_price),
        payment_method: method,
        transaction_id: `TXN-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
      });

      alert('Payment successful! Your booking is now approved and active.');
      navigate('/farmer-dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || 'Payment processing failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '1rem', color: 'var(--primary)' }}>
          <Loader2 size={30} className="spin" style={{ animation: 'spin 1.5s linear infinite' }} />
          <span>Loading invoice details...</span>
        </div>
      </MainLayout>
    );
  }

  if (error && !booking) {
    return (
      <MainLayout>
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <h3 style={{ color: '#b91c1c' }}>{error}</h3>
          <Link to="/farmer-dashboard" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>Back to Dashboard</Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div style={{ maxWidth: '800px', margin: '1rem auto 3rem', width: '100%' }}>
        
        {/* Navigation Link */}
        <Link to="/farmer-dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: 600 }}>
          <ChevronLeft size={16} /> Back to Dashboard
        </Link>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>Secure Checkout</h1>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
          
          {/* Booking Summary */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
              Rental Invoice Summary
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Equipment Model:</span>
                <span style={{ fontWeight: 600 }}>{booking.equipment?.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Rental Start:</span>
                <span style={{ fontWeight: 600 }}>{formatDate(booking.start_date)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Rental End:</span>
                <span style={{ fontWeight: 600 }}>{formatDate(booking.end_date)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
                <span style={{ fontWeight: 700 }}>Total Amount Due:</span>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {formatCurrency(booking.total_price)}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem', padding: '0.75rem', backgroundColor: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0', fontSize: '0.8rem', color: '#166534', alignItems: 'center' }}>
              <ShieldCheck size={18} style={{ flexShrink: 0 }} />
              <span>Payments are encrypted and processed securely.</span>
            </div>
          </div>

          {/* Payment Details Input */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem' }}>Payment Method</h3>
            
            {error && (
              <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', gap: '0.5rem', fontSize: '0.85rem' }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCheckout}>
              {/* Method toggler */}
              <div className="form-group">
                <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                  <label style={{ 
                    flex: 1, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem', 
                    borderRadius: '8px', 
                    border: '1px solid ' + (method === 'UPI' ? 'var(--primary-light)' : 'var(--border)'),
                    backgroundColor: method === 'UPI' ? 'rgba(34, 197, 94, 0.05)' : 'white',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}>
                    <input 
                      type="radio" 
                      name="payment_method" 
                      value="UPI" 
                      checked={method === 'UPI'} 
                      onChange={() => setMethod('UPI')} 
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    UPI
                  </label>

                  <label style={{ 
                    flex: 1, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem', 
                    borderRadius: '8px', 
                    border: '1px solid ' + (method === 'Card' ? 'var(--primary-light)' : 'var(--border)'),
                    backgroundColor: method === 'Card' ? 'rgba(34, 197, 94, 0.05)' : 'white',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}>
                    <input 
                      type="radio" 
                      name="payment_method" 
                      value="Card" 
                      checked={method === 'Card'} 
                      onChange={() => setMethod('Card')} 
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    Debit/Credit Card
                  </label>
                </div>
              </div>

              {/* Conditional Inputs */}
              {method === 'UPI' ? (
                <div className="form-group" style={{ marginBottom: '2rem' }}>
                  <label htmlFor="upi-id">UPI Address</label>
                  <input 
                    id="upi-id"
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. name@upi" 
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    required
                  />
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="card-num">Card Number</label>
                    <div style={{ position: 'relative' }}>
                      <CreditCard size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                      <input 
                        id="card-num"
                        type="text" 
                        className="form-control" 
                        placeholder="4000 1234 5678 9010" 
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        style={{ paddingLeft: '2.5rem' }}
                        maxLength={16}
                        required
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="form-group" style={{ flex: 1, margin: 0 }}>
                      <label htmlFor="card-exp">Expiry Date</label>
                      <input 
                        id="card-exp"
                        type="text" 
                        className="form-control" 
                        placeholder="MM/YY" 
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        maxLength={5}
                        required
                      />
                    </div>
                    <div className="form-group" style={{ flex: 1, margin: 0 }}>
                      <label htmlFor="card-cvv">CVV</label>
                      <input 
                        id="card-cvv"
                        type="password" 
                        className="form-control" 
                        placeholder="•••" 
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        maxLength={3}
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '0.85rem' }}
                disabled={submitting}
              >
                {submitting ? 'Processing Payment...' : `Pay ${formatCurrency(booking.total_price)}`}
              </button>
            </form>
          </div>

        </div>

      </div>
    </MainLayout>
  );
};
export default Payment;
