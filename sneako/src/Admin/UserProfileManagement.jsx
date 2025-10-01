import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiTrash2, FiX } from 'react-icons/fi';
import axios from "axios";
 
const UserProfileManagement = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(true);
 
    useEffect(() => {
        axios.get("http://localhost:3000/api/v1/users")
            .then((response) => {
                const filteredUsers = Array.isArray(response.data)
                    ? response.data.filter(user => user.role === "customer")
                    : [];
                setUsers(filteredUsers);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
                setLoading(false);
            });
    }, []);
 
 
    const handleDelete = (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
       
        axios.delete(`http://localhost:3000/api/v1//users/${id}`)
            .then(() => {
                setUsers(users.filter(user => user.id !== id));
                setSuccessMessage("User deleted successfully!");
                setTimeout(() => setSuccessMessage(""), 3000);
            })
            .catch((error) => {
                console.error("Error deleting user:", error);
                setSuccessMessage("Error deleting user.");
                setTimeout(() => setSuccessMessage(""), 3000);
            });
    };
 
    if (loading) {
        return <div className="p-8 text-center text-gray-700">Loading customer data.......</div>;
    }
 
    if (!loading && users.length === 0) {
        return <div className="p-8 text-center text-gray-700">No customer profiles found</div>;
    }
 
    return (
        <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-3">
                    Customer User Management <FiUsers className="inline text-teal-600 mb-1" />
                </h1>
 
                {successMessage && (
                    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center space-x-3 transition duration-300">
                        <span>{successMessage}</span>
                        <button onClick={() => setSuccessMessage("")} className="text-white hover:text-gray-200">
                            <FiX />
                        </button>
                    </div>
                )}
 
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {['Name', 'Email', 'Role', 'Actions'].map((header) => (
                                        <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map(({ id, name, email, role }) => (
                                    <tr key={id} className="hover:bg-gray-50 transition duration-150">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                {role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                            <button
                                                onClick={() => handleDelete(id)}
                                                className="text-red-600 hover:text-red-800 transition"
                                                title="Delete User"
                                            >
                                                <FiTrash2 className="w-5 h-5 inline" />
                                                <span className="ml-1 hidden sm:inline">Delete</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
 
                <div className="mt-6 text-center text-sm text-gray-500">
                    Total active customer profiles: {users.length}
                </div>
            </div>
        </div>
    );
};
 
export default UserProfileManagement;