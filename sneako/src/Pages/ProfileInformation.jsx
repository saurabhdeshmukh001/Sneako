import React, { useState, useEffect } from "react";
import axios from "axios";

function ProfileInformation() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const parsedUser = JSON.parse(storedUser);
    if (storedUser) {
      //const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      axios
        .get("http://localhost:3000/api/v1/users")
        .then((res) => {
          const users = res.data;
          const userData = users.find((u) => u.id === parsedUser.id);
          console.log("Fetched user data:", userData);
          if (userData) {
            setFormData({
              name: userData.name,
              phone: userData.phone || "",
              email: userData.email,
              password: "",
            });
          } else {
            setError("Failed to load user data.");
          }
        })
        .catch((err) => {
          console.error("Error fetching user data:", err);
          setError("Failed to load user data.");
        });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setMessage("");

  if (!user) {
    setError("User not logged in.");
    return;
  }

  try {
    const updatedData = {
      id: user.id, // include user id in request body
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      password: formData.password || user.password,
    };

    const response = await axios.put(
      `http://localhost:3000/api/v1/users/${user.id}`, // use id from localStorage
      updatedData
    );

    console.log(response);

    // keep local id always
    const updatedUser = {
      ...response.data,
      id: user.id,
    };

    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setMessage("Profile updated successfully!");
    setIsEditing(false);
  } catch (err) {
    console.error("Error updating profile:", err);
    setError("Failed to update profile. Please try again.");
  }
};

  const handleCancel = () => {
    setIsEditing(false);
    if (user) {
      setFormData({
        name: user.name,
        phone: user.phone || "",
        email: user.email,
        password: "",
      });
    }
  };

  if (!user) {
    return (
      <p className="text-xl text-gray-700 text-center">
        Please log in to manage your profile.
      </p>
    );
  }

  return (
    <div className="p-2 sm:p-4 md:p-8 max-w-3xl mx-auto w-full">
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-2 sm:px-4 py-2 sm:py-3 rounded relative mb-2 sm:mb-4 text-center text-xs sm:text-base">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-2 sm:px-4 py-2 sm:py-3 rounded relative mb-2 sm:mb-4 text-center text-xs sm:text-base">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-2 sm:pb-4 mb-4 sm:mb-6 gap-2">
        <h3 className="text-xl sm:text-2xl font-semibold">Personal Information</h3>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition text-sm sm:text-base"
          >
            {/* Using a simple SVG icon as an alternative to react-feather */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-1"
            >
              <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            </svg>
            Edit
          </button>
        ) : null}
      </div>

      {!isEditing ? (
        // View Mode
        <div>
          <div className="flex flex-col sm:flex-row items-center mb-4 sm:mb-6">
            <div className="bg-blue-100 text-blue-500 p-3 sm:p-4 rounded-full mr-0 sm:mr-4 mb-2 sm:mb-0">
              {/* Using a simple SVG icon for the user avatar */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="36" height="36" sm:width="48" sm:height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </div>
            <div className="text-center sm:text-left">
              <p className="text-lg sm:text-2xl font-bold">{user.name}</p>
              <p className="text-gray-600 text-sm sm:text-base">{user.email}</p>
              <button className="mt-1 sm:mt-2 text-xs sm:text-sm text-blue-500 hover:underline">
                Change Photo
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
            <div>
              <p className="text-gray-500 text-xs sm:text-sm">Full Name</p>
              <p className="font-medium text-gray-800 text-sm sm:text-base">{user.name}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs sm:text-sm">Email</p>
              <p className="font-medium text-gray-800 text-sm sm:text-base">{user.email}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs sm:text-sm">Member Since</p>
              <p className="font-medium text-gray-800 text-sm sm:text-base">
                {user.joinedDate || "Not Available"}
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Edit Mode
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
            <div className="flex flex-col">
              <label
                className="text-gray-700 text-xs sm:text-sm font-semibold mb-1"
                htmlFor="name"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-base"
                required
              />
            </div>
            <div className="flex flex-col">
              <label
                className="text-gray-700 text-xs sm:text-sm font-semibold mb-1"
                htmlFor="email"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-base"
                required
              />
            </div>
            <div className="flex flex-col">
              <label
                className="text-gray-700 text-xs sm:text-sm font-semibold mb-1"
                htmlFor="phone"
              >
                Phone (optional)
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-base"
              />
            </div>
            <div className="flex flex-col">
              <label
                className="text-gray-700 text-xs sm:text-sm font-semibold mb-1"
                htmlFor="password"
              >
                New Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs sm:text-base"
                placeholder="Leave blank to keep current"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-4 sm:mt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100 transition text-xs sm:text-base"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-xs sm:text-base"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default ProfileInformation;
