import { useState } from 'react';
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-800">Search Buses</h1>
      <p className="mt-2 text-gray-500 mb-6">Find live seat availability for your route.</p>

      <Card className="mb-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 items-start">
          <Input label="From" name="from" value={form.from} onChange={handleChange} placeholder="e.g. Malabe" />
          <Input label="To" name="to" value={form.to} onChange={handleChange} placeholder="e.g. Colombo" />
          <div className="sm:col-span-2">
            <Button type="submit" variant="primary" size="md" className="w-full sm:w-auto">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </Button>
          </div>
        </form>
      </Card>

      <ErrorMessage message={error} />
      {loading && <Loading />}
      {!loading && searched && buses.length === 0 && !error && (
        <p className="text-sm text-gray-500">No buses found for this route. Try a different From/To.</p>
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
