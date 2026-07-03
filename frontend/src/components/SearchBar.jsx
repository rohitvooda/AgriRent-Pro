import React, { useState } from 'react';
import { Search, MapPin, SlidersHorizontal } from 'lucide-react';

export const SearchBar = ({ onSearch }) => {
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const filters = {};
    if (category) filters.category = category;
    if (location) filters.location = location;
    if (minPrice) filters.min_price = minPrice;
    if (maxPrice) filters.max_price = maxPrice;
    onSearch(filters);
  };

  const handleClear = () => {
    setCategory('');
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    onSearch({});
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', alignItems: 'end' }}>
        
        {/* Category Search */}
        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Equipment Category</label>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Tractor, Harvester" 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>
        </div>

        {/* Location Search */}
        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Location</label>
          <div style={{ position: 'relative' }}>
            <MapPin size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. Ludhiana, Punjab" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ paddingLeft: '2.25rem' }}
            />
          </div>
        </div>

        {/* Price limits */}
        <div className="form-group" style={{ margin: 0 }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>Max Price / day (INR)</label>
          <input 
            type="number" 
            className="form-control" 
            placeholder="e.g. 5000" 
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: '0.75rem' }}>
            Search
          </button>
          <button type="button" onClick={handleClear} className="btn btn-secondary" style={{ flex: 1, padding: '0.75rem' }}>
            Reset
          </button>
        </div>

      </div>
    </form>
  );
};
export default SearchBar;
