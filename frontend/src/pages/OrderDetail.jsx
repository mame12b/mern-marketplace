import BackButton from '../components/common/BackButton';

const OrderDetail  = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton to="/orders" label="Back to Orders" />
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Order Details</h1>
    </div>
  );
};

export default OrderDetail;