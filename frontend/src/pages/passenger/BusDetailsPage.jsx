import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import * as busService from '../../services/busService.js';
import StatusTag from '../../components/StatusTag.jsx';
import ErrorMessage from '../../components/ErrorMessage.jsx';
import Loading from '../../components/Loading.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Badge from '../../components/ui/Badge.jsx';

const getSeatBadge = (freeSeats) => {
  if (freeSeats === 0) return <Badge variant="danger">🔴 Full</Badge>;
  if (freeSeats <= 5) return <Badge variant="warning">🟠 Few seats left</Badge>;
  return <Badge variant="success">🟢 Seats available</Badge>;
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

  const fillPct = bus?.capacity ? Math.round((bus.freeSeats / bus.capacity) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-6">
      <div>
        <Button to="/search" variant="outline" size="sm">
          ← Back to Search
        </Button>
      </div>

      <ErrorMessage message={error} />

      {loading && <Loading />}

      {!loading && bus && (
        <>
          {/* Header Card */}
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <span className="inline-flex items-center rounded-md bg-navy-50 text-navy-800 text-xs font-bold px-2.5 py-1 mb-2">
                  🚌 {bus.busNumber}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-800">
                  {bus.from} <span className="text-orange-500">→</span> {bus.to}
                </h1>
              </div>
              <div className="shrink-0">
                <StatusTag status={bus.status} />
              </div>
            </div>
          </Card>

          {/* Seat Availability Card */}
          <Card>
            <h2 className="text-lg font-bold text-navy-800 mb-2">Seat Availability</h2>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
              <div>
                <div className="text-3xl font-extrabold text-navy-800">
                  {bus.freeSeats} <span className="text-base font-normal text-gray-500">/ {bus.capacity} seats free</span>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  {getSeatBadge(bus.freeSeats)}
                  {bus.updatedAt && (
                    <span className="text-xs text-gray-400">
                      Last updated: {new Date(bus.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </span>
                  )}
                </div>
              </div>

              <div className="shrink-0">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => fetchBus(true)}
                  loading={refreshing}
                  disabled={refreshing || loading}
                >
                  {refreshing ? 'Refreshing…' : 'Refresh Availability'}
                </Button>
              </div>
            </div>

            <div className="mt-4 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full bg-orange-500 transition-all duration-300" style={{ width: `${fillPct}%` }} />
            </div>
          </Card>

          {/* Bus & Staff Details Card */}
          <Card>
            <h2 className="text-lg font-bold text-navy-800 mb-4">Bus Details</h2>
            <div className="divide-y divide-gray-100 text-sm">
              <div className="py-3 flex justify-between items-center">
                <span className="font-semibold text-gray-500">Trip Fare</span>
                <span className="font-bold text-navy-800">Rs. {bus.fare}</span>
              </div>
              <div className="py-3 flex justify-between items-center">
                <span className="font-semibold text-gray-500">Driver</span>
                <span className="font-medium text-navy-800">{bus.driver?.name || 'N/A'}</span>
              </div>
              <div className="py-3 flex justify-between items-center">
                <span className="font-semibold text-gray-500">Driver Contact</span>
                <span>
                  {bus.driver?.contact ? (
                    <a href={`tel:${bus.driver.contact}`} className="text-orange-600 hover:text-orange-700 font-semibold underline">
                      {bus.driver.contact}
                    </a>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </span>
              </div>
              <div className="py-3 flex justify-between items-center">
                <span className="font-semibold text-gray-500">Conductor</span>
                <span className="font-medium text-navy-800">{bus.conductor?.name || 'Not assigned'}</span>
              </div>
              <div className="py-3 flex justify-between items-center">
                <span className="font-semibold text-gray-500">Conductor Contact</span>
                <span>
                  {bus.conductor ? (
                    bus.conductor.contact ? (
                      <a href={`tel:${bus.conductor.contact}`} className="text-orange-600 hover:text-orange-700 font-semibold underline">
                        {bus.conductor.contact}
                      </a>
                    ) : (
                      <span className="text-gray-400">N/A</span>
                    )
                  ) : (
                    <span className="text-gray-400">Not assigned</span>
                  )}
                </span>
              </div>
              <div className="py-3 flex justify-between items-center">
                <span className="font-semibold text-gray-500">Total Capacity</span>
                <span className="font-medium text-navy-800">{bus.capacity} seats</span>
              </div>
            </div>
          </Card>

          {/* Disclaimer */}
          <div className="rounded-lg bg-navy-50/50 border border-navy-100 p-4 text-xs text-gray-500 italic">
            Seat availability reflects the most recent manual conductor update and is not official
            transport-authority live data.
          </div>
        </>
      )}
    </div>
  );
};

export default BusDetailsPage;
