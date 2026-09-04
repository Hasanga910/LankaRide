const Logo = ({ size = 32, variant = 'full', tone = 'default', className = '' }) => {
  const inverted = tone === 'inverted';
  const circleFill = inverted ? '#ffffff' : '#0b1f4e';
  const glyphFill = inverted ? '#0b1f4e' : '#ffffff';
  const wordmarkClass = inverted ? 'text-white' : 'text-navy-800';

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <circle cx="16" cy="16" r="16" fill={circleFill} />
        <rect x="8" y="11" width="16" height="10" rx="3" fill={glyphFill} />
        <rect x="10.5" y="13.2" width="4.5" height="4" rx="1" fill={circleFill} />
        <rect x="17" y="13.2" width="4.5" height="4" rx="1" fill={circleFill} />
        <circle cx="11.5" cy="22" r="1.6" fill={circleFill} />
        <circle cx="20.5" cy="22" r="1.6" fill={circleFill} />
        <circle cx="23.5" cy="9.5" r="2.2" fill="#e96a25" />
      </svg>
      {variant === 'full' && (
        <span className={`font-extrabold tracking-tight ${wordmarkClass}`} style={{ fontSize: size * 0.5 }}>
          Lanka<span className="text-orange-500">Ride</span>
        </span>
      )}
    </span>
  );
};

export default Logo;
