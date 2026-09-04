const classMap = {
  'Not Started': 'tag tag-not-started',
  'En Route': 'tag tag-en-route',
  Arrived: 'tag tag-arrived',
};

const StatusTag = ({ status }) => <span className={classMap[status] || 'tag'}>{status}</span>;

export default StatusTag;
