import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import * as busService from '../../services/busService.js';
import StatusTag from '../../components/StatusTag.jsx';
import Loading from '../../components/Loading.jsx';

// Custom Bus Icon using Leaflet DivIcon
const createBusIcon = (isActive) =>
  L.divIcon({
    className: 'custom-bus-marker',
    html: `<div style="
      background: ${isActive ? '#e96a25' : '#777'};
      color: white;
      font-size: 22px;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 3px 8px rgba(0,0,0,0.3);
      border: 3px solid white;
      transition: all 0.3s ease;
    ">🚌</div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    popupAnchor: [0, -22],
  });

// Component to dynamically re-center map as bus coordinates update
const RecenterMap = ({ lat, lng }) => {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) {
      map.setView([lat, lng], map.getZoom(), { animate: true });
    }
  }, [lat, lng, map]);
  return null;
};

const TrackBusPage = () => {
  const { id } = useParams();
  const [busData, setBusData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastChecked, setLastChecked] = useState(new Date());

  const fetchLocation = async () => {
    try {
      const data = await busService.getBusLocation(id);
      setBusData(data);
      setLastChecked(new Date());
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bus location.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocation();
    // Poll approximately every 5 seconds while tracking page is open
    const interval = setInterval(() => {
      fetchLocation();
    }, 5000);

    // Clean up polling interval when unmounting
    return () => clearInterval(interval);
  }, [id]);

  const hasCoordinates =
    busData?.currentLocation?.latitude !== null &&
    busData?.currentLocation?.longitude !== null &&
    busData?.currentLocation?.latitude !== undefined &&
    busData?.currentLocation?.longitude !== undefined;

  const isLive = Boolean(busData?.trackingActive && hasCoordinates);

  const getStatusMessage = () => {
    if (!busData) return null;
    if (!hasCoordinates) {
      return {
        type: 'info',
        text: 'Waiting for conductor to start location sharing. No coordinates received yet.',
      };
    }
    if (!busData.trackingActive) {
      return {
        type: 'warning',
        text: 'Bus is no longer sharing its location. The trip has ended or tracking is stopped.',
      };
    }
    return {
      type: 'success',
      text: 'Bus location is currently LIVE and updating automatically every 5 seconds.',
    };
  };

  const statusMsg = getStatusMessage();

  // Default fallback center to Sri Lanka (Colombo or current bus coordinate)
  const defaultPosition = hasCoordinates
    ? [busData.currentLocation.latitude, busData.currentLocation.longitude]
    : [6.9271, 79.8612];

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <Link to="/search" style={{ textDecoration: 'none', color: 'var(--navy)', fontWeight: 600 }}>
            ← Back to Bus Search
          </Link>
          <h2 style={{ margin: '0.4rem 0 0' }}>Live Bus Tracking</h2>
        </div>
        {busData && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <StatusTag status={busData.status} />
            {isLive ? (
              <span className="tag tag-en-route" style={{ animation: 'pulse 1.5s infinite' }}>
                ● LIVE TRACKING
              </span>
            ) : (
              <span className="tag tag-not-started">OFFLINE</span>
            )}
          </div>
        )}
      </div>

      {loading && <Loading />}

      {error && <div className="error">{error}</div>}

      {busData && (
        <>
          <div className="card" style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.3rem', color: 'var(--navy)' }}>
                  {busData.busNumber}
                </h3>
                <div style={{ fontSize: '1rem', fontWeight: 600 }}>
                  Route: {busData.route || `${busData.from} → ${busData.to}`}
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.9rem' }} className="muted">
                <div>
                  <strong>Last updated:</strong>{' '}
                  {busData.currentLocation?.updatedAt
                    ? new Date(busData.currentLocation.updatedAt).toLocaleTimeString()
                    : 'N/A'}
                </div>
                <div>Checked at: {lastChecked.toLocaleTimeString()}</div>
              </div>
            </div>

            {statusMsg && (
              <div
                style={{
                  marginTop: '0.8rem',
                  padding: '0.6rem 0.9rem',
                  borderRadius: '6px',
                  fontSize: '0.9rem',
                  background:
                    statusMsg.type === 'success'
                      ? '#e9f8ec'
                      : statusMsg.type === 'warning'
                      ? '#fff8e6'
                      : '#eef3fb',
                  color:
                    statusMsg.type === 'success'
                      ? 'var(--green)'
                      : statusMsg.type === 'warning'
                      ? '#9a6700'
                      : 'var(--blue)',
                  border: `1px solid ${
                    statusMsg.type === 'success'
                      ? 'var(--green)'
                      : statusMsg.type === 'warning'
                      ? '#e6bc5c'
                      : '#b3cdf5'
                  }`,
                }}
              >
                {statusMsg.text}
              </div>
            )}
          </div>

          <div
            className="card"
            style={{
              padding: '0.5rem',
              height: '480px',
              borderRadius: '8px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            }}
          >
            {hasCoordinates ? (
              <MapContainer
                center={defaultPosition}
                zoom={14}
                style={{ height: '100%', width: '100%', borderRadius: '6px' }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[
                    busData.currentLocation.latitude,
                    busData.currentLocation.longitude,
                  ]}
                  icon={createBusIcon(isLive)}
                >
                  <Popup>
                    <div style={{ textAlign: 'center' }}>
                      <strong>{busData.busNumber}</strong>
                      <br />
                      {busData.route}
                      <br />
                      <span style={{ fontSize: '0.8rem', color: isLive ? '#2e9e3f' : '#777' }}>
                        {isLive ? '● Live Location' : 'Last Reported Location'}
                      </span>
                    </div>
                  </Popup>
                </Marker>
                <RecenterMap
                  lat={busData.currentLocation.latitude}
                  lng={busData.currentLocation.longitude}
                />
              </MapContainer>
            ) : (
              <div
                style={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--grey)',
                  background: 'var(--bg)',
                  borderRadius: '6px',
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🗺️</div>
                <h3>Bus location is currently unavailable</h3>
                <p style={{ maxWidth: '400px', textAlign: 'center', margin: 0 }}>
                  Waiting for conductor to start location sharing from their dashboard.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TrackBusPage;
