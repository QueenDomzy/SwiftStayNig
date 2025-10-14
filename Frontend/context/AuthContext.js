import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Current logged-in user
  const [loading, setLoading] = useState(true);

  // Simulate checking for an existing session on mount
  useEffect(() => {
    // Replace this with actual backend call if you have session tokens
    const fetchCurrentUser = async () => {
      console.warn("Firebase removed — implement your API call to fetch current user");
      setUser(null); // default: no user
      setLoading(false);
    };
    fetchCurrentUser();
  }, []);

  // Mock login function
  const login = async (email, password) => {
    console.warn("Firebase removed — replace with API login call");
    // Example: set a dummy user
    setUser({ email, name: "Demo User" });
    return { success: true };
  };

  // Mock signup function
  const signup = async (email, password, name) => {
    console.warn("Firebase removed — replace with API signup call");
    setUser({ email, name: name || "New User" });
    return { success: true };
  };

  // Mock logout function
  const logout = async () => {
    console.warn("Firebase removed — replace with API logout call");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Hook for easy access
export const useAuth = () => useContext(AuthContext);
