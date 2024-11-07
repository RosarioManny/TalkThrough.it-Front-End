import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getUser, signOut } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "../utils/auth";
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [lastActivity, setLastActivity] = useState(Date.now());
    const navigate = useNavigate();

    const handleSignOut = useCallback(() => {
        console.log("AuthContext - Signing out user:", user);
        signOut();
        setUser(null);
        navigate("/");
    }, [user, navigate]);

    // Activity tracking
    useEffect(() => {
        const updateActivity = () => {
            setLastActivity(Date.now());
        };

        // Track user activity
        const events = ['mousedown', 'keydown', 'scroll', 'mousemove', 'click', 'touchstart'];
        events.forEach(event => {
            window.addEventListener(event, updateActivity);
        });

        // Check for inactivity every minute
        const inactivityCheckInterval = setInterval(() => {
            const inactiveTime = Date.now() - lastActivity;
            if (inactiveTime > 10 * 60 * 1000) { // 10 minutes
                console.log("User inactive for 10 minutes, signing out");
                handleSignOut();
            }
        }, 60000); // Check every minute

        return () => {
            events.forEach(event => {
                window.removeEventListener(event, updateActivity);
            });
            clearInterval(inactivityCheckInterval);
        };
    }, [lastActivity, handleSignOut]);

    useEffect(() => {
        const loadUser = () => {
            const userData = getUser();
            console.log("AuthContext - initial user load:", userData);
            setUser(userData);
            setLastActivity(Date.now()); // Update activity on user load
            setLoading(false);
        };

        loadUser();

        const handleStorageChange = (e) => {
            if (e.key === 'token' || e.key === 'user') {
                loadUser();
            }
        };
        window.addEventListener('storage', handleStorageChange);

        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    useEffect(() => {
        const interceptor = axios.interceptors.response.use(
            response => response,
            error => {
                if (error.response?.status === 401 && user) {
                    console.log("Received 401 response, signing out");
                    handleSignOut();
                }
                return Promise.reject(error);
            }
        );

        return () => axios.interceptors.response.eject(interceptor);
    }, [user, handleSignOut]);

    useEffect(() => {
        const checkTokenExpiration = () => {
            if (user && isTokenExpired()) {
                console.log("Token expired, signing out user");
                handleSignOut();
            }
        };
        
        checkTokenExpiration();
        const tokenCheckInterval = setInterval(checkTokenExpiration, 60000);

        return () => clearInterval(tokenCheckInterval);
    }, [user, handleSignOut]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ 
            user, 
            setUser, 
            handleSignOut,
            isActive: Date.now() - lastActivity < 10 * 60 * 1000 // Expose activity status
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
