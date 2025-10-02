
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";


import ProductManagement from "../Pages/ProductManagement";
import UserProfileManagement from "./UserProfileManagement";
import AdminOverview from "./AdminOverview";
import OrderTrackingAdmin from "./OrderTrackingAdmin"; 

function Admin() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Overview");


  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || storedUser.role !== 'seller') {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="relative min-h-screen w-full bg-gray-100">
      <Navbar />

      <div className="pt-20 px-4 md:px-8 lg:px-12 pb-8">
        <div className="bg-white p-2 rounded-lg shadow-md flex justify-around mb-8 max-w-4xl mx-auto">
          <button
            onClick={() => setActiveTab("Overview")}
            className={`py-2 px-6 rounded-md font-medium text-lg transition-all duration-300 ${
              activeTab === "Overview" ? "bg-blue-500 text-white shadow-lg" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("Products")}
            className={`py-2 px-6 rounded-md font-medium text-lg transition-all duration-300 ${
              activeTab === "Products" ? "bg-blue-500 text-white shadow-lg" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("Orders")}
            className={`py-2 px-6 rounded-md font-medium text-lg transition-all duration-300 ${
              activeTab === "Orders" ? "bg-blue-500 text-white shadow-lg" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Orders
          </button>
          <button
            onClick={() => setActiveTab("Customers")}
            className={`py-2 px-6 rounded-md font-medium text-lg transition-all duration-300 ${
              activeTab === "Customers" ? "bg-blue-500 text-white shadow-lg" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Customers
          </button>
        </div>

        <div className="max-w-6xl mx-auto">
          {activeTab === "Overview" && <AdminOverview />}
          {activeTab === "Products" && <ProductManagement />}
          {activeTab === "Orders" && <OrderTrackingAdmin />} 
          {activeTab === "Customers" && <UserProfileManagement />}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Admin;