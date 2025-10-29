import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [selectedSize, setSelectedSize] = useState(null);
  const availableSizes = [7, 8, 9, 10, 11, 12];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.jwt;

    axios
      .get(`http://localhost:8085/api/v1/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const dto = res.data;
        setProduct({
          id: dto.productID,
          name: dto.productName,
          image: dto.imageUrl,
          category: dto.categoryName,
          price: dto.price,
          description: dto.description,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError("Product not found.");
        setLoading(false);
        console.error("Error fetching product details:", err);
      });
  }, [id]);

  const handleAddToCart = async () => {
  if (!selectedSize) {
    setMessage("Please select a size before adding to cart.");
    setTimeout(() => setMessage(""), 3000);
    return;
  }

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user.jwt;

  try {
    await axios.post(
      "http://localhost:8085/api/v1/cart-items",
      {
        userId: user.id,
        productId: product.id,
        unitPrice: product.price,
        quantity: 1,
        size: selectedSize,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setMessage(`${product.name} (Size ${selectedSize}) added to cart!`);
  } catch (err) {
    console.error("Error adding to cart:", err);
    setMessage("Failed to add item to cart.");
  } finally {
    setTimeout(() => setMessage(""), 3000);
  }
};

  const handleBuyNow = () => {
    if (!selectedSize) {
      setMessage('Please select a size to proceed with "Buy Now".');
      setTimeout(() => setMessage(""), 3000);
      return;
    }
    navigate("/checkout", {
      state: { product, size: selectedSize, quantity: 1 },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl font-semibold text-gray-700">
          Loading Product Details...
        </p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-2xl font-bold text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      {message && (
        <div
          className={`fixed top-20 left-1/2 transform -translate-x-1/2 ${
            message.includes("Please select") ? "bg-yellow-500" : "bg-green-600"
          } text-white py-3 px-6 rounded-xl shadow-2xl z-50 transition-all duration-300`}
        >
          {message}
        </div>
      )}

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 mt-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-gray-100 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-[500px] w-full object-contain transform hover:scale-105 transition duration-500 ease-in-out"
              />
            </div>

            <div className="p-8 lg:p-12 flex flex-col justify-between">
              <div>
                <p className="text-sm font-semibold uppercase text-red-600 mb-2">
                  {product.category || "Sneaker"}
                </p>
                <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mb-4">
                  {product.name}
                </h1>

                <p className="text-4xl font-extrabold text-black mb-6">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>

                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">
                    Select Size (US/UK)
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {availableSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 px-5 rounded-lg font-semibold border-2 transition duration-200 
                          ${
                            selectedSize === size
                              ? "bg-black text-white border-black shadow-lg"
                              : "bg-white text-gray-800 border-gray-300 hover:border-black"
                          }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    {selectedSize
                      ? `Selected Size: ${selectedSize}`
                      : "Please choose a size to continue."}
                  </p>
                </div>

                <div className="mb-8 border-t pt-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    Product Story
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {product.description ||
                      "Step out in style with this iconic pair. Featuring a breathable mesh upper and a responsive cushioned sole, this sneaker is built for both performance and all-day comfort. The perfect blend of heritage design and modern innovation."}
                  </p>
                </div>
              </div>

              <div className="flex flex-col space-y-4 pt-6 border-t">
                <button
                  onClick={handleAddToCart}
                  disabled={!selectedSize}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition duration-300 shadow-md
                    ${
                      selectedSize
                        ? "bg-red-600 text-white hover:bg-red-700"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                >
                  ADD TO CART
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={!selectedSize}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition duration-300 shadow-md
                    ${
                      selectedSize
                        ? "bg-black text-white hover:bg-gray-800"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                >
                  BUY NOW
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
