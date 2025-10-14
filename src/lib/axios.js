import axios from "axios";
import Toast from "@/utils/toast"; // optional, for automatic global toasts

// Create Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds
});

// 🧩 Request interceptor: attach token if available
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🧩 Response interceptor: handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract useful information
    const status = error.response?.status;
    const errorData = error.response?.data || {};
    const message =
      errorData?.message ||
      errorData?.error ||
      error.message ||
      "Something went wrong with the request";

    // 🧠 Log detailed info for debugging
    console.error("🚨 API Error:", {
      url: error.config?.url,
      status,
      message,
      backend: errorData,
    });


    // Always reject with a consistent error object
    return Promise.reject({
      status,
      message,
      data: errorData,
      original: error, // keep the original Axios error if needed
    });
  }
);

/**
 * 🔁 Generic API request function
 * Cleanly wraps axios and returns `response.data`.
 * If an error occurs, throws a simplified error object.
 */
export const apiRequest = async ({ method, url, data = null, params = null }) => {
  try {
    const response = await api({
      method,
      url,
      data,
      params,
    });
    return response.data;
  } catch (error) {
    // Rethrow simplified error so your thunk can catch it
    throw {
      message: error?.message || "Unexpected API error",
      status: error?.status || error?.response?.status,
      data: error?.data || error?.response?.data,
    };
  }
};

export default api;
