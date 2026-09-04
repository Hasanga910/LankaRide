import { Link } from 'react-router-dom';
import StatusTag from './StatusTag.jsx';

const BusCard = ({ bus }) => (
  <div className="card bus-card">
    <div>
      <div className="route" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
        <span>{bus.busNumber} — {bus.from} → {bus.to}</span>
        {bus.trackingActive && (
          <span className="tag tag-en-route" style={{ fontSize: '0.72rem' }}>
            ● LIVE
          </span>
        )}
      </div>
      <div className="muted" style={{ marginTop: '0.2rem' }}>
        Fare: Rs. {bus.fare} · Driver: {bus.driver?.name || 'N/A'} · Conductor:{' '}
        {bus.conductor?.name || 'Not assigned'}
      </div>
    </div>
    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <StatusTag status={bus.status} />
      </div>
      <div style={{ fontWeight: 700 }}>
        {bus.freeSeats} / {bus.capacity} seats free
      </div>
      {bus.trackingActive ? (
        <Link
          to={`/track/${bus._id}`}
          className="btn btn-small"
          style={{
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            background: 'var(--orange)',
          }}
        >
          📍 Track Bus
        </Link>
      ) : (
        <button
          className="btn btn-small btn-secondary"
          disabled
          style={{
            opacity: 0.55,
            cursor: 'not-allowed',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
          }}
          title="Location sharing has not been started by the conductor for this bus."
        >
          📍 Tracking Unavailable
        </button>
      )}
    </div>
  </div>
);

export default BusCard;


