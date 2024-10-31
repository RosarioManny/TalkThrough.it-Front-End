import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedUserTypes }) => {
    const { user } = useAuth();

    if (!user) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
    }

    if (!allowedUserTypes.includes(user.type)) {
        // Redirect to dashboard if wrong user type
        return <Navigate to={`/${user.type}/dashboard`} replace />;
    }

    return children;
};

