import { useEffect, useState } from 'react';
import * as busService from '../../services/busService.js';
import StatusTag from '../../components/StatusTag.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import Loading from '../../components/Loading.jsx';

const ConductorDashboard = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedId, setSelectedId] = useState('');
  const [detailsForm, setDetailsForm] = useState({ from: '', to: '', capacity: '', fare: '' });
  const [savingDetails, setSavingDetails] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  const loadBuses = async () => {
    setLoading(true);
    try {
      const data = await busService.searchBuses('', '');
      setBuses(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load buses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBuses();
  }, []);

  const selectedBus = buses.find((b) => b._id === selectedId);

  const handleSelect = (id) => {
    setSelectedId(id);
    setSavedMsg('');
    const bus = buses.find((b) => b._id === id);
    if (bus) setDetailsForm({ from: bus.from, to: bus.to, capacity: bus.capacity, fare: bus.fare });
  };

  const handleSeatChange = async (action) => {
    setError('');
    try {
      await busService.updateSeats(selectedId, action);
      loadBuses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update seat count.');
    }
  };

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSavedMsg('');
    if (!detailsForm.from || !detailsForm.to || !detailsForm.capacity) {
      setError('From, to and capacity are required.');
      return;
    }
    setSavingDetails(true);
    try {
      await busService.updateBusDetails(selectedId, {
        from: detailsForm.from,
        to: detailsForm.to,
        capacity: Number(detailsForm.capacity),
        fare: Number(detailsForm.fare) || 0,
      });
      setSavedMsg('Bus details updated.');
      loadBuses();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update bus details.');
    } finally {
      setSavingDetails(false);
    }
  };

  return (
    <div className="container">
      <h2>Conductor Dashboard</h2>
      <ErrorMessage message={error} />

      <div className="card">
        <label>Select a Bus to Manage</label>
        <select value={selectedId} onChange={(e) => handleSelect(e.target.value)}>
          <option value="">-- Choose a bus --</option>
          {buses.map((b) => (
            <option key={b._id} value={b._id}>
              {b.busNumber} ({b.from} → {b.to})
            </option>
          ))}
        </select>
      </div>

      {loading && <Loading />}

      {selectedBus && (
        <div className="grid-2">
          <div className="card">
            <h3>Free Seats — Manual Update</h3>
            <StatusTag status={selectedBus.status} />
            <div className="seat-controls" style={{ marginTop: '0.8rem' }}>
              <button className="btn btn-small" onClick={() => handleSeatChange('decrement')}>
                − Passenger Boarded
              </button>
              <span className="seat-count">
                {selectedBus.freeSeats} / {selectedBus.capacity}
              </span>
              <button className="btn btn-small btn-secondary" onClick={() => handleSeatChange('increment')}>
                + Passenger Alighted
              </button>
            </div>
            <p className="muted" style={{ marginTop: '0.6rem' }}>
              Seat count is updated manually — there is no automated ticketing step. It cannot go below 0
              or above the bus's total capacity.
            </p>
          </div>

          <div className="card">
            <h3>Edit Bus Details</h3>
            {savedMsg && <div className="success">{savedMsg}</div>}
            <form onSubmit={handleDetailsSubmit}>
              <label>From</label>
              <input
                value={detailsForm.from}
                onChange={(e) => setDetailsForm({ ...detailsForm, from: e.target.value })}
              />
              <label>To</label>
              <input
                value={detailsForm.to}
                onChange={(e) => setDetailsForm({ ...detailsForm, to: e.target.value })}
              />
              <label>Capacity</label>
              <input
                type="number"
                min="1"
                value={detailsForm.capacity}
                onChange={(e) => setDetailsForm({ ...detailsForm, capacity: e.target.value })}
              />
              <label>Fare (Rs.)</label>
              <input
                type="number"
                min="0"
                value={detailsForm.fare}
                onChange={(e) => setDetailsForm({ ...detailsForm, fare: e.target.value })}
              />
              <button className="btn" disabled={savingDetails}>
                {savingDetails ? 'Saving…' : 'Save Details'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConductorDashboard;
