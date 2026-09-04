const Input = ({ label, name, className = '', containerClassName = '', ...props }) => {
  return (
    <div className={`mb-4 ${containerClassName}`}>
      {label && (
        <label htmlFor={name} className="block text-sm font-semibold text-navy-800 mb-1">
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900
          placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500
          disabled:bg-gray-50 disabled:text-gray-400
          ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
