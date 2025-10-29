import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FiX, FiArrowLeft, FiEdit3 } from "react-icons/fi";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    productName: "",
    categoryName: "",
    price: "",
    stockQuantity: 0,
    description: "",
    imageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.jwt;

    const loadProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8085/api/v1/admin/product/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Fetched product:", response.data);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = user?.jwt;

      const updatedProduct = {
        ...product,
        price: Number(product.price),
        stockQuantity: Number(product.stockQuantity),
      };

      const response = await axios.put(
        `http://localhost:8085/api/v1/admin/product/${id}`,
        updatedProduct,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) throw new Error("Failed to update product");
      setSuccessMessage("Product updated successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/admin");
      }, 1000);
    } catch (error) {
      console.error("Error updating product:", error);
      setSuccessMessage("Error updating product.");
    }
  };

  const handleGoBack = () => {
    navigate("/admin");
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Navbar />
        <p className="p-8 text-center text-gray-700 flex-grow">
          Loading product details...
        </p>
        <Footer />
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <div className="flex-grow">
        {successMessage && (
          <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center space-x-3 transition duration-300">
            <span>{successMessage}</span>
            <button
              onClick={() => setSuccessMessage("")}
              className="text-white hover:text-gray-200"
            >
              <FiX />
            </button>
          </div>
        )}

        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 mt-10 mb-12">
          <div className="bg-white p-8 lg:p-12 shadow-xl rounded-xl border border-gray-200">
            <div className="flex justify-between items-center mb-8 border-b pb-4">
              <h2 className="text-3xl font-extrabold text-gray-900">
                Edit Product <FiEdit3 className="inline text-yellow-600 mb-1" />
              </h2>
              <button
                onClick={handleGoBack}
                className="flex items-center text-gray-600 hover:text-gray-900 transition duration-300"
              >
                <FiArrowLeft className="mr-2" /> Back
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  name="productName"
                  value={product.productName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="categoryName"
                  value={product.categoryName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price (₹)
                </label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stockQuantity"
                  value={product.stockQuantity}
                  onChange={handleChange}
                  min="0"
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                  rows="4"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  name="imageUrl"
                  value={product.imageUrl}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition"
                  placeholder="e.g., https://images.unsplash.com/..."
                  required
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="w-full bg-yellow-500 text-black font-bold py-3 rounded-xl hover:bg-yellow-600 transition shadow-md"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default UpdateProduct;
