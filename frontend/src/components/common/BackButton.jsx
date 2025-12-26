import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import PropTypes from 'prop-types';

const BackButton = ({ to, label = 'Back', className = '' }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-4 ${className}`}
    >
      <FaArrowLeft className="text-sm" />
      <span className="font-medium">{label}</span>
    </button>
  );
};

BackButton.propTypes = {
  to: PropTypes.string,
  label: PropTypes.string,
  className: PropTypes.string,
};

export default BackButton;
