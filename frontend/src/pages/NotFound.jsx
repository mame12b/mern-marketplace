import { Link } from 'react-router-dom';
import BackButton from '../components/common/BackButton';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-gray-900">404</h1>
        <h2 className="text-4xl font-semibold text-gray-700 mt-4 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8">The page you are looking for doesn't exist or has been moved.</p>
        
        <div className="flex gap-4 justify-center">
          <BackButton label="Go Back" />
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;