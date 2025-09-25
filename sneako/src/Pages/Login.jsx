import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

function Login() {
  const [role, setRole] = useState("customer");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Use axios and send name and password
      const response = await axios.post(
        "http://localhost:3000/api/v1/auth/login",
        {
          name: name,
          password: password,
        }
      );
      const data = response.data;
      if (data.jwt) {
        localStorage.setItem("user", JSON.stringify(data));
        const userRole = data.role || role;
        if (userRole === "customer") {
          navigate("/home");
        } else if (userRole === "seller") {
          navigate("/admin");
        }
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "An error occurred. Please try again later."
      );
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/vid.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay to decrease video opacity */}
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      <Navbar></Navbar>

      {/* Login Card */}
      <div className="relative flex items-center justify-center h-screen z-10">
        <div className="bg-black/40 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-sm text-white">
          <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

          {error && (
            <p className="text-red-400 text-center mb-4 font-medium">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Dropdown */}
            <div>
              <label className="block mb-2 font-medium">Select Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-600 bg-transparent rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                <option value="customer" className="text-black">
                  Customer
                </option>
                <option value="seller" className="text-black">
                  Seller
                </option>
              </select>
            </div>

            {/* Name */}
            <div>
              <label className="block mb-2 font-medium">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full border border-gray-600 bg-transparent rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-gray-400"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 font-medium">PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full border border-gray-600 bg-transparent rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-gray-400"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition"
            >
              Login
            </button>
          </form>

          {/* Extra Links */}
          {role === "customer" && (
            <p className="text-center text-gray-300 mt-6">
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-red-400 font-medium cursor-pointer hover:underline"
              >
                Sign Up
              </span>
            </p>
          )}
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Login;
