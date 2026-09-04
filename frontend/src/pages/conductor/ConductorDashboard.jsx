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
    <div>
      <ErrorMessage message={error} />

      <Card className="mb-6">
        <Select
          label="Select a Bus to Manage"
          value={selectedId}
          onChange={(e) => handleSelect(e.target.value)}
          containerClassName="mb-0"
        >
          <option value="">-- Choose a bus --</option>
          {buses.map((b) => (
            <option key={b._id} value={b._id}>
              {b.busNumber} ({b.from} → {b.to})
            </option>
          ))}
        </Select>
      </Card>

      {loading && <Loading />}

      {selectedBus && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <Card>
            <h3 className="text-base font-bold text-navy-800 mb-3">Free Seats — Manual Update</h3>
            <StatusTag status={selectedBus.status} />
            <div className="flex items-center justify-center gap-4 mt-6 mb-2">
              <Button variant="outline" size="sm" onClick={() => handleSeatChange('decrement')}>
                − Boarded
              </Button>
              <span className="text-2xl font-extrabold text-navy-800 min-w-[5rem] text-center">
                {selectedBus.freeSeats} / {selectedBus.capacity}
              </span>
              <Button variant="secondary" size="sm" onClick={() => handleSeatChange('increment')}>
                + Alighted
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Seat count is updated manually — there is no automated ticketing step. It cannot go below 0
              or above the bus's total capacity.
            </p>
          </Card>

          <Card>
            <h3 className="text-base font-bold text-navy-800 mb-3">Edit Bus Details</h3>
            {savedMsg && <Alert variant="success">{savedMsg}</Alert>}
            <form onSubmit={handleDetailsSubmit}>
              <Input
                label="From"
                value={detailsForm.from}
                onChange={(e) => setDetailsForm({ ...detailsForm, from: e.target.value })}
              />
              <Input
                label="To"
                value={detailsForm.to}
                onChange={(e) => setDetailsForm({ ...detailsForm, to: e.target.value })}
              />
              <Input
                label="Capacity"
                type="number"
                min="1"
                value={detailsForm.capacity}
                onChange={(e) => setDetailsForm({ ...detailsForm, capacity: e.target.value })}
              />
              <Input
                label="Fare (Rs.)"
                type="number"
                min="0"
                value={detailsForm.fare}
                onChange={(e) => setDetailsForm({ ...detailsForm, fare: e.target.value })}
              />
              <Button type="submit" variant="primary" size="md" className="w-full mt-2" loading={savingDetails}>
                {savingDetails ? 'Saving…' : 'Save Details'}
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ConductorDashboard;
