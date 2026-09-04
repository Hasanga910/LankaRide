import StatusTag from './StatusTag.jsx';

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
    </div>
  </div>
);

export default BusCard;
