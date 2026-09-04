import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import * as busService from '../../services/busService.js';
import StatusTag from '../../components/StatusTag.jsx';
import Loading from '../../components/Loading.jsx';
import Card from '../../components/ui/Card.jsx';
import Alert from '../../components/ui/Alert.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';

// Custom Bus Icon using Leaflet DivIcon
const createBusIcon = (isActive) =>
  L.divIcon({
    className: 'custom-bus-marker',
    html: `<div style="
      background: ${isActive ? '#e96a25' : '#64748b'};
      color: white;
      font-size: 22px;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      border: 3px solid white;
      transition: all 0.3s ease;
    ">🚌</div>`,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -24],
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

  const getStatusAlert = () => {
    if (!busData) return null;
    if (!hasCoordinates) {
      return (
        <Alert variant="info">
          Waiting for conductor to start location sharing. No coordinates received yet.
        </Alert>
      );
    }
    if (!busData.trackingActive) {
      return (
        <Alert variant="warning">
          Bus is no longer sharing its location. The trip has ended or tracking is stopped.
        </Alert>
      );
    }
    return (
      <Alert variant="success">
        Bus location is currently <strong>LIVE</strong> and updating automatically every 5 seconds.
      </Alert>
    );
  };

  // Default fallback center to Sri Lanka (Colombo or current bus coordinate)
  const defaultPosition = hasCoordinates
    ? [busData.currentLocation.latitude, busData.currentLocation.longitude]
    : [6.9271, 79.8612];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <Link
            to="/search"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-navy-800 hover:text-orange-500 transition-colors"
          >
            ← Back to Bus Search
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-800 mt-1">Live Bus Tracking</h1>
        </div>
        {busData && (
          <div className="flex items-center gap-2.5">
            <StatusTag status={busData.status} />
            {isLive ? (
              <Badge variant="success" size="md" className="animate-pulse">
                ● LIVE TRACKING
              </Badge>
            ) : (
              <Badge variant="neutral" size="md">
                OFFLINE
              </Badge>
            )}
          </div>
        )}
      </div>

      {loading && <Loading />}

      {error && <Alert variant="danger" className="mb-6">{error}</Alert>}

      {busData && (
        <div className="space-y-6">
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-md bg-navy-50 text-navy-800 text-xs font-bold px-2 py-1">
                    {busData.busNumber}
                  </span>
                  <span className="text-lg font-bold text-navy-900">
                    {busData.from} <span className="text-orange-500">→</span> {busData.to}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-500 sm:text-right">
                <div>
                  <strong className="text-gray-700">Last updated:</strong>{' '}
                  {busData.currentLocation?.updatedAt
                    ? new Date(busData.currentLocation.updatedAt).toLocaleTimeString()
                    : 'N/A'}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  Checked at: {lastChecked.toLocaleTimeString()}
                </div>
              </div>
            </div>

            <div className="mt-4">
              {getStatusAlert()}
            </div>
          </Card>

          <Card className="p-2 sm:p-3 overflow-hidden">
            <div className="h-[460px] sm:h-[540px] w-full rounded-lg overflow-hidden border border-gray-100">
              {hasCoordinates ? (
                <MapContainer
                  center={defaultPosition}
                  zoom={14}
                  style={{ height: '100%', width: '100%' }}
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
                      <div className="text-center p-1 font-sans">
                        <strong className="text-navy-900 text-base">{busData.busNumber}</strong>
                        <div className="text-xs text-gray-600 my-1">{busData.route}</div>
                        <span
                          className={`inline-block text-xs font-bold px-2 py-0.5 rounded ${
                            isLive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
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
                <div className="h-full flex flex-col items-center justify-center bg-gray-50 text-gray-500 p-6 text-center">
                  <span className="text-4xl mb-3">🗺️</span>
                  <h3 className="text-base font-bold text-navy-800">Bus location is currently unavailable</h3>
                  <p className="text-sm text-gray-500 mt-1 max-w-sm">
                    Waiting for conductor to start location sharing from their dashboard.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TrackBusPage;

