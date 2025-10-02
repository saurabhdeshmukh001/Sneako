import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function OrderConfirmation() {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const location = useLocation();
    
    const { order } = location.state || {};

    if (!order || !order.products) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                <Navbar />
                <p className="text-xl text-red-600 font-semibold mt-20">
                    Order details not found. Please check your order history.
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
                            <p className="text-lg font-bold text-black">{order.id}</p>
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
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Items ({order.products.length})</h2>
                        
                        <div className="max-h-60 overflow-y-auto space-y-4 p-3 border rounded-lg bg-white shadow-inner">
                            {order.products.map((item, index) => (
                                <div key={index} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-800">{item.name}</span>
                                        <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                                    </div>
                                    <span className="font-bold text-gray-900">
                                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
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
                            <p className="text-gray-600">Method: <strong>{order.paymentMethod}</strong></p>
                            <p className="text-gray-600">Status: {order.status}</p>
                            <p className="text-sm text-gray-500 mt-2">Tracking ID: <span className="font-mono text-black">{order.trackingNumber}</span></p>
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
            {/* <Footer /> */}
        </div>
    );
}

export default OrderConfirmation;