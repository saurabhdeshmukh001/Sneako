// pages/AddProduct.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiX, FiArrowLeft, FiPlusSquare } from 'react-icons/fi'; // Icons for professional look
import axios from "axios";

function AddProduct() {
    const [product, setProduct] = useState({
        name: "",
        price: "",
        description: "",
        category: "Sport Shoes",
        image: "",
        stock: "" // Added stock field
    });
    const [loading, setLoading] = useState(false); // FIX 1: Add loading state
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };
    
    // Handle "Back" button click to navigate back to the product management page
    const handleGoBack = () => {
        navigate("/admin"); // FIX 2: Correct navigation path
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccessMessage("");
        setErrorMessage("");
        
        try {
            const response = await axios.post("http://localhost:3000/api/v1/products", {
                id: String(Date.now()),
                ...product,
                price: parseFloat(product.price),
                stock: parseInt(product.stock)
            });
            if (response.status !== 200 && response.status !== 201) {
                throw new Error("Failed to add product");
            }
            setSuccessMessage("New product added successfully!");
            setTimeout(() => {
                navigate("/admin");
            }, 1500);
        } catch (error) {
            console.error("Error adding product:", error);
            setErrorMessage("Failed to add product. Please try again.");
            setTimeout(() => setErrorMessage(""), 3000);
        } finally {
            setLoading(false);
        }
    };
    
    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex-grow flex items-center justify-center">
                    <p className="p-8 text-center text-gray-700">Adding new product...</p>
                </div>
                <Footer />
            </div>
        );
    }
    

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex-grow">
                {successMessage && (
                    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center space-x-3 transition duration-300">
                        <span>{successMessage}</span>
                        <button onClick={() => setSuccessMessage("")} className="text-white hover:text-gray-200">
                            <FiX />
                        </button>
                    </div>
                )}
                {errorMessage && (
                    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center space-x-3 transition duration-300">
                        <span>{errorMessage}</span>
                        <button onClick={() => setErrorMessage("")} className="text-white hover:text-gray-200">
                            <FiX />
                        </button>
                    </div>
                )}
                
                <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 mt-10 mb-12">
                    <div className="bg-white p-8 lg:p-12 shadow-xl rounded-xl border border-gray-200">

                        <div className="flex justify-between items-center mb-8 border-b pb-4">
                            <h2 className="text-3xl font-extrabold text-gray-900 flex items-center">
                                Add New Product <FiPlusSquare className="inline text-blue-600 ml-3" />
                            </h2>
                            <button
                                onClick={handleGoBack}
                                className="flex items-center text-gray-600 hover:text-gray-900 transition duration-300"
                                aria-label="Go back to Product Management"
                            >
                                <FiArrowLeft className="mr-2" /> Back
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={product.name}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={product.price}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={product.description}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    rows="4"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                                <select
                                    name="category"
                                    value={product.category}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                >
                                    <option>Sport Shoes</option>
                                    <option>Casual Shoes</option>
                                    <option>Basketball Shoes</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                                <input
                                    type="text"
                                    name="image"
                                    value={product.image}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    placeholder="e.g., https://images.unsplash.com/..."
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Stock</label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={product.stock}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                                    required
                                />
                            </div>
                            
                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-md"
                                    disabled={loading}
                                >
                                    {loading ? 'Adding...' : 'Add Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default AddProduct;