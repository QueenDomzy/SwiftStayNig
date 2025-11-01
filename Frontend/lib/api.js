// lib/api.js or services/api.js

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

// 🔐 Login user
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed. Please try again.");
    }

    return await response.json();
  } catch (error) {
    console.error("Login error:", error.message);
    throw error;
  }
};

// 🏨 Fetch all properties
export const fetchProperties = async () => {
  try {
    const res = await fetch(`${API_BASE}/properties`);
    if (!res.ok) throw new Error("Failed to fetch properties");
    return await res.json();
  } catch (error) {
    console.error("Property fetch error:", error.message);
    throw error;
  }
};
