import StatusTag from './StatusTag.jsx';
import Card from './ui/Card.jsx';
import Button from './ui/Button.jsx';
import Badge from './ui/Badge.jsx';

const getSeatBadge = (freeSeats) => {
  if (freeSeats === 0) return <Badge variant="danger">🔴 Full</Badge>;
  if (freeSeats <= 5) return <Badge variant="warning">🟠 Few seats left</Badge>;
  return <Badge variant="success">🟢 Seats available</Badge>;
};

const BusCard = ({ bus }) => {
  const fillPct = bus.capacity ? Math.round((bus.freeSeats / bus.capacity) * 100) : 0;

  return (
    <Card className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-gray-200 transition-colors">
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center rounded-md bg-navy-50 text-navy-800 text-xs font-bold px-2 py-1">
            {bus.busNumber}
          </span>
          <span className="font-bold text-navy-800 text-base sm:text-lg">
            {bus.from} <span className="text-orange-500">→</span> {bus.to}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Fare: Rs. {bus.fare} · Driver: {bus.driver?.name || 'N/A'} · Conductor:{' '}
          {bus.conductor?.name || 'Not assigned'}
        </p>
      </div>

      <div className="flex flex-col sm:items-end gap-1.5 shrink-0">
        <div className="flex items-center gap-2 flex-wrap">
          <StatusTag status={bus.status} />
          {getSeatBadge(bus.freeSeats)}
        </div>
        <div className="font-bold text-navy-800 text-sm sm:text-base">
          {bus.freeSeats} / {bus.capacity} seats free
        </div>
        <div className="h-1.5 w-32 rounded-full bg-gray-100 overflow-hidden sm:ml-auto">
          <div className="h-full rounded-full bg-orange-500" style={{ width: `${fillPct}%` }} />
        </div>
        <div className="mt-2">
          <Button to={`/passenger/buses/${bus._id}`} variant="outline" size="sm">
            View Details →
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BusCard;
