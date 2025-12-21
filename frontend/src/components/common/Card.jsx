const Card = ({ children, className = "" }) => {
  return (
    <div className={`rounded-lg shadow p-4 bg-white ${className}`}>
      {children}
    </div>
  );
};

export default Card;
