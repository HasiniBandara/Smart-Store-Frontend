import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:3000";

// Axios instance (use everywhere)
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

// auth

export const getAuthToken = () => localStorage.getItem("token");

export const decodeToken = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const getUserIdFromToken = () => {
  const token = getAuthToken();
  if (!token) throw new Error("Please login...");

  const decoded = decodeToken(token);
  return decoded?.id || decoded?.userId || decoded?.sub;
};


// orders

export const saveOrderToBackend = async (orderData: {
  totalPrice: number;
  status: string;
  cartItems: any[];
  transactionId?: string;
  paymentGateway?: string;
}) => {
  const userId = getUserIdFromToken();

  const response = await api.post("/orders", {
    userId,
    ...orderData,
  });

  return response.data;
};