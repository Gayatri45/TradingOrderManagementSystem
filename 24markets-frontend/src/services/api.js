import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT Automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    // console.log("Interceptor token:", localStorage.getItem("token"));
    if (token && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto Logout if Unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    // console.log(status);
    // Prevent loop if already on login page
    const isLoginPage = window.location.pathname === "/login";

    // if (!isLoginPage) {  //(status === 401 || status === 403) && 
    //   localStorage.removeItem("token");
    //   localStorage.removeItem("role");

    //   // Use replace instead of href (no reload loop)
    //   window.location.replace("/login");
    // }

    return Promise.reject(error);
  }
);

// Helper: Decode Role From JWT
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
};

export const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const decoded = parseJwt(token);
  return decoded?.role || null; // ROLE_ADMIN / ROLE_USER
};

export const isAdmin = () => getUserRole() === "ROLE_ADMIN";
export const isUser = () => getUserRole() === "ROLE_USER";

// ================= AUTH =================
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),

  login: async (credentials) => {
    const res = await api.post("/auth/login", credentials);

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);

      // Extract role from token and store (optional)
      const decoded = parseJwt(res.data.token);
      if (decoded?.role) {
        localStorage.setItem("role", decoded.role);
      }
    }

    return res;
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    return Promise.resolve();
  },

  getCurrentUser: () => api.get("/auth/me"),
};

// ================= USERS =================
export const userAPI = {
  getUser: (id) => api.get(`/users/${id}`),

  // ADMIN ONLY
  getAllUsers: () => {
    if (!isAdmin()) {
      throw new Error("Access denied: Admin only");
    }
    return api.get("/users/all");
  },

  updateUser: (id, userData) => api.put(`/users/${id}`, userData),

  deleteUser: (id) => {
    if (!isAdmin()) {
      throw new Error("Access denied: Admin only");
    }
    return api.delete(`/users/${id}`);
  },
};

// ================= MARKETS =================
export const marketAPI = {
  getMarkets: () => api.get("/markets/getAllMarkets"),

  createMarket: (marketData) => {
    if (!isAdmin()) {
      throw new Error("Admin only");
    }
    return api.post("/markets", marketData);
  },  

  updateMarket: (id, marketData) => {
    if (!isAdmin()) {
      throw new Error("Admin only");
    }
    return api.put(`/markets/${id}`, marketData);
  },
};

// ================= ORDERS =================
export const orderAPI = {
  createOrder: (orderData) =>
    api.post(`/orders/createOrder`, orderData),

  getOrder: (id) => api.get(`/orders/${id}`),

  getOrdersByUser: (userId) =>
    api.get(`/orders/user/${userId}`),

  getAllUsersOrders: () => {
    if (!isAdmin()) {
      throw new Error("Admin only");
    }
    return api.get('/orders/all')  
  },
  getRecentsOrders: () => {    
    return api.get('/orders/getRecentsOrders')  
  },
  updateOrderStatus: (id, newstatus) => {
     if (!isAdmin()) {
      throw new Error("Admin only");
    }
    console.log(newstatus)
    return  api.put(`/orders/status/${id}?status=${newstatus}`)
  },
  deleteOrder: (id) => {
    if (!isAdmin()) {
      throw new Error("Admin only");
    }
    return api.delete(`/orders/${id}`);
  },
};

export default api;
