import { useState, useEffect } from 'react';
import * as busService from '../../services/busService.js';
import BusCard from '../../components/BusCard.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import Loading from '../../components/Loading.jsx';
import Card from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-800">Find Your Bus</h1>
      <p className="mt-2 text-gray-500 mb-6">
        Enter a starting point or destination, or leave both empty to view all active buses.
      </p>

      <Card className="mb-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 items-start">
          <Input
            label="From"
            name="from"
            value={form.from}
            onChange={handleChange}
            placeholder="Starting point (e.g. Malabe)"
          />
          <Input
            label="To"
            name="to"
            value={form.to}
            onChange={handleChange}
            placeholder="Destination (e.g. Colombo)"
          />
          <div className="sm:col-span-2 flex flex-wrap gap-3 mt-1">
            <Button type="submit" variant="primary" size="md" disabled={loading}>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {loading ? 'Searching…' : 'Search Buses'}
            </Button>
            {(form.from || form.to) && (
              <Button type="button" variant="outline" size="md" onClick={handleClear} disabled={loading}>
                Clear Filters
              </Button>
            )}
          </div>
        </form>
      </Card>

      <ErrorMessage message={error} />
      {loading && <Loading />}

      {!loading && searched && buses.length > 0 && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-navy-800">
            {buses.length} {buses.length === 1 ? 'bus' : 'buses'} found
          </p>
        </div>
      )}

      {!loading && searched && buses.length === 0 && !error && (
        <Card className="text-center py-10">
          <h3 className="text-lg font-bold text-navy-800">No buses found</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">
            We couldn't find buses matching your search. Try a different starting point or destination.
          </p>
          <Button variant="secondary" size="sm" onClick={handleClear}>
            View All Buses
          </Button>
        </Card>
      )}

      <div className="space-y-4">
        {buses.map((bus) => (
          <BusCard key={bus._id} bus={bus} />
        ))}
      </div>
    </div>
  );
};

export default SearchBusesPage;
