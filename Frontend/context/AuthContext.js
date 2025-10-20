import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Placeholder login/logout logic
  const login = async (email, password) => {
    // TODO: Replace with real backend auth later
    console.log("Logging in with:", email, password);
    setUser({ email });
  };

  const signup = async (email, password) => {
    // TODO: Replace with real backend auth later
    console.log("Signing up with:", email, password);
    setUser({ email });
  };

  const logout = async () => {
    console.log("Logging out");
    setUser(null);
  };

  useEffect(() => {
    // Placeholder: simulate checking existing session
    const storedUser = null;
    if (storedUser) setUser(storedUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for easy access
export const useAuth = () => useContext(AuthContext);
