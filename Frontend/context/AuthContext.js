// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";

// ✅ Create AuthContext once
const AuthContext = createContext(null);

// ✅ Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Login function (replace with real backend auth)
  const login = async (email, password) => {
    console.log("Logging in with:", email, password);
    // Example: fetch("/api/auth/login", { ... })
    setUser({ email });
  };

  // Signup function (replace with real backend auth)
  const signup = async (email, password) => {
    console.log("Signing up with:", email, password);
    // Example: fetch("/api/auth/register", { ... })
    setUser({ email });
  };

  // Logout function
  const logout = async () => {
    console.log("Logging out");
    setUser(null);
  };

  // On mount: check for existing session (SSR-safe)
  useEffect(() => {
    const storedUser = null; // replace with localStorage or cookie check
    if (storedUser) setUser(storedUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook for easy access in components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// ✅ Default export for imports if needed
export default AuthContext;
