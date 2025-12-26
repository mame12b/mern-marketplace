import BackButton from '../components/common/BackButton';

const Checkout = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton to="/cart" label="Back to Cart" />
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>
    </div>
  );
};

export default Checkout;
