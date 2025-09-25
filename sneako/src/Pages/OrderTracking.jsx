// pages/OrderTracking.jsx (FINAL FIX: Footer Collision Solved with Cleaned Spacing)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Helper function to calculate an estimated delivery date
const getDeliveryDate = (dateString, days = 7) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
};

// Helper component for a single tracking segment
const TrackingSegment = ({ isComplete, isCurrent, children }) => (
    <div className={`flex flex-col items-center z-10 w-1/4 relative`}>
        {/* Status Circle */}
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
        {/* Status Label */}
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
                // 1. Fetch the Order details
                const orderResponse = await axios.get(`http://localhost:5001/orders/${orderId}`);
                const fetchedOrder = orderResponse.data;

                // 2. Extract unique product IDs
                const productIds = fetchedOrder.products.map(item => item.productId);
                
                // 3. Create an array of API calls to fetch product details (including images)
                const productRequests = productIds.map(id => 
                    axios.get(`http://localhost:5001/products/${id}`)
                );

                // 4. Run all product requests simultaneously
                const productResponses = await Promise.all(productRequests);
                const productsData = productResponses.map(res => res.data);

                // 5. Merge product images/details into the order items
                const mergedProducts = fetchedOrder.products.map(item => {
                    const productDetail = productsData.find(p => p.id === item.productId);
                    return {
                        ...item,
                        image: productDetail ? productDetail.image : null, // Add the image URL
                    };
                });

                // 6. Update the order object with merged products and set state
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

    // --- Loading & Error States (with Flexbox for Footer) ---
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

    // --- Component Logic ---
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

    const progressBarWidth = lastCompletedIndex === -1 
        ? 0 
        : (lastCompletedIndex / (trackingStepsData.length - 1)) * 100;
    
    const estimatedDelivery = getDeliveryDate(order.orderDate, 7); 


    return (
        // Outermost container uses flex to push the footer down, without bottom padding
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            
            {/* Main content container wrapped in <main> with flex-grow to push footer down */}
            <main className="flex-grow min-h-40vh">
                <div className="max-w-xl  mx-auto px-2 sm:px-3 lg:px-4 py-6 mb-0 mt-10 pb-10"> 
                    
                    {/* The Order Card - This is where the visual gap is needed at the bottom */}
                    <div className="bg-white p-3 lg:p-4 rounded-2xl shadow-xl pb-10">

                        <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Order Tracking</h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Order ID: **{order.id}** | Tracking Number: **{order.trackingNumber}**
                        </p>

                        {/* Tracking Progress Bar */}
                        <div className="relative my-12 pt-4 pb-4">
                            
                            {/* Background Line - Perfectly centered */}
                            <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-200 transform -translate-y-1/2 z-0 rounded-full"></div>
                            
                            {/* Progress Line - Perfectly centered */}
                            <div 
                                className="absolute top-1/2 left-0 h-2 bg-green-500 transform -translate-y-1/2 z-0 rounded-full transition-all duration-700 ease-in-out"
                                style={{ width: `${progressBarWidth}%` }}
                            ></div>
                            
                            {/* Status Circles and Labels */}
                            <div className="flex justify-between items-start">
                                {trackingStepsData.map((step, index) => (
                                    <TrackingSegment
                                        key={step.status}
                                        isComplete={step.isComplete}
                                        isCurrent={orderStatus === step.status}
                                    >
                                        {step.label}
                                    </TrackingSegment>
                                ))}
                            </div>
                        </div>

                        {/* Current Status and Delivery Info */}
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

                        {/* Order Details / Items Summary */}
                        <div className="text-left border-t pt-8">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary ({order.products.length} Items)</h2>
                            
                            {/* Item List */}
                            <div className="max-h-[200px] overflow-y-auto space-y-3 pr-2">
                                {order.products.map((item, index) => (
                                    <div key={index} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                                        <div className="flex items-center space-x-4">
                                            
                                            {/* Render actual image or use a text placeholder */}
                                            {item.image ? (
                                                <img 
                                                    src={item.image} 
                                                    alt={item.name} 
                                                    className="w-12 h-12 object-cover rounded-lg flex-shrink-0 border border-gray-300" 
                                                />
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
                            
                            {/* Total Paid / Grand Total Section */}
                            {/* This section is what was colliding with the footer in your video. 
                                It is the last element inside the card, followed by the gap created by the pb-12 on the outer container.
                            */}
                            <div className="flex justify-between items-center text-2xl font-extrabold border-t pt-4 mt-4">
                                <span>Total Paid</span>
                                <span className="text-red-600">₹{order.totalPrice.toLocaleString('en-IN')}</span>
                            </div>

                        </div>
                    </div>
                </div>
            </main>
            {/* The Footer is now correctly pushed to the end of the full scrollable page content. */}
            <Footer />
        </div>
    );
}

export default OrderTracking;