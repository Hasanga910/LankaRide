const variantClasses = {
  success: 'bg-success-bg text-success',
  warning: 'bg-warning-bg text-warning',
  info: 'bg-info-bg text-info',
  danger: 'bg-danger-bg text-danger',
  neutral: 'bg-gray-100 text-gray-700',
  orange: 'bg-orange-100 text-orange-700',
};

const Badge = ({ variant = 'neutral', className = '', children }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold whitespace-nowrap
        ${variantClasses[variant] || variantClasses.neutral} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
