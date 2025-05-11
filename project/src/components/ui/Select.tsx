import React, { forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  fullWidth?: boolean;
  onChange?: (value: string) => void;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, fullWidth = false, onChange, className = '', ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange?.(e.target.value);
    };

    const selectClasses = `
      block w-full px-4 py-2 rounded-md border border-gray-300 shadow-sm text-gray-900 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
      ${error ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500' : ''}
      ${className}
    `;

    const widthClasses = fullWidth ? 'w-full' : '';

    return (
      <div className={widthClasses}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        )}
        <select
          ref={ref}
          className={`${selectClasses} ${widthClasses}`}
          onChange={handleChange}
          {...props}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-rose-500">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;