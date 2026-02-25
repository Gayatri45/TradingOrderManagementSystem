import React, { createContext, useReducer, useCallback, useEffect } from "react";
import { authAPI } from "../services/api";

export const AppContext = createContext();

const initialState = {
  user: null,
  markets: [],
  orders: [],
  loading: false,
  error: null,
  isAuthenticated: false,
  token: localStorage.getItem("token"),
  role: localStorage.getItem("role"),
};

const appReducer = (state, action) => {
  switch (action.type) {

    case "SET_USER":
      return {
        ...state,
        user: action.payload,
        role: action.payload.role,
        isAuthenticated: true,
      };

    case "SET_TOKEN":
      return { ...state, token: action.payload };

    case "LOGOUT_USER":
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      return { ...initialState, token: null, role: null };

    case "SET_MARKETS":
      return { ...state, markets: action.payload };

    case "SET_ORDERS":
      return { ...state, orders: action.payload };

    case "ADD_ORDER":
      return { ...state, orders: [...state.orders, action.payload] };

    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "CLEAR_ERROR":
      return { ...state, error: null };

    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // ✅ Check login on refresh
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await authAPI.getCurrentUser();

        // backend must return role here
        dispatch({ type: "SET_USER", payload: res.data });

        localStorage.setItem("role", res.data.role);

      } catch (err) {
        dispatch({ type: "LOGOUT_USER" });
      }
    };

    checkAuth();
  }, []);

  // ✅ After login
  const setUser = useCallback((loginResponse) => {

    localStorage.setItem("token", loginResponse.token);
    localStorage.setItem("role", loginResponse.role);

    dispatch({ type: "SET_TOKEN", payload: loginResponse.token });

    dispatch({
      type: "SET_USER",
      payload: {
        id: loginResponse.id,
        email: loginResponse.email,
        fullName: loginResponse.fullName,
        walletBalance: loginResponse.walletBalance,
        role: loginResponse.role,
      },
    });

  }, []);

  const logoutUser = useCallback(() => {
    dispatch({ type: "LOGOUT_USER" });
  }, []);

  const value = {
    ...state,
    setUser,
    logoutUser,
    setMarkets: (m) => dispatch({ type: "SET_MARKETS", payload: m }),
    setOrders: (o) => dispatch({ type: "SET_ORDERS", payload: o }),
    addOrder: (o) => dispatch({ type: "ADD_ORDER", payload: o }),
    setLoading: (l) => dispatch({ type: "SET_LOADING", payload: l }),
    setError: (e) => dispatch({ type: "SET_ERROR", payload: e }),
    clearError: () => dispatch({ type: "CLEAR_ERROR" }),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};