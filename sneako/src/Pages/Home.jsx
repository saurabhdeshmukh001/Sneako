import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import ProductCard from "./ProductCard";
import Carousel from "../components/Carousel";
import Footer from "../components/Footer";

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [success, setSuccess] = useState(false);

  // Pagination state
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.jwt;

    axios
      .get(`http://localhost:8085/api/v1/products?page=${page}&size=${size}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setProducts(response.data.content || []);
        setTotalPages(response.data.totalPages);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        if (err.response?.status === 401) {
          navigate("/login");
        }
      });
  }, [page, size]);

  useEffect(() => {
    const handleCategorySelect = (e) => {
      setSelectedCategory(e.detail);
    };
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
      filtered = filtered.filter((p) => p.categoryName === selectedCategory);
    }

    if (searchQuery && searchQuery.trim() !== "") {
      const lowerSearch = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.productName.toLowerCase().includes(lowerSearch) ||
          (p.description && p.description.toLowerCase().includes(lowerSearch))
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery]);

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
        onClick={() => {
          setSuccess(true);
          setTimeout(() => setSuccess(false), 2000);
        }}
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

  const PaginationControls = () => (
    <div className="flex justify-center mt-8 space-x-2">
      <button
        disabled={page === 0}
        onClick={() => setPage(page - 1)}
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Previous
      </button>

      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`px-4 py-2 rounded ${
            i === page ? "bg-red-600 text-white" : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {i + 1}
        </button>
      ))}

      <button
        disabled={page === totalPages - 1}
        onClick={() => setPage(page + 1)}
        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen w-full overflow-x-hidden">
      <Navbar />
      {success && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 text-lg font-semibold">
          This feature will be available soon!
        </div>
      )}

      {(!searchQuery || searchQuery.trim() === "") && (
        <>
          <Carousel />
          <PromotionBanner />
        </>
      )}

      <ProductGridHeader />

      <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 pb-16 w-full">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-500">
              No products found in the selected category.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.productID} product={product} />
              ))}
            </div>
            <PaginationControls />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Home;
