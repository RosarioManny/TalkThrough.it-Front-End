import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isTokenExpired } from '../utils/auth';

export const ProtectedRoute = ({ children, allowedUserTypes }) => {
    const { user, handleSignOut } = useAuth();
    
    if (user && isTokenExpired()) {
        console.log("Token expired in ProtectedRoute");
        handleSignOut();
        return <Navigate to="/login" replace />;
    }

    if (!user) {
        console.log("No user in ProtectedRoute");
        return <Navigate to="/login" replace />;
    }

    if (allowedUserTypes && !allowedUserTypes.includes(user.type)) {
        console.log("Invalid user type in ProtectedRoute", user.type);
        return <Navigate to={`/${user.type}/dashboard`} replace />;
    }

    return children;
};
