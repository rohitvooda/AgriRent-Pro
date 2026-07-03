import React, { useState, useEffect } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import BookingCard from '../components/BookingCard';
import { getBookings, updateBookingStatus } from '../services/booking';
import { getAllEquipment, createEquipment, deleteEquipment, updateEquipment } from '../services/equipment';
import { useAuth } from '../hooks/useAuth';
import { formatCurrency } from '../utils/formatDate';
import { Loader2, Plus, Tractor, Trash2, Sliders, CalendarClock, DollarSign, CheckCircle2 } from 'lucide-react';

export const OwnerDashboard = () => {
  const { user } = useAuth();
  
  const [equipmentList, setEquipmentList] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Add Equipment Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Tractor');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      // Load owner's equipment
      const equip = await getAllEquipment({ owner_id: user.id });
      setEquipmentList(equip);
      
      // Load bookings for owner's equipment
      const books = await getBookings();
      setBookings(books);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user]);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    const action = newStatus === 'approved' ? 'approve' : 'reject';
    if (!window.confirm(`Are you sure you want to ${action} this booking request?`)) return;
    
    try {
      await updateBookingStatus(bookingId, newStatus);
      fetchData(); // Reload
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to update booking status.');
    }
  };

  const handleToggleAvailability = async (id, currentStatus) => {
    try {
      await updateEquipment(id, { is_available: !currentStatus });
      fetchData();
    } catch (err) {
      alert('Failed to update machinery availability.');
    }
  };

  const handleDeleteEquipment = async (id) => {
    if (!window.confirm('Are you sure you want to remove this equipment listing?')) return;
    try {
      await deleteEquipment(id);
      fetchData();
    } catch (err) {
      alert('Failed to delete equipment listing. Make sure there are no active bookings.');
    }
  };

  const handleAddEquipment = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSubmitting(true);

    try {
      await createEquipment({
        name,
        category,
        price_per_day: Number(price),
        location,
        description,
        is_available: true
      });
      
      // Reset form
      setName('');
      setPrice('');
      setLocation('');
      setDescription('');
      setShowAddForm(false);
      
      fetchData(); // Reload listings
    } catch (err) {
      console.error(err);
      setFormError(err.response?.data?.detail || 'Failed to create equipment listing.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Compute metrics
  const totalEarnings = bookings
    .filter(b => b.status === 'approved' || b.status === 'completed')
    .reduce((acc, curr) => acc + Number(curr.total_price), 0);
    
  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Owner Dashboard</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage listed agricultural machinery, review bookings, and monitor earnings</p>
          </div>
          <button onClick={() => setShowAddForm(!showAddForm)} className="btn btn-primary">
            <Plus size={18} /> Add New Equipment
          </button>
        </div>

        {/* Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <Tractor size={24} />
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>LISTED MACHINERY</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{equipmentList.length} Items</span>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: 'rgba(234, 179, 8, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--secondary-dark)' }}>
              <CalendarClock size={24} />
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>PENDING REQUESTS</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>{pendingCount} Bookings</span>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '8px', backgroundColor: 'rgba(21, 128, 61, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <DollarSign size={24} />
            </div>
            <div>
              <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>PLATFORM REVENUE</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)' }}>{formatCurrency(totalEarnings)}</span>
            </div>
          </div>
        </div>

        {/* Add Equipment Form (Collapsible) */}
        {showAddForm && (
          <div className="glass-card animated-fade" style={{ border: '1px solid var(--primary-light)', padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>List New Agricultural Machinery</h3>
            
            {formError && (
              <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
                {formError}
              </div>
            )}

            <form onSubmit={handleAddEquipment} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="equip-name">Machinery Model Name</label>
                <input 
                  id="equip-name"
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. John Deere 5050D" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="equip-category">Category</label>
                <select 
                  id="equip-category"
                  className="form-control" 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="Tractor">Tractor</option>
                  <option value="Harvester">Harvester</option>
                  <option value="Rotavator">Rotavator</option>
                  <option value="Seed Drill">Seed Drill</option>
                  <option value="Thresher">Thresher</option>
                  <option value="Irrigation Pump">Irrigation Pump</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="equip-price">Rental Price (INR per Day)</label>
                <input 
                  id="equip-price"
                  type="number" 
                  className="form-control" 
                  placeholder="e.g. 2500" 
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="100"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="equip-location">Availability Location</label>
                <input 
                  id="equip-location"
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. Karnal, Haryana" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label htmlFor="equip-desc">Equipment Description / Specifications</label>
                <textarea 
                  id="equip-desc"
                  className="form-control" 
                  placeholder="Provide specifications, HP ratings, fuel conditions, and guidelines..." 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ minHeight: '80px', resize: 'vertical' }}
                />
              </div>

              <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', justifyContent: 'end', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={formSubmitting}>
                  {formSubmitting ? 'Listing...' : 'List Equipment'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Dynamic section: Listings and Incoming Bookings */}
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '200px', gap: '1rem', color: 'var(--primary)' }}>
            <Loader2 size={30} className="spin" style={{ animation: 'spin 1.5s linear infinite' }} />
            <span>Loading dashboard information...</span>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
            
            {/* Left Column: My Listings */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sliders size={20} /> My Listed Equipment
              </h3>
              
              {equipmentList.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <Tractor size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
                  <p>You have not listed any machinery yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {equipmentList.map(item => (
                    <div key={item.id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem' }}>
                      <div>
                        <h4 style={{ fontWeight: 700, fontSize: '1.05rem' }}>{item.name}</h4>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.category} &bull; {item.location}</span>
                        <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--primary)', marginTop: '0.25rem' }}>
                          {formatCurrency(item.price_per_day)}/day
                        </p>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {/* Toggle switch */}
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                          <input 
                            type="checkbox" 
                            checked={item.is_available} 
                            onChange={() => handleToggleAvailability(item.id, item.is_available)}
                            style={{ accentColor: 'var(--primary)' }}
                          />
                          {item.is_available ? 'Available' : 'Paused'}
                        </label>
                        
                        <button 
                          onClick={() => handleDeleteEquipment(item.id)} 
                          style={{ color: '#ef4444', hover: { color: '#b91c1c' } }}
                          title="Delete Listing"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Incoming Bookings */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle2 size={20} /> Booking Requests
              </h3>
              
              {bookings.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
                  <Plus size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
                  <p>No booking requests received yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {bookings.map(book => (
                    <BookingCard 
                      key={book.id} 
                      booking={book} 
                      role="owner" 
                      onStatusUpdate={handleStatusUpdate}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </DashboardLayout>
  );
};
export default OwnerDashboard;
