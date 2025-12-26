import { useSelector } from 'react-redux';

const useAuth = () => {
  const { user, token, loading } = useSelector((state) => state.auth);

  return {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    isSeller: user?.role === 'seller',
    isBuyer: user?.role === 'buyer',
  };
};

export default useAuth;
