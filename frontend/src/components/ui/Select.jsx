const Select = ({ label, name, className = '', containerClassName = '', children, ...props }) => {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-navy-800 mb-1">
          {label}
        </label>
      )}
      <select
        id={name}
        name={name}
        className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 bg-white
          focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500
          ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export default Select;
