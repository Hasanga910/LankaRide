import { useEffect, useState } from 'react';
import * as busService from '../../services/busService.js';
import StatusTag from '../../components/StatusTag.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import Loading from '../../components/Loading.jsx';

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
    <div className="container">
      <h2>Driver Dashboard</h2>
      <div className="grid-2">
        <div className="card">
          <h3>Add Bus</h3>
          <ErrorMessage message={error} />
          {success && <div className="success">{success}</div>}
          <form onSubmit={handleSubmit}>
            <label>Bus Number / Plate</label>
            <input name="busNumber" value={form.busNumber} onChange={handleChange} />
            <label>From</label>
            <input name="from" value={form.from} onChange={handleChange} />
            <label>To</label>
            <input name="to" value={form.to} onChange={handleChange} />
            <label>Total Capacity</label>
            <input name="capacity" type="number" min="1" value={form.capacity} onChange={handleChange} />
            <label>Fare (Rs.)</label>
            <input name="fare" type="number" min="0" value={form.fare} onChange={handleChange} />
            <button className="btn" disabled={submitting}>
              {submitting ? 'Adding…' : 'Add Bus'}
            </button>
          </form>
        </div>

        <div>
          <h3 style={{ marginTop: 0 }}>My Buses</h3>
          {loading ? (
            <Loading />
          ) : buses.length === 0 ? (
            <p className="muted">You haven't added any buses yet.</p>
          ) : (
            buses.map((bus) => (
              <div key={bus._id} className="card">
                <div className="route">
                  {bus.busNumber} — {bus.from} → {bus.to}
                </div>
                <p className="muted">{bus.freeSeats} / {bus.capacity} seats free</p>
                <StatusTag status={bus.status} />
                <div style={{ marginTop: '0.6rem' }}>
                  <label>Update Trip Status</label>
                  <select value={bus.status} onChange={(e) => handleStatusChange(bus._id, e.target.value)}>
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;
