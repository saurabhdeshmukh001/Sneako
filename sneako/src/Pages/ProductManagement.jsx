// pages/ProductManagement.jsx (Beautified with increased gap)
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiPlus, FiEdit2, FiTrash2, FiPackage, FiX } from "react-icons/fi";

const ProductManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/products")
      .then((res) => {
        const productsWithId = res.data.map((product) => ({
          id: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          stock: product.stock,
          ...product,
        }));
        setProducts(productsWithId);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const handleDelete = async (id, name) => {
    if (
      !window.confirm(`Are you sure you want to delete the product: ${name}?`)
    )
      return;

    try {
      const productToDelete = products.find((p) => String(p.id) === String(id));
      if (!productToDelete) return;

      const deleteUrl = `http://localhost:3000/api/v1/products/${String(
        productToDelete.id
      )}`;
      await axios.delete(deleteUrl);

      setProducts((prev) =>
        prev.filter((p) => String(p.id) !== String(productToDelete.id))
      );
      setSuccessMessage(`${name} deleted successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error(
        "Error deleting product:",
        error.response ? error.response.data : error.message
      );
      setSuccessMessage(`Error deleting ${name}.`);
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  return (
    <div className="p-2 sm:p-4 md:p-8 bg-gray-50 min-h-screen w-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 sm:mb-8 border-b pb-2 sm:pb-3">
          Product Catalog <FiPackage className="inline text-indigo-600 mb-1" />
        </h1>

        {/* Success Message Alert (Centered and prominent) */}
        {successMessage && (
          <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-xl z-50 flex items-center space-x-2 sm:space-x-3 transition duration-300 text-xs sm:text-base">
            <span>{successMessage}</span>
            <button
              onClick={() => setSuccessMessage("")}
              className="text-white hover:text-gray-200"
            >
              <FiX />
            </button>
          </div>
        )}

        {/* Header & Actions */}
        <div className="flex flex-col sm:flex-row justify-end mb-4 sm:mb-6 gap-2 sm:gap-0">
          <button
            onClick={() => navigate("/add-product")}
            className="flex items-center bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md text-sm sm:text-base"
          >
            <FiPlus className="mr-2" /> Add New Product
          </button>
        </div>

        {/* Products Table Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-x-auto border border-gray-100">
          <table className="min-w-full divide-y divide-gray-200 text-xs sm:text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Name", "Category", "Price (₹)", "Stock", "Actions"].map(
                  (header) => (
                    <th
                      key={header}
                      className="px-2 sm:px-4 md:px-6 py-2 sm:py-3 text-left font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 whitespace-nowrap font-semibold text-gray-900">
                    {product.name}
                  </td>
                  <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 whitespace-nowrap text-gray-600">
                    {product.category}
                  </td>
                  <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 whitespace-nowrap font-bold text-red-600">
                    ₹{product.price.toLocaleString("en-IN")}
                  </td>
                  <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 whitespace-nowrap text-gray-600">
                    {product.stock}
                  </td>
                  <td className="px-2 sm:px-4 md:px-6 py-2 sm:py-4 whitespace-nowrap space-x-2 sm:space-x-4">
                    <button
                      className="text-yellow-600 hover:text-yellow-800 transition"
                      onClick={() => navigate(`/edit-product/${product.id}`)}
                      title="Edit Product"
                    >
                      <FiEdit2 className="w-4 h-4 sm:w-5 sm:h-5 inline" />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 transition"
                      onClick={() => handleDelete(product.id, product.name)}
                      title="Delete Product"
                    >
                      <FiTrash2 className="w-4 h-4 sm:w-5 sm:h-5 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
