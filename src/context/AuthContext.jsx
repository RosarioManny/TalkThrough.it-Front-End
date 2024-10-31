import { createContext, useContext, useState, useEffect } from "react";
import { getUser, signOut } from "../services/authService";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for user data when the app loads
    const userData = getUser();
    console.log("AuthContext - initial user load:", userData);
    setUser(userData);
  }, []);
  // Add this useEffect to monitor user state changes
  useEffect(() => {
    console.log("AuthContext - Current user state:", user);
  }, [user]);

  const handleSignOut = () => {
    console.log("AuthContext - Signing out user:", user);
    signOut(); // Call the signOut function from authService
    setUser(null);
    navigate("/"); // Redirect to home page after signing out
  };

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
  console.log("useAuth hook - retrieved", context);
  return context;
};
