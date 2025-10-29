import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiTruck } from 'react-icons/fi';

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

  const token = JSON.parse(localStorage.getItem("user"))?.jwt;

  const fetchUserById = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:8085/api/v1/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return res.data;
    } catch (err) {
      console.error(`Error fetching user ${userId}:`, err);
      return null;
    }
  };

  useEffect(() => {
    const fetchOrdersWithUsers = async () => {
      try {
        const ordersRes = await axios.get("http://localhost:8085/api/v1/admin/orders", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const ordersData = ordersRes.data.content || ordersRes.data;

        const enrichedOrders = await Promise.all(
          ordersData.map(async (order) => {
            const user = await fetchUserById(order.userId);
            return {
              ...order,
              userName: user?.username || "Unknown"
            };
          })
        );

        setOrders(enrichedOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to fetch order or user data.");
        setLoading(false);
      }
    };

    fetchOrdersWithUsers();
  }, [token]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:8085/api/v1/admin/orders/${orderId}`, {
        orderStatus: newStatus
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setOrders(prev =>
        prev.map(order =>
          order.orderId === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Error updating order status:", err);
      setError("Failed to update order status.");
    }
  };

  if (loading) return <div className="text-center p-8 text-gray-700">Loading orders...</div>;
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-3">
          Order Management <FiTruck className="inline text-blue-600 mb-1" />
        </h1>

        {orders.length === 0 ? (
          <p className="text-center text-gray-700 p-10 bg-white rounded-xl shadow-md">
            No orders have been placed yet.
          </p>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-x-auto border border-gray-100">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['Order ID', 'Customer', 'Date', 'Total (₹)', 'Status', 'Action'].map(header => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map(order => (
                  <tr key={order.orderId || `${order.userId}-${order.orderDate}`} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{order.orderId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{order.userName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                      ₹{order.totalPrice ? order.totalPrice.toLocaleString('en-IN') : '0.00'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusStyles(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                        className={`p-1 border rounded-md text-sm font-medium ${getStatusStyles(order.orderStatus)}`}
                      >
                        {['Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(status => (
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
