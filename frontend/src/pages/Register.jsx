import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {  useDispatch, useSelector } from 'react-redux';
import {  FaUser, FaEnvelope, FaLock } from 'react-icons/fa';
import {register , reset } from '../redux/slices/authSlice';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';
import Card from '../components/common/Card';
import Input from '../components/common/Input';


const Register = () => {
      const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'buyer',
      });
        const { firstName, lastName, email, password, confirmPassword, role } = formData;  

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
            navigate('/');
            toast.success('Registration successful');
          }
          dispatch(reset());
        }, [user, error, navigate, dispatch]);

        const onChange = (e) => {
          setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
          }));
        };

        const onSubmit = (e) => {
          e.preventDefault();

          if (!firstName || !lastName || !email || !password || !confirmPassword) {
            toast.error('Please fill in all fields');
            return;
          }

          if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
          }

          if (password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
          }

          const userData = {
            firstName,
            lastName,
            email,
            password,
            role,
          };

          dispatch(register(userData));
        };

    return (

     <div className="min-h-[calc(100vh-200px)] flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
          <p className="text-gray-600">Sign up to start shopping or selling</p>
        </div>

        <Card>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                name="firstName"
                value={firstName}
                onChange={onChange}
                placeholder="John"
                icon={FaUser}
                required
              />

              <Input
                label="Last Name"
                type="text"
                name="lastName"
                value={lastName}
                onChange={onChange}
                placeholder="Doe"
                icon={FaUser}
                required
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="john@example.com"
              icon={FaEnvelope}
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="At least 6 characters"
              icon={FaLock}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              placeholder="Confirm your password"
              icon={FaLock}
              required
            />

            {/* Role Selection */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    I want to
  </label>

  <div className="grid grid-cols-2 gap-3">
    <button
      type="button"
      onClick={() => setFormData({ ...formData, role: "buyer" })}
      className={`py-2 rounded-lg border text-sm font-medium transition
        ${role === "buyer"
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}
    >
      🛒 Buy Products
    </button>

    <button
      type="button"
      onClick={() => setFormData({ ...formData, role: "seller" })}
      className={`py-2 rounded-lg border text-sm font-medium transition
        ${role === "seller"
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"}`}
    >
      🏪 Sell Products
    </button>
  </div>
</div>
            {/* Terms and Conditions */}

            <div className="text-sm text-gray-600">
              By signing up, you agree to our{' '}
              <Link to="/terms" className="text-primary-600 hover:text-primary-700">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-primary-600 hover:text-primary-700">
                Privacy Policy
              </Link>
            </div>

            <Button
              type="submit"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;