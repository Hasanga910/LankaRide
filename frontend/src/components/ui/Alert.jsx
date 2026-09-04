const variantClasses = {
  error: 'bg-danger-bg border-danger text-danger',
  success: 'bg-success-bg border-success text-success',
  info: 'bg-info-bg border-info text-info',
  warning: 'bg-warning-bg border-warning text-warning',
};

const Alert = ({ variant = 'info', className = '', children }) => {
  if (!children) return null;
  return (
    <div
      className={`border rounded-md px-3 py-2 text-sm mb-4 ${variantClasses[variant] || variantClasses.info} ${className}`}
    >
      {children}
    </div>
  );
};

export default Alert;
