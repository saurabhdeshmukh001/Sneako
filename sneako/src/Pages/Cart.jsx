import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { FiPlus, FiMinus, FiTrash } from "react-icons/fi";
import axios from "axios";

function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [lastUpdatedItemId, setLastUpdatedItemId] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/cart");
        setCartItems(res.data);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    const newTotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    setTotal(newTotal);
  }, [cartItems]);

  useEffect(() => {
    if (lastUpdatedItemId) {
      const timer = setTimeout(() => {
        setLastUpdatedItemId(null);
      }, 500); 
      return () => clearTimeout(timer);
    }
  }, [lastUpdatedItemId]);


  const updateCartItemQuantity = async (id, newQuantity) => {
    const itemToUpdate = cartItems.find((item) => item.id === id);
    if (!itemToUpdate || newQuantity < 1) return;

    const newTotalPrice = itemToUpdate.originalPrice * newQuantity;

    try {
     
      await axios.put(`http://localhost:3000/api/v1/cart/${id}`, {
        ...itemToUpdate,
        quantity: newQuantity,
        totalPrice: newTotalPrice,
      });

      setCartItems(
        cartItems.map((item) =>
          item.id === id
            ? { ...item, quantity: newQuantity, totalPrice: newTotalPrice }
            : item
        )
      );
      setLastUpdatedItemId(id); 
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  const handleIncrement = (id) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      updateCartItemQuantity(id, item.quantity + 1);
    }
  };

  const handleDecrement = (id) => {
    const item = cartItems.find((item) => item.id === id);
    if (item) {
      if (item.quantity === 1) {
        handleRemoveFromCart(id);
      } else {
        updateCartItemQuantity(id, item.quantity - 1);
      }
    }
  };

  const handleRemoveFromCart = async (idToRemove) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/cart/${idToRemove}`);

      setCartItems(cartItems.filter((item) => item.id !== idToRemove));
    } catch (error) {
      console.error("Error removing item from cart:", error);
    }
  };

  const handlePlaceOrder = () => {
    if (cartItems.length > 0) {
      navigate("/checkout", { state: { cartItems, total: total } });
    }
  };


  return (
    <div className="bg-gray-50 min-h-screen w-full overflow-x-hidden">
      <Navbar />
      <div className="max-w-7xl mx-auto p-2 sm:p-4 md:p-6 lg:p-8 mt-6 sm:mt-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 sm:mb-8 text-gray-900 border-b pb-2 sm:pb-4">
          Shopping Cart 🛒
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-10 sm:py-20 bg-white rounded-xl shadow-lg">
            <p className="text-lg sm:text-xl text-gray-500 mb-4">
              Your cart is empty. Time to find some fresh kicks!
            </p>
            <button
              onClick={() => navigate("/home")}
              className="bg-black text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-lg hover:bg-gray-800 transition duration-300"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            <div className="lg:col-span-2 space-y-3 sm:space-y-4">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-800">
                Items in Cart ({cartItems.length})
              </h2>

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex flex-col sm:flex-row items-center border border-gray-200 rounded-xl shadow-md p-2 sm:p-4 relative 
                                        ${
                                          lastUpdatedItemId === item.id
                                            ? "bg-green-50 transition-all duration-300 shadow-xl" 
                                            : "bg-white transition duration-300 hover:shadow-lg" 
                                        }`}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-32 sm:h-24 sm:w-24 object-cover rounded-lg mr-0 sm:mr-4 flex-shrink-0"
                  />

                  <div className="flex-grow my-2 sm:my-0 w-full">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900">
                      {item.name}
                    </h3>
                    {item.size && (
                      <p className="text-xs sm:text-sm text-gray-600">Size: {item.size}</p>
                    )}
                    <p className="text-xs sm:text-sm text-gray-500">
                      Category: {item.category}
                    </p>
                    <p className="text-sm sm:text-md font-semibold mt-1">
                      Unit Price: ₹{item.originalPrice.toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1 sm:space-x-2 border border-gray-300 rounded-lg p-1 mx-0 sm:mx-4 mt-2 sm:mt-0">
                    <button
                      onClick={() => handleDecrement(item.id)}
                      className="text-gray-600 hover:text-black p-1 transition"
                    >
                      <FiMinus size={16} />
                    </button>
                    <span className="font-semibold w-6 sm:w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleIncrement(item.id)}
                      className="text-gray-600 hover:text-black p-1 transition"
                    >
                      <FiPlus size={16} />
                    </button>
                  </div>

                  {/* Subtotal and Remove */}
                  <div className="flex flex-col items-end space-y-1 sm:space-y-2 mt-2 sm:mt-0">
                    <p className="text-lg sm:text-xl font-extrabold text-red-600">
                      ₹{item.totalPrice.toLocaleString("en-IN")}
                    </p>
                    <button
                      onClick={() => handleRemoveFromCart(item.id)}
                      className="text-xs sm:text-sm text-red-500 hover:text-red-700 font-medium transition flex items-center"
                    >
                      <FiTrash size={12} className="mr-1" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-1 bg-white p-4 sm:p-6 rounded-xl shadow-lg h-fit sticky top-10 border border-gray-200 mt-6 lg:mt-0">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 border-b pb-2 sm:pb-3 text-gray-900">
                Order Summary
              </h2>

              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between text-base sm:text-lg text-gray-700">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span className="font-semibold">
                    ₹
                    {total.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                <div className="flex justify-between text-base sm:text-lg text-gray-600">
                  <span>Shipping Estimate</span>
                  <span className="font-semibold text-green-600">FREE</span>
                </div>

                <div className="flex justify-between text-base sm:text-lg text-gray-600 border-t pt-3 sm:pt-4">
                  <span>Tax Estimate (Included)</span>
                  <span className="font-semibold">₹0.00</span>
                </div>

                <div className="flex justify-between text-lg sm:text-2xl font-extrabold text-gray-900 border-t border-b py-3 sm:py-4">
                  <span>Order Total</span>
                  <span>
                    ₹
                    {total.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={cartItems.length === 0}
                className={`w-full text-white font-bold py-2 sm:py-3 rounded-xl mt-4 sm:mt-6 transition duration-300 ${
                  cartItems.length > 0
                    ? "bg-black hover:bg-gray-800"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Place Order at ₹
                {total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </button>

              <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-4 text-center">
                Shipping and taxes calculated at checkout.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
