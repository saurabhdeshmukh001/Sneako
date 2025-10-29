import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

function Login() {
  const [selectedRole, setSelectedRole] = useState("ROLE_CUSTOMER");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8085/api/v1/userservice/login",
        {
          username: name,
          password: password,
          role: selectedRole
        }
      );

      const data = response.data;
      console.log(data, "login response data");

      if (data.jwt) {
        localStorage.setItem("user", JSON.stringify({
          jwt: data.jwt,
          id: data.id,
          userId: data.userName,
          role: data.role,
          address: data.address,
          email: data.email,
          phone: data.phone,
          appInstance: data.appInstance
        }));

        const backendRole = data.role?.toUpperCase();
        console.log(backendRole);

        const selected = selectedRole?.toUpperCase();
        console.log(selected);

        if (backendRole !== selected) {
          setError("Selected role does not match your account role.");
          return;
        }

        if (backendRole === "ROLE_ADMIN") {
          console.log("navigating to the admin")
          navigate("/admin");
        } else {
          navigate("/home");
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

      <div className="absolute inset-0 bg-black opacity-50 z-0"></div>

      <Navbar />

      <div className="relative flex items-center justify-center h-screen z-10">
        <div className="bg-black/40 backdrop-blur-md shadow-2xl rounded-2xl p-8 w-full max-w-sm text-white">
          <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

          {error && (
            <p className="text-red-400 text-center mb-4 font-medium">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Static Role Dropdown */}
            <div>
              <label className="block mb-2 font-medium">Select Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full border border-gray-600 bg-transparent rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                <option value="ROLE_CUSTOMER" className="text-black">Customer</option>
                <option value="ROLE_ADMIN" className="text-black">Admin</option>
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
              <label className="block mb-2 font-medium">Password</label>
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

          
            <p className="text-center text-gray-300 mt-6">
              Don’t have an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                className="text-red-400 font-medium cursor-pointer hover:underline"
              >
                Sign Up
              </span>
            </p>
          
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Login;
