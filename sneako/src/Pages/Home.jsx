// pages/Home.jsx (Beautified Version)
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import ProductCard from "./productCard";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";
// Assuming ProductCard is available in the current directory or imported correctly

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [success, setSuccess] = useState(false);


  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/products")
      .then((response) => setProducts(response.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  useEffect(() => {
    const handleCategorySelect = (e) => {
      setSelectedCategory(e.detail);
    };
    // This is a custom event listener that relies on Navbar dispatching an event
    window.addEventListener("categorySelected", handleCategorySelect);
    return () =>
      window.removeEventListener("categorySelected", handleCategorySelect);
  }, []);

  useEffect(() => {
    const handleSearch = (e) => {
      setSearchQuery(e.detail);
    };
    window.addEventListener("searchProduct", handleSearch);
    return () => window.removeEventListener("searchProduct", handleSearch);
  }, []);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory && selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery && searchQuery.trim() !== "") {
      const lowerSearch = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerSearch) ||
          (p.description && p.description.toLowerCase().includes(lowerSearch))
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery]);

  // --- New Section: Banner Component (Inline for Simplicity) ---
  const PromotionBanner = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center bg-gray-900 text-white my-10 rounded-xl shadow-2xl">
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
        Grab Your Exclusive Sneako Gear
      </h2>
      <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
        Limited-time offers on lifestyle wear and accessories. Don't miss out on
        fresh street style.
      </p>
      <button
        onClick={() => {setSuccess(true) ; setTimeout(() => setSuccess(false), 2000);}}
         // Assuming an accessories route exists
        className="bg-red-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-red-700 transition duration-300 transform hover:scale-105"
      >
        Explore Promotions
      </button>
    </div>
  );

  const ProductGridHeader = () => {
    const title =
      selectedCategory && selectedCategory !== "All"
        ? `${selectedCategory} Collection`
        : "Fresh Drops & Bestsellers";

    const subtitle =
      selectedCategory && selectedCategory !== "All"
        ? `Showing ${filteredProducts.length} items.`
        : "Check out the newest and most popular sneakers on Sneako.";

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-8 border-b-2 pb-4">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-1">{title}</h1>
        <p className="text-lg text-gray-600">{subtitle}</p>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen w-full overflow-x-hidden">
      <Navbar />
      {success && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 text-lg font-semibold">
         This feature will be available soon!
        </div>
      )} 

      {/* 1. Main Carousel Section */}
      {(!searchQuery || searchQuery.trim() === "") && (
        <div className="w-full">
          <Carousel />
        </div>
      )}

      {/* 2. Promotional Banner Section */}
      {(!searchQuery || searchQuery.trim() === "") && <PromotionBanner />}

      {/* 3. Product Grid Header */}
      <ProductGridHeader />

      {/* 4. Product Grid */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 pb-16 w-full">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-500">
              No products found in the selected category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Home;
