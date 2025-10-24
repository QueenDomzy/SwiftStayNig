// frontend/utils/api.js
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://swiftstaynigeria-ua1e.onrender.com/api",
  timeout: 10000,
});

export default api;
