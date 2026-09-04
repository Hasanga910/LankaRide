import StatusTag from './StatusTag.jsx';
import Card from './ui/Card.jsx';

const BusCard = ({ bus }) => {
  const fillPct = bus.capacity ? Math.round((bus.freeSeats / bus.capacity) * 100) : 0;

  return (
    <Card className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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

      <div className="sm:text-right shrink-0">
        <StatusTag status={bus.status} />
        <div className="mt-2 font-bold text-navy-800">
          {bus.freeSeats} / {bus.capacity} seats free
        </div>
        <div className="mt-1 h-1.5 w-32 rounded-full bg-gray-100 overflow-hidden sm:ml-auto">
          <div className="h-full rounded-full bg-orange-500" style={{ width: `${fillPct}%` }} />
        </div>
      </div>
    </Card>
  );
};

export default BusCard;
