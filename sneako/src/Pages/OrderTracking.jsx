import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const getDeliveryDate = (dateString, days = 7) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
};

const TrackingSegment = ({ isComplete, isCurrent, children }) => (
    <div className={`flex flex-col items-center z-10 w-1/4 relative`}>
        <div 
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl transition-all duration-500 transform 
            ${isComplete 
                ? 'bg-black text-white scale-100 shadow-lg' 
                : isCurrent 
                    ? 'bg-red-600 text-white scale-105 shadow-xl' 
                    : 'bg-gray-200 text-gray-700 scale-90 border-2 border-gray-400' 
            }`}
        >
            {isComplete ? '✔' : children.charAt(0)}
        </div>
        <span className={`mt-3 text-sm font-semibold text-center transition-colors duration-500 
            ${isComplete || isCurrent ? 'text-gray-900' : 'text-gray-500' 
            }`}>
            {children}
        </span>
    </div>
);


function OrderTracking() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
 
    useEffect(() => {
        const fetchOrderAndProducts = async () => {
            try {
                const orderResponse = await axios.get(`http://localhost:3000/api/v1/orders/${orderId}`);
                const fetchedOrder = orderResponse.data;
                const productIds = fetchedOrder.products.map(item => item.productId);
                const productRequests = productIds.map(id => 
                    axios.get(`http://localhost:3000/api/v1/products/${id}`)
                );

                const productResponses = await Promise.all(productRequests);
                const productsData = productResponses.map(res => res.data);

                const mergedProducts = fetchedOrder.products.map(item => {
                    const productDetail = productsData.find(p => p.id === item.productId);
                    return {
                        ...item,
                        image: productDetail ? productDetail.image : null,
                    };
                });
                setOrder({
                    ...fetchedOrder,
                    products: mergedProducts
                });  
                setLoading(false);
            } catch (err) {
                console.error("Error fetching order/product details:", err);
                setError('Order not found or an error occurred. Ensure your JSON server is running and the product IDs are correct.');
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderAndProducts();
        }
    }, [orderId]);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex-grow text-center mt-20 text-xl font-semibold text-gray-700">Loading order details...</div>
                <Footer />
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex-grow text-center mt-20 text-2xl font-bold text-red-600">{error}</div>
                <Footer />
            </div>
        );
    }

    const orderStatus = order.status;
    const trackingStepsData = [
        { status: 'Confirmed', isComplete: true, label: 'Confirmed' },
        { status: 'Processing', isComplete: ['Processing', 'Shipped', 'Delivered'].includes(orderStatus), label: 'Processing' },
        { status: 'Shipped', isComplete: ['Shipped', 'Delivered'].includes(orderStatus), label: 'Shipped' },
        { status: 'Delivered', isComplete: orderStatus === 'Delivered', label: 'Delivered' },
    ];
    
    let lastCompletedIndex = -1;
    for (let i = trackingStepsData.length - 1; i >= 0; i--) {
        if (trackingStepsData[i].isComplete) {
            lastCompletedIndex = i;
            break;
        }
    }

    const progressBarWidth = lastCompletedIndex === -1 ? 0 : (lastCompletedIndex / (trackingStepsData.length - 1)) * 100;
    const estimatedDelivery = getDeliveryDate(order.orderDate, 7); 


    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <br />
            <main className="flex-grow min-h-40vh">
                <div className="max-w-xl  mx-auto px-2 sm:px-3 lg:px-4 py-6 mb-0 mt-10 pb-10"> 
                    <div className="bg-white p-3 lg:p-4 rounded-2xl shadow-xl pb-10">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Order Tracking</h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Order ID: <strong>{order.id}</strong> | Tracking Number: <strong>{order.trackingNumber}</strong>
                        </p>

                        <div className="relative my-12 pt-4 pb-4">
                            <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-200 transform -translate-y-1/2 z-0 rounded-full"></div>
                            <div className="absolute top-1/2 left-0 h-2 bg-green-500 transform -translate-y-1/2 z-0 rounded-full transition-all duration-700 ease-in-out" style={{ width: `${progressBarWidth}%` }}
                            ></div>
                            <div className="flex justify-between items-start">
                                {trackingStepsData.map((step, index) => (
                                    <TrackingSegment key={step.status} isComplete={step.isComplete} isCurrent={orderStatus === step.status}>
                                        {step.label}
                                    </TrackingSegment>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-between items-center bg-black text-white p-6 rounded-lg my-10">
                            <div>
                                <p className="text-lg text-gray-300">Current Status</p>
                                <p className={`text-3xl font-extrabold mt-1 transition-colors duration-500 ${orderStatus === 'Delivered' ? 'text-green-400' : 'text-white'}`}>
                                    {orderStatus}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-lg text-gray-300">Estimated Delivery</p>
                                <p className="text-3xl font-extrabold mt-1 text-yellow-400">
                                    {orderStatus === 'Delivered' ? 'Delivered!' : estimatedDelivery}
                                </p>
                            </div>
                        </div>

                        <div className="text-left border-t pt-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary ({order.products.length} Items)</h2>
                            
                            <div className="max-h-[200px] overflow-y-auto space-y-3 pr-2">
                                {order.products.map((item, index) => (
                                    <div key={index} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg flex-shrink-0 border border-gray-300" />
                                            ) : (
                                                <div className="w-12 h-12 bg-gray-300 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-600 text-xs font-semibold">
                                                    No Img
                                                </div>
                                            )}
                                            
                                            <div>
                                                <span className="font-semibold text-gray-800">{item.name}</span>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity}{item.size && ` | Size: ${item.size}`}</p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-lg text-gray-900">
                                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex justify-between items-center text-2xl font-extrabold border-t pt-4 mt-4">
                                <span>Total Paid</span>
                                <span className="text-red-600">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            {/* <Footer /> */}
        </div>
    );
}

export default OrderTracking;