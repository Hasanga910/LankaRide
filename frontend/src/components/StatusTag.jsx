import Badge from './ui/Badge.jsx';

const variantMap = {
  'Not Started': 'warning',
  'En Route': 'success',
  Arrived: 'info',
};

const StatusTag = ({ status }) => <Badge variant={variantMap[status] || 'neutral'}>{status}</Badge>;

export default StatusTag;
