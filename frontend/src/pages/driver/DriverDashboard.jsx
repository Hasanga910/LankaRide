import { useEffect, useState } from 'react';
import * as busService from '../../services/busService.js';
import StatusTag from '../../components/StatusTag.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import Loading from '../../components/Loading.jsx';
import Card from '../../components/ui/Card.jsx';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import Button from '../../components/ui/Button.jsx';
import Alert from '../../components/ui/Alert.jsx';

const emptyForm = { busNumber: '', from: '', to: '', capacity: '', fare: '' };
const statuses = ['Not Started', 'En Route', 'Arrived'];

const DriverDashboard = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const loadBuses = async () => {
    setLoading(true);
    try {
      setBuses(await busService.getMyBuses());
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load your buses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBuses();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.busNumber || !form.from || !form.to || !form.capacity) {
      setError('Bus number, from, to and capacity are required.');
      return;
    }
    if (Number(form.capacity) <= 0) {
      setError('Capacity must be greater than 0.');
      return;
    }
    setSubmitting(true);
    try {
      await busService.createBus({
        ...form,
        capacity: Number(form.capacity),
        fare: Number(form.fare) || 0,
      });
      setSuccess('Bus added successfully.');
      setForm(emptyForm);
      loadBuses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add bus.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    setError('');
    try {
      await busService.updateStatus(id, status);
      loadBuses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update status.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
      <Card>
        <h3 className="text-base font-bold text-navy-800 mb-4">Add Bus</h3>
        <ErrorMessage message={error} />
        {success && <Alert variant="success">{success}</Alert>}
        <form onSubmit={handleSubmit}>
          <Input label="Bus Number / Plate" name="busNumber" value={form.busNumber} onChange={handleChange} />
          <Input label="From" name="from" value={form.from} onChange={handleChange} />
          <Input label="To" name="to" value={form.to} onChange={handleChange} />
          <Input
            label="Total Capacity"
            name="capacity"
            type="number"
            min="1"
            value={form.capacity}
            onChange={handleChange}
          />
          <Input label="Fare (Rs.)" name="fare" type="number" min="0" value={form.fare} onChange={handleChange} />
          <Button type="submit" variant="primary" size="md" className="w-full mt-2" loading={submitting}>
            {submitting ? 'Adding…' : 'Add Bus'}
          </Button>
        </form>
      </Card>

      <div>
        <h3 className="text-base font-bold text-navy-800 mb-4">My Buses</h3>
        {loading ? (
          <Loading />
        ) : buses.length === 0 ? (
          <p className="text-sm text-gray-500">You haven't added any buses yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {buses.map((bus) => {
              const fillPct = bus.capacity ? Math.round((bus.freeSeats / bus.capacity) * 100) : 0;
              return (
                <Card key={bus._id}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-navy-800">
                        {bus.busNumber} — {bus.from} <span className="text-orange-500">→</span> {bus.to}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {bus.freeSeats} / {bus.capacity} seats free
                      </p>
                    </div>
                    <StatusTag status={bus.status} />
                  </div>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-orange-500" style={{ width: `${fillPct}%` }} />
                  </div>
                  <Select
                    label="Update Trip Status"
                    value={bus.status}
                    onChange={(e) => handleStatusChange(bus._id, e.target.value)}
                    containerClassName="mb-0 mt-4"
                  >
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </Select>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;
