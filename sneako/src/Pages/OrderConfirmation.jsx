import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

function OrderConfirmation() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = user?.jwt;

        const res = await axios.get(`http://localhost:8085/api/v1/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setOrder(res.data);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError('Failed to load order details.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Navbar />
        <p className="text-xl font-semibold text-gray-700 mt-20">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <Navbar />
        <p className="text-xl text-red-600 font-semibold mt-20">
          {error || 'Order not found. Please check your order history.'}
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-6 bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  const orderDate = new Date(order.orderDate).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 mt-10">
        <div className="bg-white p-8 lg:p-12 rounded-2xl shadow-2xl border-t-8 border-green-500">
          <div className="text-center mb-8">
            <div className="text-green-500 text-7xl mb-4 font-extrabold">🎉</div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-2">
              Order Confirmed!
            </h1>
            <p className="text-lg text-gray-600">
              Your fresh kicks are on the way. We've sent a receipt to your email.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 text-center border-y py-4 bg-gray-50 rounded-lg">
            <div className="p-2">
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="text-lg font-bold text-black">{order.orderId}</p>
            </div>
            <div className="p-2 border-x md:border-gray-200">
              <p className="text-sm text-gray-500">Order Total</p>
              <p className="text-xl font-extrabold text-red-600">₹{order.totalPrice.toLocaleString('en-IN')}</p>
            </div>
            <div className="p-2">
              <p className="text-sm text-gray-500">Delivery Estimate</p>
              <p className="text-lg font-bold text-black">5-7 Business Days</p>
            </div>
          </div>

          <div className="text-left mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Items ({order.orderItems.length})</h2>

            <div className="max-h-60 overflow-y-auto space-y-4 p-3 border rounded-lg bg-white shadow-inner">
              {order.orderItems.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                  <div className="flex flex-col">
                    <span className="font-semibold text-gray-800">Product ID: {item.productId}</span>
                    <span className="text-sm text-gray-500">Qty: {item.quantity} | Size: {item.size}</span>
                  </div>
                  <span className="font-bold text-gray-900">
                    ₹{item.totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8 text-left">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Shipping To</h3>
              <p className="text-gray-600">{order.shippingAddress}</p>
              <p className="text-sm text-gray-500 mt-2">Placed on: {orderDate}</p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Details</h3>
              <p className="text-gray-600">Method: <strong>UPI</strong></p>
              <p className="text-gray-600">Status: Paid</p>
              <p className="text-sm text-gray-500 mt-2">Tracking ID: <span className="font-mono text-black">TRACK-{order.orderId}</span></p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mt-6">
            <button onClick={() => navigate(`/order-tracking/${orderId}`, { state: { order } })} className="flex-1 bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition shadow-md">
              Track My Order 🚀
            </button>
            <button onClick={() => navigate('/home')} className="flex-1 bg-white text-black border border-black py-3 rounded-lg font-bold hover:bg-gray-100 transition shadow-md">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
