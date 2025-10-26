"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

// 👇 Environment variable for backend API
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api";

// 🧩 Create Axios instance
const api = axios.create({
  baseURL: API_BASE,
});

// 🔐 Automatically attach Bearer token to every request
api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  /* 🧩 SIGNUP */
  const signup = async ({ full_name, email, password, role }) => {
    try {
      const { data } = await api.post("/auth/register", {
        full_name,
        email,
        password,
        role,
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
      }

      return { success: true, user: data.user, message: "Signup successful" };
    } catch (error) {
      console.error("Signup error:", error);
      return { success: false, message: error.response?.data?.error || "Signup failed" };
    }
  };

  /* 🔐 LOGIN */
  const login = async (email, password) => {
    try {
      const { data } = await api.post("/auth/login", { email, password });

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
      }

      return { success: true, user: data.user, message: "Login successful" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: error.response?.data?.error || "Login failed" };
    }
  };

  /* 🚪 LOGOUT */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  /* ✅ VERIFY TOKEN / RESTORE SESSION */
  const verifySession = async () => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await api.get("/auth/verify");
      if (data.success && data.user) {
        setUser(data.user);
        setToken(storedToken);
      } else {
        logout();
      }
    } catch (error) {
      console.warn("Session verification failed:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  /* ♻️ Run once on mount */
  useEffect(() => {
    verifySession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        signup,
        login,
        logout,
        verifySession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ✅ Custom Hook for components */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export default AuthContext;
