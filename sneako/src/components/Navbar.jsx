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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("Loaded user from localStorage:", parsedUser);
      setUser(parsedUser);
    } else {
      setUser(null);
    }
  }, [location]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/products"
        );
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    }
    fetchProducts();
  }, []);

  useEffect(() => {
    function handleSearch(event) {
      const query = event.detail.toLowerCase();
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query)
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
      <nav className="absolute top-0 w-full flex justify-between items-center px-10 py-4 text-white z-20 bg-black">
        <Link to="/">
          <h1 className="text-2xl font-bold">Sneako</h1>
        </Link>
      </nav>
    );
  }

  return (
    <nav className="absolute top-0 w-full flex justify-between items-center px-10 py-4 text-white z-20 bg-black">
      <Link to="/">
        <h1 className="text-2xl font-bold">Sneako</h1>
      </Link>

      {user && (user.role === "admin" || user.role === "seller") && (
        <div className="flex items-center space-x-8">
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
                <p className="font-semibold">{user.name}</p>
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
        </div>
      )}

      {user && (user.role === "customer" || !user.role) && (
        <div className="flex items-center space-x-8">
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
                <p className="font-semibold">{user.name}</p>
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
        </div>
      )}
    </nav>
  );
}

export default Navbar;
