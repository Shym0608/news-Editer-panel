import axios from "axios";
import toast from "react-hot-toast";

// ✅ Automatically switches between .env.local and .env.production
// const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://gujarat-national-news-backend.onrender.com";
console.log("API BASE URL:", process.env.NEXT_PUBLIC_API_BASE_URL);

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
});
console.log("API Instance:", api.defaults.baseURL);

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("userToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "❌ Something went wrong!";

    // Show toast error
    toast.error(message);

    // 🔥 Auto logout if token expired
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("userToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export const cmnApi = {
  get: async (url, params = {}) => {
    const response = await api.get(url, { params });
    return response.data;
  },

  post: async (url, data = {}) => {
    const response = await api.post(url, data);
    return response.data;
  },

  put: async (url, data = {}) => {
    const response = await api.put(url, data);
    return response.data;
  },

  delete: async (url, data = {}) => {
    const response = await api.delete(url, { data });
    return response.data;
  },
};
