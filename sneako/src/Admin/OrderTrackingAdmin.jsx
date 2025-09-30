// components/OrderTrackingAdmin.jsx (Beautified - using Table layout)
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiTruck, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

const getStatusStyles = (status) => {
    switch (status) {
        case 'Processing': return 'bg-yellow-100 text-yellow-800';
        case 'Shipped': return 'bg-blue-100 text-blue-800';
        case 'Delivered': return 'bg-green-100 text-green-800';
        case 'Cancelled': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

function OrderTrackingAdmin() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch and merge order/user data (left unchanged as logic is good)
    useEffect(() => {
        const fetchOrdersAndUsers = async () => {
            try {
                const ordersResponse = await axios.get("http://localhost:3000/api/v1/orders");
                const usersResponse = await axios.get("http://localhost:3000/api/v1/users");
                
                const ordersData = ordersResponse.data;
                const usersData = usersResponse.data;

                const ordersWithUsers = ordersData.map(order => {
                    const user = usersData.find(u => String(u.id) === String(order.userId));
                    return { ...order, user };
                }).sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

                setOrders(ordersWithUsers);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to fetch order or user data.");
                setLoading(false);
            }
        };
        fetchOrdersAndUsers();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const orderToUpdate = orders.find(order => order.id === orderId);
            await axios.put(`http://localhost:3000/api/v1/orders/${orderId}`, { ...orderToUpdate, status: newStatus });
            setOrders(
                orders.map((order) =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (err) {
            console.error("Error updating order status:", err);
            setError("Failed to update order status.");
        }
    };

    if (loading) {
        return <div className="text-center p-8 text-gray-700">Loading orders...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-600">{error}</div>;
    }

    return (
        <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-3">
                    Order Management <FiTruck className="inline text-blue-600 mb-1" />
                </h1>

                {orders.length === 0 ? (
                    <p className="text-center text-gray-700 p-10 bg-white rounded-xl shadow-md">No orders have been placed yet.</p>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg overflow-x-auto border border-gray-100">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['Order ID', 'Customer', 'Date', 'Total (₹)', 'Status', 'Action'].map((header) => (
                                        <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{order.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{order.user ? order.user.name : 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.orderDate).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">₹{order.totalPrice.toLocaleString('en-IN')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {/* Status Dropdown */}
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className={`p-1 border rounded-md text-sm font-medium ${getStatusStyles(order.status)}`}
                                            >
                                                {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderTrackingAdmin;