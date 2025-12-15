import PropTypes from 'prop-types';

const Input = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder ,
    error,
    disabled = false,
    required = false,
    className = ' ',
    icon: Icon,
    ...props
}) => {
    return (
        <div className={`flex flex-col mb-4 ${className}`}>
            {label && (
                <label htmlFor={name} className="mb-2 font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                )}
                <input
                    type={type}
                    name={name}
                    id={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    className={ `
                        input-field
                        ${Icon ? 'pl-10' : 'pl-3'}
                        ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}
                        ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
                        w-full py-2 pr-3 rounded-md shadow-sm transition duration-200
                    `}
                    {...props}
                />
            </div>
            {error && 
            <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
    );
    
};

Input.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    error: PropTypes.string,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    className: PropTypes.string,
    icon: PropTypes.elementType,
};

export default Input;