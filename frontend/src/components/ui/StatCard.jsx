import Card from './Card.jsx';

const StatCard = ({ label, value, icon }) => {
  return (
    <Card className="flex items-center gap-4">
      <div className="rounded-lg bg-navy-50 p-3 text-navy-800 shrink-0">{icon}</div>
      <div>
        <p className="text-2xl font-extrabold text-navy-800 leading-tight">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </Card>
  );
};

export default StatCard;
