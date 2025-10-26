// context/AuthContext.js
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// ✅ Use environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  /* 🧩 SIGNUP (CREATE NEW ACCOUNT) */
  const signup = async ({ full_name, email, password, role }) => {
  try {
    const res = await fetch(`${API_URL}/api/auth/register`, {  // 👈 changed from signup → register
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name, email, password, role }),
    });

    const data = await res.json();
     if (!res.ok) {
        return { success: false, message: data.error || "Signup failed" };
      }
    
     setUser(data.user);
      return { success: true, user: data.user, message: "Signup successful" };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, message: error.message || "Signup error" };
    }
};

  /* 🔐 LOGIN USER */
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.error || "Invalid credentials" };
      }
  };

  /* 🚪 LOGOUT USER */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  /* ♻️ CHECK EXISTING SESSION */
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/* ✅ Custom Hook */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
