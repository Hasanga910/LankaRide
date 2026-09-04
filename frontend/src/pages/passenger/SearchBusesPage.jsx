import { useState } from 'react';
import * as busService from '../../services/busService.js';
import BusCard from '../../components/BusCard.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import Loading from '../../components/Loading.jsx';

const SearchBusesPage = () => {
  const [form, setForm] = useState({ from: '', to: '' });
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSearched(true);
    try {
      setBuses(await busService.searchBuses(form.from, form.to));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search buses.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Search Buses</h2>
      <form onSubmit={handleSearch} className="card grid-2">
        <div>
          <label>From</label>
          <input name="from" value={form.from} onChange={handleChange} placeholder="e.g. Malabe" />
        </div>
        <div>
          <label>To</label>
          <input name="to" value={form.to} onChange={handleChange} placeholder="e.g. Colombo" />
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <button className="btn">Search</button>
        </div>
      </form>

      <ErrorMessage message={error} />
      {loading && <Loading />}
      {!loading && searched && buses.length === 0 && !error && (
        <p className="muted">No buses found for this route. Try a different From/To.</p>
      )}
      {buses.map((bus) => (
        <BusCard key={bus._id} bus={bus} />
      ))}
    </div>
  );
};

export default SearchBusesPage;
