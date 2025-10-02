import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import ProfileInformation from "./ProfileInformation";
import CustomerOrderDetails from "./CustomerOrderDetails"; 
import { fetchUsers, fetchOrders, fetchUserAddresses } from "../api/api";

function Profile() {
    const [activeTab, setActiveTab] = useState("Profile");
    const [addresses, setAddresses] = useState([]);
    const [shippingAddresses, setShippingAddresses] = useState([]);
    const navigate = useNavigate();

    // Redirect to login if user is not authenticated
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchAddresses = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                try {
                    const userAddresses = await fetchUserAddresses(user.id);
                    setAddresses(userAddresses);
                } catch (error) {
                    setAddresses([]);
                }
            }
        };
        fetchAddresses();
    }, []);

    useEffect(() => {
        const fetchShippingAddresses = async () => {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const user = JSON.parse(storedUser);
                try {
                    const orders = await fetchOrders();
                    const userOrders = orders.filter(order => order.userId === user.id);
                    const shippingAddrs = userOrders
                        .map(order => order.shippingAddress)
                        .filter(address => address != null);
                    setShippingAddresses(shippingAddrs);
                } catch (error) {
                    setShippingAddresses([]);
                }
            }
        };
        fetchShippingAddresses();
    }, []);

    return (
        <div>
            <Navbar />
            <div className="pt-20 px-4 md:px-8 lg:px-12 pb-8 bg-gray-100 min-h-screen">
                <div className="max-w-6xl mx-auto">
                    {/* Tab Navigation */}
                    <div className="bg-white p-2 rounded-lg shadow-md flex justify-around mb-8">
                        <button
                            onClick={() => setActiveTab("Profile")}
                            className={`py-2 px-6 rounded-md font-medium text-lg transition-all duration-300 flex items-center space-x-2 ${
                                activeTab === "Profile" ? "bg-blue-500 text-white shadow-lg" : "text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            <span>Profile</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("Orders")}
                            className={`py-2 px-6 rounded-md font-medium text-lg transition-all duration-300 flex items-center space-x-2 ${
                                activeTab === "Orders" ? "bg-blue-500 text-white shadow-lg" : "text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            <span>Orders</span>
                        </button>
                    
                        <button
                            onClick={() => setActiveTab("Shipping")}
                            className={`py-2 px-6 rounded-md font-medium text-lg transition-all duration-300 flex items-center space-x-2 ${
                                activeTab === "Shipping" ? "bg-blue-500 text-white shadow-lg" : "text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            <span>Shipping Addresses</span>
                        </button>
                        <button
                            onClick={() => setActiveTab("Payment")}
                            className={`py-2 px-6 rounded-md font-medium text-lg transition-all duration-300 flex items-center space-x-2 ${
                                activeTab === "Payment" ? "bg-blue-500 text-white shadow-lg" : "text-gray-700 hover:bg-gray-100"
                            }`}
                        >
                            <span>Payment</span>
                        </button>
                    </div>

                    <div className="bg-white p-8 rounded-lg shadow-md">
                        {activeTab === "Profile" && <ProfileInformation />}
                        {activeTab === "Orders" && <CustomerOrderDetails />} 
                        {activeTab === "Addresses" && (
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">Your Addresses</h2>
                                {addresses.length > 0 ? (
                                    <ul className="space-y-4">
                                        {addresses.map((address, index) => (
                                            <li key={index} className="border p-4 rounded-md bg-gray-50">
                                                <p>{address.street}</p>
                                                <p>{address.city}, {address.state} {address.zip}</p>
                                                <p>{address.country}</p>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-700">No addresses found.</p>
                                )}
                            </div>
                        )}
                        {activeTab === "Shipping" && (
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">Your Shipping Addresses</h2>
                                {shippingAddresses.length > 0 ? (
                                    <div className="space-y-4">
                                        {shippingAddresses.map((address, index) => (
                                            <div key={index} className="border p-4 rounded-md bg-gray-50">
                                                <p>{address}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-700">No shipping addresses found.</p>
                                )}
                            </div>
                        )}
                        {activeTab === "Payment" && (
                            <div className="text-center p-10">
                                <h2 className="text-2xl font-semibold mb-4">Payment Methods</h2>
                                <p className="text-gray-700">Manage your saved payment methods.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;