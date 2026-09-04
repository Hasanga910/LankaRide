import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as busService from '../../services/busService.js';
import StatusTag from '../../components/StatusTag.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import Loading from '../../components/Loading.jsx';

const getSeatStatus = (freeSeats) => {
  if (freeSeats === 0) return '🔴 Full';
  if (freeSeats <= 5) return '🟠 Few seats left';
  return '🟢 Seats available';
};

const BusDetailsPage = () => {
  const { id } = useParams();
  const [bus, setBus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchBus = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError('');
    try {
      const data = await busService.getBusById(id);
      setBus(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bus details.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBus();
  }, [fetchBus]);

  return (
    <div className="container" style={{ maxWidth: '640px' }}>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/search" className="btn btn-secondary btn-small">
          ← Back to Search
        </Link>
      </div>

      <ErrorMessage message={error} />

      {loading && <Loading />}

      {!loading && bus && (
        <>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h2 style={{ margin: '0 0 0.3rem 0' }}>🚌 {bus.busNumber}</h2>
                <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--navy)' }}>
                  {bus.from} → {bus.to}
                </div>
              </div>
              <div>
                <StatusTag status={bus.status} />
              </div>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginTop: 0 }}>Seat Availability</h3>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, margin: '0.5rem 0' }}>
              {bus.freeSeats} / {bus.capacity} seats free
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.6rem' }}>
              {getSeatStatus(bus.freeSeats)}
            </div>
            {bus.updatedAt && (
              <p className="muted" style={{ margin: '0.3rem 0 0.8rem 0' }}>
                Last updated: {new Date(bus.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
              </p>
            )}
            <button
              className="btn btn-small"
              onClick={() => fetchBus(true)}
              disabled={refreshing || loading}
            >
              {refreshing ? 'Refreshing…' : 'Refresh Availability'}
            </button>
          </div>

          <div className="card">
            <h3 style={{ marginTop: 0 }}>Bus Details</h3>
            <table>
              <tbody>
                <tr>
                  <th>Fare</th>
                  <td>Rs. {bus.fare}</td>
                </tr>
                <tr>
                  <th>Driver</th>
                  <td>{bus.driver?.name || 'N/A'}</td>
                </tr>
                <tr>
                  <th>Driver Contact</th>
                  <td>
                    {bus.driver?.contact ? (
                      <a href={`tel:${bus.driver.contact}`}>{bus.driver.contact}</a>
                    ) : (
                      'N/A'
                    )}
                  </td>
                </tr>
                <tr>
                  <th>Conductor</th>
                  <td>{bus.conductor?.name || 'Not assigned'}</td>
                </tr>
                <tr>
                  <th>Conductor Contact</th>
                  <td>
                    {bus.conductor ? (
                      bus.conductor.contact ? (
                        <a href={`tel:${bus.conductor.contact}`}>{bus.conductor.contact}</a>
                      ) : (
                        'N/A'
                      )
                    ) : (
                      'Not assigned'
                    )}
                  </td>
                </tr>
                <tr>
                  <th>Capacity</th>
                  <td>{bus.capacity} seats</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="muted" style={{ fontStyle: 'italic', marginTop: '1rem', fontSize: '0.85rem' }}>
            Seat availability reflects the most recent manual conductor update and is not official
            transport-authority live data.
          </p>
        </>
      )}
    </div>
  );
};

export default BusDetailsPage;
