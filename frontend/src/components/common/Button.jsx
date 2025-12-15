import PropTypes from 'prop-types';

const Button = ({
    children,
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    disabled = false,
    laoding = false,
    onclick,
    type = 'button',
    className = '',
}) => {
    const baseClasses = 'font-medium rounded-lg transition-all duration-200 flex items-center justify-center';

    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400',
        secondary: 'bg-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-400',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:border-blue-300 disabled:text-blue-300',
        danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400',
        success: 'bg-green-600 text-white hover:bg-green-700 disabled:bg-green-400',
    }; 
    const sizes = {
        small: 'px-3 py-1.5 text-sm',
        medium: 'px-4 py-2 text-base',
        large: 'px-5 py-3 text-lg',
    };

    const widthClass = fullWidth ? 'w-full' : 'w-auto';

    return (
        <button
            type={type}
            onClick={onclick}
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className} ${
                disabled || laoding ? 'cursor-not-allowed opacity-70' : 'cursor-pointer'}`}
            
        >
            {laoding ? (
                <>
                <svg className='animate-spin h-5 w-5' viewBox='0 0 24 24'>
                    <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' fill='none' />
                    <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z' />
                
                </svg>
                laoding...
                </>
            ) : (
                children
            )}
        </button>
    );

};

Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'danger', 'success']),
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    fullWidth: PropTypes.bool,
    disabled: PropTypes.bool,
    laoding: PropTypes.bool,
    onclick: PropTypes.func,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    className: PropTypes.string,
};

export default Button;