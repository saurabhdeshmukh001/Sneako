import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

function Signup() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [greet, setGreet] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!name || !phone || !email || !address) {
      setError("All fields are required.");
      return;
    }

    const newUser = {
      name,
      phone,
      email,
      address,
      password,
      role: "customer",
    };

    try {
      // Use the new register API
      const response = await axios.post(
        "http://localhost:3000/api/v1/auth/register",
        newUser
      );
      localStorage.setItem("user", JSON.stringify(response.data));
      setError("");
      setGreet(true);
      setTimeout(() => {
        setGreet(false);
        navigate("/home");
      }, 1500);
    } catch (err) {
      console.log("Signup error:", err.response);
      setError(
        err.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Greeting Popup */}
      {greet && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 text-lg font-semibold">
           Signup Successfull!
        </div>
      )}

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

      {/* Signup Card */}
      <div className="relative flex items-center justify-center min-h-screen z-10 px-2">
        <div className="bg-black/40 backdrop-blur-md shadow-2xl rounded-2xl p-2 w-full max-w-[420px] md:max-w-[468px] min-h-[450px] text-white flex flex-col">
          <h2 className="text-xl font-bold text-center mb-2">
            Customer Sign Up
          </h2>

          {error && (
            <p className="text-red-400 text-center mb-2 font-medium">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col flex-grow h-full justify-between">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-2 flex-grow">
              {/* Full Name */}
              <div>
                <label className="block mb-1 font-medium">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full border border-gray-600 bg-transparent rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-gray-400"
                  required
                />
              </div>
              {/* Email */}
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full border border-gray-600 bg-transparent rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-gray-400"
                  required
                />
              </div>
              {/* Address */}
              <div>
                <label className="block mb-1 font-medium">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your address"
                  className="w-full border border-gray-600 bg-transparent rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-gray-400"
                  required
                />
              </div>
              {/* Phone Number */}
              <div>
                <label className="block mb-1 font-medium">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full border border-gray-600 bg-transparent rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-gray-400"
                  required
                />
              </div>
              {/* Password */}
              <div>
                <label className="block mb-1 font-medium">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full border border-gray-600 bg-transparent rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-gray-400"
                  required
                />
              </div>
              {/* Confirm Password */}
              <div>
                <label className="block mb-1 font-medium">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full border border-gray-600 bg-transparent rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-gray-400"
                  required
                />
              </div>
            </div>
            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-red-600 text-white font-semibold py-1.5 rounded-lg hover:bg-red-700 transition mt-2"
            >
              Sign Up
            </button>
          </form>

          {/* Extra Links */}
          <p className="text-center text-gray-300 mt-3">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-red-400 font-medium cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default Signup;
