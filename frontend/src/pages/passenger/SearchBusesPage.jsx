import { useState, useEffect } from 'react';
import * as busService from '../../services/busService.js';
import BusCard from '../../components/BusCard.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import Loading from '../../components/Loading.jsx';

const SearchBusesPage = () => {
  const [form, setForm] = useState({ from: '', to: '' });
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const fetchBuses = async (fromVal = '', toVal = '') => {
    setLoading(true);
    setError('');
    setSearched(true);

    try {
      const data = await busService.searchBuses(fromVal.trim(), toVal.trim());
      setBuses(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to search buses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuses('', '');
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBuses(form.from, form.to);
  };

  const handleClear = () => {
    setForm({ from: '', to: '' });
    fetchBuses('', '');
  };

  return (
    <div className="container">
      <h2>Find Your Bus</h2>
      <p className="muted" style={{ marginTop: '-0.3rem', marginBottom: '1.2rem' }}>
        Enter a starting point or destination, or leave both empty to view all buses.
      </p>

      <form onSubmit={handleSearch} className="card grid-2">
        <div>
          <label>From</label>
          <input
            name="from"
            value={form.from}
            onChange={handleChange}
            placeholder="Starting point (optional)"
          />
        </div>
        <div>
          <label>To</label>
          <input
            name="to"
            value={form.to}
            onChange={handleChange}
            placeholder="Destination (optional)"
          />
        </div>
        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <button className="btn" disabled={loading}>
            {loading ? 'Searching…' : 'Search Buses'}
          </button>
          {(form.from || form.to) && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClear}
              disabled={loading}
            >
              Clear Filters
            </button>
          )}
        </div>
      </form>

      <ErrorMessage message={error} />
      {loading && <Loading />}

      {!loading && searched && buses.length > 0 && (
        <p style={{ fontWeight: 600, color: 'var(--navy)', margin: '1rem 0 0.8rem' }}>
          {buses.length} {buses.length === 1 ? 'bus' : 'buses'} found
        </p>
      )}

      {!loading && searched && buses.length === 0 && !error && (
        <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 0.5rem 0' }}>No buses found</h3>
          <p className="muted" style={{ margin: '0 0 1rem 0' }}>
            We couldn't find buses matching your search. Try changing the starting point or destination.
          </p>
          <button className="btn btn-secondary btn-small" onClick={handleClear}>
            View All Buses
          </button>
        </div>
      )}

      {buses.map((bus) => (
        <BusCard key={bus._id} bus={bus} />
      ))}
    </div>
  );
};

export default SearchBusesPage;
