import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {  useDispatch, useSelector } from 'react-redux';
import {  FaEnvelope, FaLock } from 'react-icons/fa';
import { login , reset } from '../redux/slices/authSlice';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';
import Card from '../components/common/Card';
import Input from '../components/common/Input';



const Login = () => {
   const [formData, setFormData] = useState({
      email: '',
      password: '',
   });

   const { email, password } = formData;

   const navigate = useNavigate();
   const dispatch = useDispatch();

   const { user,  loading,  error} = useSelector(
      (state) => state.auth
   );

   useEffect(() => {
      if (error) {
         toast.error(error);
         dispatch(reset());
      }
      if (user) {
         navigate('/products');
      }
   }, [user, error, navigate, dispatch]);

   const onChange = (e) => {
      setFormData((prev) => ({
         ...prev,
         [e.target.name]: e.target.value,
      }));
   };

   const onSubmit = (e) => {
      e.preventDefault();

      if (!email || !password) {
         toast.error('Please fill in all fields');
         return;
      }

  

      dispatch(login({ email, password }));
   };

  return (
    <div className='min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 py-12 px-4' >
      <div className='max-w-md w-full'>
        <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Welcome Back</h1>
        <p className='text-gray-600'>Login to your account</p>
      </div>
      
      <Card>
        <form onSubmit={onSubmit} className='space-y-6'>
        <Input
          label = "Email"
          type="email"
          name="email"
          value={email}
          onChange={onChange}
          placeholder="Enter your email"
          icon={FaEnvelope }
        />

        <Input
          label = "Password"
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          placeholder="Enter your password"
          icon={ FaLock }
        />

        <div className='flex items-center justify-between'>
          <label className='flex items-center'>
            <input  type="checkbox"  />
            
            Remember me
          </label>

          <Link 
             to="/forgot-password" 
             className='text-sm text-blue-600 hover:underline'>
            Forgot password?
          </Link>
        </div>

        <Button 
          type="submit" 
          fullWidth
          loading={loading}
          disabled={loading}
        >

        sign in
        </Button>
      </form>

      <div className=' mt-6 text-center'>
        <p className='text-gray-600'>
          Don't have an account?{' '}
          <Link to="/register" 
            className='text-blue-600 hover:underline'>
            Sign up
          </Link>
        </p>
      </div>
    </Card>

    {/* Demo Accounts */}
    {/* <Card className='mt-4 bg-blue-50 p-4'>
      <h3 className='font-semibold mb-2'>Demo Accounts</h3>
      <div className='text-sm space-y-1'>
        <p><strong>Admin:</strong> admin@example.com / password123</p>
        <p><strong>Buyer:</strong> buyer@example.com / password123</p>
        <p><strong>Seller:</strong> seller@example.com / password123</p>

       </div>
     </Card> */}
    </div>
  </div>
  );
}; 

export default Login;