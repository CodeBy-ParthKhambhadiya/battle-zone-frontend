import axios from "axios";
import Toast from "@/utils/toast";

// Create Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🧩 Request interceptor: attach token if available
api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
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
    const status = error.response?.status;
    const errorData = error.response?.data || {};
    const message =
      errorData?.message ||
      errorData?.error ||
      error.message ||
      "Something went wrong with the request";

    // You can show toasts globally if you like:
    // Toast.error(message);

    return Promise.reject({
      status,
      message,
      data: errorData,
      original: error,
    });
  }
);

/**
 * 🔁 Generic API request wrapper
 * - Removes empty `data` for DELETE/GET
 * - Returns only `response.data`
 */
export const apiRequest = async ({ method, url, data, params }) => {
  try {
    const config = {
      method,
      url,
      params,
    };

    // ✅ Only attach body if it’s not undefined
    // Prevents sending "null" for DELETE/GET
    if (data !== undefined && data !== null && method !== "get" && method !== "delete") {
      config.data = data;
    }

    const response = await api(config);
    return response.data;
  } catch (error) {
    // Optional global toast
    // Toast.error(error?.message || "Unexpected API error");

    throw {
      message: error?.message || "Unexpected API error",
      status: error?.status || error?.response?.status,
      data: error?.data || error?.response?.data,
    };
  }
};

export default api;
