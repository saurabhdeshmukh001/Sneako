import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isLoginPage =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup";
  const isCartPage = location.pathname === "/cart";

  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    console.log("Navbar - storedUser:", storedUser);
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } else {
      setUser(null);
    }
  }, [location]);

  useEffect(() => {
    const token = user?.jwt;
    if (!token) return;

    async function fetchProducts() {
      try {
        const response = await axios.get(
          "http://localhost:8085/api/v1/products",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProducts(response.data.content || []);
        setFilteredProducts(response.data.content || []);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        if (error.response?.status === 401) {
          navigate("/login");
        }
      }
    }

    fetchProducts();
  }, [user]);

  useEffect(() => {
    function handleSearch(event) {
      const query = event.detail.toLowerCase();
      const filtered = products.filter((product) =>
        product.productName.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    }

    window.addEventListener("searchProduct", handleSearch);
    return () => window.removeEventListener("searchProduct", handleSearch);
  }, [products]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    window.dispatchEvent(
      new CustomEvent("searchProduct", { detail: searchQuery })
    );
  };

  if (isLoginPage) {
    return (
      <nav className="absolute top-0 w-full flex justify-between items-center px-4 py-4 text-white z-20 bg-black">
        <Link to="/">
          <h1 className="text-2xl font-bold">Sneako</h1>
        </Link>
      </nav>
    );
  }

  return (
    <nav className="absolute top-0 w-full flex items-center px-4 py-4 text-white z-20 bg-black">
      <div className="flex-1 flex items-center justify-between">
        <Link to={user ? "/home" : "/"}>
          <h1 className="text-2xl font-bold">Sneako</h1>
        </Link>
        {/* Hamburger for mobile */}
        <button
          className="md:hidden ml-2 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
      {/* Desktop Nav */}
      <div className="hidden md:flex flex-1 items-center justify-end space-x-8">
        {user && (user.role === "ROLE_ADMIN" || user.role === "seller") && (
          <>
            <Link to="/admin">
              <h1 className="font-bold">Admin Dashboard</h1>
            </Link>
            <div className="relative group cursor-pointer">
              <span className="hover:underline">Profile</span>
              <div className="absolute right-0 mt-0 w-56 bg-gray-900 text-white rounded-md shadow-lg p-2 hidden group-hover:block z-50">
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded hover:bg-gray-700"
                >
                  <p className="font-semibold">{user.userId}</p>
                </Link>
                <button
                  onClick={() => {
                    localStorage.clear();
                    navigate("/");
                  }}
                  className="w-full text-left px-3 py-2 rounded hover:bg-red-600"
                >
                  Log Out
                </button>
              </div>
            </div>
          </>
        )}
        {user && (user.role === "ROLE_CUSTOMER" || !user.role) && (
          <>
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center space-x-2"
            >
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="border rounded px-2 py-1 text-black bg-white"
              />
              <button
                type="submit"
                className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
              >
                Search
              </button>
            </form>
            <Link to="/home" className="hover:underline">
              Home
            </Link>
            <Link to="/cart" className="hover:underline">
              Cart
            </Link>
            {!isCartPage && (
              <div className="relative group cursor-pointer">
                <span className="hover:underline">Categories</span>
                <div className="absolute left-0 mt-0 w-48 bg-gray-900 text-white rounded-md shadow-lg p-2 hidden group-hover:block z-50">
                  <button
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("categorySelected", { detail: "All" })
                      )
                    }
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
                  >
                    All
                  </button>
                  <button
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("categorySelected", {
                          detail: "Running Shoes",
                        })
                      )
                    }
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
                  >
                    Running Shoes
                  </button>
                  <button
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("categorySelected", {
                          detail: "Casual Shoes",
                        })
                      )
                    }
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
                  >
                    Casual Shoes
                  </button>
                  <button
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("categorySelected", {
                          detail: "Skate Shoes",
                        })
                      )
                    }
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
                  >
                    Skate Shoes
                  </button>
                </div>
              </div>
            )}
            <div className="relative group cursor-pointer">
              <span className="hover:underline">Profile</span>
              <div className="absolute right-0 mt-0 w-56 bg-gray-900 text-white rounded-md shadow-lg p-2 hidden group-hover:block z-50">
                <Link
                  to="/profile"
                  className="block px-3 py-2 rounded hover:bg-gray-700"
                >
                  <p className="font-semibold">{user.userId}</p>
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("user");
                    navigate("/");
                  }}
                  className="w-full text-left px-3 py-2 rounded hover:bg-red-600"
                >
                  Log Out
                </button>
              </div>
            </div>
          </>
        )}
      </div>
      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-black bg-opacity-95 flex flex-col items-start px-4 py-4 space-y-4 z-30">
          {user && (user.role === "ROLE_ADMIN" || user.role === "seller") && (
            <>
              <Link
                to="/admin"
                className="w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                <h1 className="font-bold">Admin Dashboard</h1>
              </Link>
              <Link
                to="/profile"
                className="w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                <p className="font-semibold">{user.userId}</p>
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  setMobileMenuOpen(false);
                  navigate("/");
                }}
                className="w-full text-left px-3 py-2 rounded hover:bg-red-600"
              >
                Log Out
              </button>
            </>
          )}
          {user && (user.role === "ROLE_CUSTOMER" || !user.role) && (
            <>
              <form
                onSubmit={(e) => {
                  handleSearchSubmit(e);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-2 w-full"
              >
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="border rounded px-2 py-1 text-black bg-white flex-1"
                />
                <button
                  type="submit"
                  className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
                >
                  Search
                </button>
              </form>
              <Link
                to="/home"
                className="w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/cart"
                className="w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                Cart
              </Link>
              {!isCartPage && (
                <div className="w-full">
                  <span className="block font-semibold mb-1">Categories</span>
                  <button
                    onClick={() => {
                      window.dispatchEvent(
                        new CustomEvent("categorySelected", { detail: "All" })
                      );
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
                  >
                    All
                  </button>
                  <button
                    onClick={() => {
                      window.dispatchEvent(
                        new CustomEvent("categorySelected", {
                          detail: "Running Shoes",
                        })
                      );
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
                  >
                    Running Shoes
                  </button>
                  <button
                    onClick={() => {
                      window.dispatchEvent(
                        new CustomEvent("categorySelected", {
                          detail: "Casual Shoes",
                        })
                      );
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
                  >
                    Casual Shoes
                  </button>
                  <button
                    onClick={() => {
                      window.dispatchEvent(
                        new CustomEvent("categorySelected", {
                          detail: "Skate Shoes",
                        })
                      );
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-700 rounded"
                  >
                    Skate Shoes
                  </button>
                </div>
              )}
              <Link
                to="/profile"
                className="w-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                <p className="font-semibold">{user.userId}</p>
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  setMobileMenuOpen(false);
                  navigate("/");
                }}
                className="w-full text-left px-3 py-2 rounded hover:bg-red-600"
              >
                Log Out
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
