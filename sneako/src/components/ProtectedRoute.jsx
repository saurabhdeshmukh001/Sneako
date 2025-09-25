// components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    
    // If the user is not authenticated, redirect to the login page
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // If allowedRoles are specified, check if the user's role is included
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // You can redirect to an unauthorized page or the home page
        return <Navigate to="/home" replace />;
    }

    // If authenticated and authorized, render the child component
    return children;
};

export default ProtectedRoute;