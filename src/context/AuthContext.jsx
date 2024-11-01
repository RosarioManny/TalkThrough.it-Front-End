import { createContext, useContext, useState, useEffect } from "react";
import { getUser, signOut } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { isTokenExpired } from "../utils/auth";
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleSignOut = () => {
        console.log("AuthContext - Signing out user:", user);
        signOut();
        setUser(null);
        navigate("/");
    };

    useEffect(() => {
        const loadUser = () => {
            const userData = getUser();
            console.log("AuthContext - initial user load:", userData);
            setUser(userData);
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
              if (error.response?.status === 401 && user) { // Only logout if there's a user
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
      const interval = setInterval(checkTokenExpiration, 60000);

      return () => clearInterval(interval);
  }, [user]); 

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={{ user, setUser, handleSignOut }}>
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
