import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const DashboardRedirect = () => {
  const { user, token } = useSelector((state) => state.auth);

  // If not authenticated, redirect to login
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  switch (user.role) {
    case 'admin':
      return <Navigate to="/admin/dashboard" replace />;
    case 'seller':
      return <Navigate to="/seller/dashboard" replace />;
    case 'buyer':
      return <Navigate to="/buyer/dashboard" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};

export default DashboardRedirect;
