const Card = ({ children, className = '', padded = true, as: Tag = 'div', ...props }) => {
  return (
    <Tag
      className={`bg-white rounded-xl border border-gray-100 shadow-sm ${padded ? 'p-5 sm:p-6' : ''} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Card;
