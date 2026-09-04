import { Link } from 'react-router-dom';
import StatusTag from './StatusTag.jsx';

const getSeatStatus = (freeSeats) => {
  if (freeSeats === 0) return '🔴 Full';
  if (freeSeats <= 5) return '🟠 Few seats left';
  return '🟢 Seats available';
};

const BusCard = ({ bus }) => (
  <div className="card bus-card">
    <div>
      <div className="route">
        {bus.busNumber} — {bus.from} → {bus.to}
      </div>
      <div className="muted">
        Fare: Rs. {bus.fare} · Driver: {bus.driver?.name || 'N/A'} · Conductor:{' '}
        {bus.conductor?.name || 'Not assigned'}
      </div>
    </div>
    <div style={{ textAlign: 'right' }}>
      <StatusTag status={bus.status} />
      <div style={{ marginTop: '0.4rem', fontWeight: 700 }}>
        {bus.freeSeats} / {bus.capacity} seats free
      </div>
      <div style={{ fontSize: '0.8rem', marginTop: '0.15rem' }}>
        {getSeatStatus(bus.freeSeats)}
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <Link
          to={`/passenger/buses/${bus._id}`}
          className="btn btn-small"
          style={{ textDecoration: 'none', display: 'inline-block' }}
        >
          View Details
        </Link>
      </div>
    </div>
  </div>
);

export default BusCard;

