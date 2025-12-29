import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Rating = ({ value, text, color = '#f8e825' }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (value >= i) {
      stars.push(<FaStar key={i} style={{ color }} />);
    } else if (value >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} style={{ color }} />);
    } else {
      stars.push(<FaRegStar key={i} style={{ color }} />);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {stars}
      </div>
      {text && <span className="ml-2 text-sm text-gray-600">{text}</span>}
    </div>
  );
};

export default Rating;