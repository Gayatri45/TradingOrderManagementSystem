// import axios from 'axios';

// const API_BASE_URL = 'http://localhost:8080/api';

// const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true, // Important: Send cookies with requests
// });

// // Auth API calls
// export const authAPI = {
//   register: (userData) => api.post('/auth/register', userData),
//   login: (credentials) => api.post('/auth/login', credentials),
//   logout: () => api.post('/auth/logout'),
//   getCurrentUser: () => api.get('/auth/me'),
//   refreshToken: () => api.post('/auth/refresh'),
// };

// // User API calls
// export const userAPI = {
//   getUser: (id) => api.get(`/users/${id}`),
//   getUserByEmail: (email) => api.get(`/users/email/${email}`),
//   getAllUsers: () => api.get('/users'),
//   updateUser: (id, userData) => api.put(`/users/${id}`, userData),
//   updateWallet: (id, amount) => api.put(`/users/${id}/wallet?amount=${amount}`),
//   deleteUser: (id) => api.delete(`/users/${id}`),
// };

// // Market API calls
// export const marketAPI = {
//   getMarkets: () => api.get('/markets/getAllMarkets'),
//   getMarket: (id) => api.get(`/markets/${id}`),
//   getMarketBySymbol: (symbol) => api.get(`/markets/symbol/${symbol}`),
//   createMarket: (marketData) => api.post('/markets', marketData),
//   updateMarket: (id, marketData) => api.put(`/markets/${id}`, marketData),
// };

// // Order API calls
// export const orderAPI = {
//   createOrder: (orderData) => api.post('/orders', orderData),
//   getOrder: (id) => api.get(`/orders/${id}`),
//   getOrdersByUser: (userId) => api.get(`/orders/user/${userId}`),
//   getOrdersByMarket: (marketId) => api.get(`/orders/market/${marketId}`),
//   updateOrderStatus: (id, status) => api.put(`/orders/${id}/status?status=${status}`),
//   deleteOrder: (id) => api.delete(`/orders/${id}`),
// };

// export default api;


import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔹 Add JWT token automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Optional: auto logout if token expired
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 403) {
//       console.log("Unauthorized - logging out");
//       localStorage.removeItem("token");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

// ================= AUTH =================
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),

  login: async (credentials) => {
    const res = await api.post("/auth/login", credentials);

    // Save token
    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }

    return res;
  },

  logout: () => {
    localStorage.removeItem("token");
    return api.post("/auth/logout");
  },

  getCurrentUser: () => api.get("/auth/me"),
  refreshToken: () => api.post("/auth/refresh"),
};

// ================= USERS =================
export const userAPI = {
  getUser: (id) => api.get(`/users/${id}`),
  getUserByEmail: (email) => api.get(`/users/email/${email}`),
  getAllUsers: () => api.get("/users"),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  updateWallet: (id, amount) =>
    api.put(`/users/${id}/wallet?amount=${amount}`),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// ================= MARKETS =================
export const marketAPI = {
  getMarkets: () => api.get("/markets/getAllMarkets"),
  getMarket: (id) => api.get(`/markets/${id}`),
  getMarketBySymbol: (symbol) => api.get(`/markets/symbol/${symbol}`),
  createMarket: (marketData) => api.post("/markets", marketData),
  updateMarket: (id, marketData) =>
    api.put(`/markets/${id}`, marketData),
};

// ================= ORDERS =================
export const orderAPI = {
  createOrder: (orderData) => api.post("/orders", orderData),
  getOrder: (id) => api.get(`/orders/${id}`),
  getOrdersByUser: (userId) => api.get(`/orders/user/${userId}`),
  getOrdersByMarket: (marketId) =>
    api.get(`/orders/market/${marketId}`),
  updateOrderStatus: (id, status) =>
    api.put(`/orders/${id}/status?status=${status}`),
  deleteOrder: (id) => api.delete(`/orders/${id}`),
};

export default api;