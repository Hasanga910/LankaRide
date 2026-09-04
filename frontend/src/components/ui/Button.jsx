import { Link } from 'react-router-dom';

const variantClasses = {
  primary: 'bg-orange-500 text-white hover:bg-orange-600 focus-visible:ring-orange-500/50',
  secondary: 'bg-navy-800 text-white hover:bg-navy-900 focus-visible:ring-navy-800/50',
  outline: 'border border-navy-800 text-navy-800 bg-transparent hover:bg-navy-50 focus-visible:ring-navy-800/40',
  'outline-white': 'border border-white text-white bg-transparent hover:bg-white/10 focus-visible:ring-white/40',
  ghost: 'text-navy-800 bg-transparent hover:bg-navy-50 focus-visible:ring-navy-800/30',
  danger: 'bg-danger text-white hover:opacity-90 focus-visible:ring-danger/50',
};

const sizeClasses = {
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2.5 gap-2',
};

const Button = ({
  variant = 'primary',
  size = 'md',
  as,
  to,
  href,
  loading = false,
  disabled = false,
  className = '',
  children,
  ...props
}) => {
  const classes = `inline-flex items-center justify-center rounded-md font-semibold transition-colors
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
    disabled:opacity-60 disabled:cursor-not-allowed
    ${variantClasses[variant] || variantClasses.primary}
    ${sizeClasses[size] || sizeClasses.md}
    ${className}`;

  const content = (
    <>
      {loading && (
        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {children}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }

  return (
    <button type={props.type || 'button'} className={classes} disabled={disabled || loading} {...props}>
      {content}
    </button>
  );
};

export default Button;
