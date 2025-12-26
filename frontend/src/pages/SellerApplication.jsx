import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { applyForSeller } from '../services/sellerService';
import { login } from '../redux/slices/authSlice';
import { toast } from 'react-toastify';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import BackButton from '../components/common/BackButton';
import { FaStore, FaCreditCard, FaCheckCircle } from 'react-icons/fa';

const SellerApplication = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);

    const [formData, setFormData] = useState({
        paymentMethod: 'card',
        transactionId: '',
        cardNumber: '',
        cardExpiry: '',
        cardCVV: '',
        agreedToTerms: false
    });
    const [loading, setLoading] = useState(false);

    const APPLICATION_FEE = 50; // $50 application fee

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.agreedToTerms) {
            toast.error('Please agree to the terms and conditions');
            return;
        }

        if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCVV) {
            toast.error('Please fill in all payment details');
            return;
        }

        setLoading(true);
        try {
            // Simulate transaction ID generation (in production, this would come from payment gateway)
            const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            const result = await applyForSeller({
                paymentMethod: formData.paymentMethod,
                transactionId: transactionId
            });

            // Update user in Redux store
            dispatch(login(result.user));

            toast.success(result.message);
            navigate('/seller/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to process application');
        } finally {
            setLoading(false);
        }
    };

    // If user is already a seller with paid fee, redirect to dashboard
    if (user?.role === 'seller' && user?.sellerApplicationFeePaid) {
        navigate('/seller/dashboard');
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <BackButton />
                
                <div className="text-center mb-8 mt-4">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full mb-4 shadow-lg">
                        <FaStore className="text-white text-4xl" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Become a Seller</h1>
                    <p className="text-lg text-gray-600">Start selling your products on our marketplace</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Benefits Section */}
                    <Card className="h-fit">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Seller Benefits</h2>
                        <ul className="space-y-4">
                            {[
                                'Reach thousands of customers',
                                'Easy product management',
                                'Secure payment processing',
                                'Real-time analytics',
                                'Marketing support',
                                '24/7 seller support'
                            ].map((benefit, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <FaCheckCircle className="text-green-500 text-xl mt-1 flex-shrink-0" />
                                    <span className="text-gray-700">{benefit}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200">
                            <h3 className="font-bold text-gray-900 mb-2">One-Time Application Fee</h3>
                            <p className="text-4xl font-bold text-blue-600 mb-2">${APPLICATION_FEE}</p>
                            <p className="text-sm text-gray-600">No monthly fees • Unlimited products</p>
                        </div>
                    </Card>

                    {/* Payment Form */}
                    <Card>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Information</h2>
                                <p className="text-gray-600 mb-6">Complete your seller application</p>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <FaCreditCard className="inline mr-2" />
                                    Card Number
                                </label>
                                <input
                                    type="text"
                                    name="cardNumber"
                                    value={formData.cardNumber}
                                    onChange={handleChange}
                                    placeholder="1234 5678 9012 3456"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    maxLength="19"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Expiry Date
                                    </label>
                                    <input
                                        type="text"
                                        name="cardExpiry"
                                        value={formData.cardExpiry}
                                        onChange={handleChange}
                                        placeholder="MM/YY"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        maxLength="5"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        CVV
                                    </label>
                                    <input
                                        type="text"
                                        name="cardCVV"
                                        value={formData.cardCVV}
                                        onChange={handleChange}
                                        placeholder="123"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        maxLength="3"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-700 font-semibold">Total Amount:</span>
                                    <span className="text-2xl font-bold text-blue-600">${APPLICATION_FEE}</span>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    name="agreedToTerms"
                                    checked={formData.agreedToTerms}
                                    onChange={handleChange}
                                    className="mt-1"
                                    required
                                />
                                <label className="text-sm text-gray-600">
                                    I agree to the seller terms and conditions and understand that the ${APPLICATION_FEE} application fee is non-refundable
                                </label>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50">
                                {loading ? 'Processing...' : `Pay $${APPLICATION_FEE} & Become a Seller`}
                            </Button>

                            <p className="text-xs text-gray-500 text-center">
                                🔒 Your payment information is secure and encrypted
                            </p>
                        </form>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SellerApplication;
