import { useEffect, useState, useRef } from 'react';
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

  // Location tracking states
  const [trackingActive, setTrackingActive] = useState(false);
  const [lastCoords, setLastCoords] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [trackingError, setTrackingError] = useState('');
  const [startingTracking, setStartingTracking] = useState(false);
  const watchIdRef = useRef(null);

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

  // Clean up geolocation watcher on component unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, []);

  const selectedBus = buses.find((b) => b._id === selectedId);

  const handleSelect = (id) => {
    // If switching buses while tracking is active, stop tracking previous bus
    if (trackingActive) {
      stopTrackingHandler();
    }
    setSelectedId(id);
    setSavedMsg('');
    setTrackingError('');
    const bus = buses.find((b) => b._id === id);
    if (bus) {
      setDetailsForm({ from: bus.from, to: bus.to, capacity: bus.capacity, fare: bus.fare });
      setTrackingActive(Boolean(bus.trackingActive));
      if (bus.currentLocation?.latitude) {
        setLastCoords({
          latitude: bus.currentLocation.latitude,
          longitude: bus.currentLocation.longitude,
        });
        setLastUpdated(bus.currentLocation.updatedAt ? new Date(bus.currentLocation.updatedAt) : null);
      } else {
        setLastCoords(null);
        setLastUpdated(null);
      }
    }
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

  // --- Geolocation Tracking Handlers ---
  const startTrackingHandler = () => {
    setTrackingError('');
    if (!navigator.geolocation) {
      setTrackingError('Geolocation is not supported by your device or browser.');
      return;
    }
    if (!selectedId) {
      setTrackingError('Please select a bus first.');
      return;
    }

    setStartingTracking(true);

    // Prompt location permission & start watchPosition
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        setStartingTracking(false);
        const { latitude, longitude } = position.coords;
        setLastCoords({ latitude, longitude });
        const now = new Date();
        setLastUpdated(now);
        setTrackingActive(true);
        try {
          await busService.updateLocation(selectedId, { latitude, longitude });
        } catch (err) {
          console.error('Failed to sync location to backend:', err);
          setTrackingError(err.response?.data?.message || 'Failed to send location update to server.');
        }
      },
      (geoError) => {
        setStartingTracking(false);
        setTrackingActive(false);
        if (watchIdRef.current !== null) {
          navigator.geolocation.clearWatch(watchIdRef.current);
          watchIdRef.current = null;
        }
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setTrackingError('Location permission is required to start the trip.');
        } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
          setTrackingError('GPS/location is currently unavailable on this device.');
        } else if (geoError.code === geoError.TIMEOUT) {
          setTrackingError('Location request timed out. Retrying...');
        } else {
          setTrackingError('An error occurred while accessing location: ' + geoError.message);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 5000,
      }
    );

    watchIdRef.current = watchId;
  };

  const stopTrackingHandler = async () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setTrackingActive(false);
    setStartingTracking(false);
    if (selectedId) {
      try {
        await busService.stopLocationTracking(selectedId);
      } catch (err) {
        console.error('Failed to update stop tracking on backend:', err);
      }
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
        <>
          {/* Live GPS Location Tracking Panel */}
          <div className="card" style={{ borderLeft: '4px solid var(--orange)', marginBottom: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ margin: 0 }}>📍 Live Location Tracking</h3>
                <p className="muted" style={{ margin: '0.3rem 0' }}>
                  Share real-time GPS location from your device so passengers can track this bus on the map.
                </p>
              </div>
              <div>
                {trackingActive ? (
                  <button className="btn" style={{ background: 'var(--red)' }} onClick={stopTrackingHandler}>
                    🛑 Stop Location Sharing / End Trip
                  </button>
                ) : (
                  <button className="btn" onClick={startTrackingHandler} disabled={startingTracking}>
                    {startingTracking ? 'Requesting GPS…' : '🚀 Start Trip / Start Location Sharing'}
                  </button>
                )}
              </div>
            </div>

            <ErrorMessage message={trackingError} />

            <div style={{ background: 'var(--bg)', padding: '0.9rem', borderRadius: '6px', marginTop: '0.8rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', fontSize: '0.95rem' }}>
                <div>
                  <strong>Bus:</strong> {selectedBus.busNumber}
                </div>
                <div>
                  <strong>Route:</strong> {selectedBus.from} → {selectedBus.to}
                </div>
                <div>
                  <strong>Location Tracking:</strong>{' '}
                  {trackingActive ? (
                    <span className="tag tag-en-route" style={{ animation: 'pulse 1.5s infinite' }}>
                      ● LIVE SHARING
                    </span>
                  ) : (
                    <span className="tag tag-not-started">OFFLINE / STOPPED</span>
                  )}
                </div>
                <div>
                  <strong>Last Updated:</strong>{' '}
                  {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Not shared yet'}
                </div>
              </div>
              {lastCoords && (
                <div className="muted" style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                  Coordinates: {lastCoords.latitude.toFixed(5)}, {lastCoords.longitude.toFixed(5)}
                </div>
              )}
            </div>
          </div>

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
        </>
      )}
    </div>
  );
};

export default ConductorDashboard;

