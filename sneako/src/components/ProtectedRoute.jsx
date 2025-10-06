import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/home" replace />;
    }

    return children;
};

export default ProtectedRoute;