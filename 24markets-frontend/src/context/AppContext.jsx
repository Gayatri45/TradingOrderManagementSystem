// import React, { createContext, useReducer, useCallback } from 'react';

// export const AppContext = createContext();

// const initialState = {
//   user: null,
//   markets: [],
//   orders: [],
//   loading: false,
//   error: null,
// };

// const appReducer = (state, action) => {
//   switch (action.type) {
//     case 'SET_USER':
//       return { ...state, user: action.payload };
//     case 'LOGOUT_USER':
//       return { ...state, user: null };
//     case 'SET_MARKETS':
//       return { ...state, markets: action.payload };
//     case 'SET_ORDERS':
//       return { ...state, orders: action.payload };
//     case 'ADD_ORDER':
//       return { ...state, orders: [...state.orders, action.payload] };
//     case 'SET_LOADING':
//       return { ...state, loading: action.payload };
//     case 'SET_ERROR':
//       return { ...state, error: action.payload };
//     case 'CLEAR_ERROR':
//       return { ...state, error: null };
//     default:
//       return state;
//   }
// };

// export const AppProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(appReducer, initialState);

//   const setUser = useCallback((user) => {
//     dispatch({ type: 'SET_USER', payload: user });
//   }, []);

//   const logoutUser = useCallback(() => {
//     dispatch({ type: 'LOGOUT_USER' });
//   }, []);

//   const setMarkets = useCallback((markets) => {
//     dispatch({ type: 'SET_MARKETS', payload: markets });
//   }, []);

//   const setOrders = useCallback((orders) => {
//     dispatch({ type: 'SET_ORDERS', payload: orders });
//   }, []);

//   const addOrder = useCallback((order) => {
//     dispatch({ type: 'ADD_ORDER', payload: order });
//   }, []);

//   const setLoading = useCallback((loading) => {
//     dispatch({ type: 'SET_LOADING', payload: loading });
//   }, []);

//   const setError = useCallback((error) => {
//     dispatch({ type: 'SET_ERROR', payload: error });
//   }, []);

//   const clearError = useCallback(() => {
//     dispatch({ type: 'CLEAR_ERROR' });
//   }, []);

//   const value = {
//     ...state,
//     setUser,
//     logoutUser,
//     setMarkets,
//     setOrders,
//     addOrder,
//     setLoading,
//     setError,
//     clearError,
//   };

//   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// };

import React, { createContext, useReducer, useCallback, useEffect } from 'react';
import { authAPI } from '../services/api';

export const AppContext = createContext();

const initialState = {
  user: null,
  markets: [],
  orders: [],
  loading: false,
  error: null,
  isAuthenticated: false,
  token: null,
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'LOGOUT_USER':
      return { ...state, user: null, isAuthenticated: false, token: null };
    case 'SET_MARKETS':
      return { ...state, markets: action.payload };
    case 'SET_ORDERS':
      return { ...state, orders: action.payload };
    case 'ADD_ORDER':
      return { ...state, orders: [...state.orders, action.payload] };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authAPI.getCurrentUser();
        if (response.data) {
          dispatch({ type: 'SET_USER', payload: response.data });
        }
      } catch (error) {
        console.log('Not authenticated');
      }
    };

    checkAuth();
  }, []);

  const setUser = useCallback((user) => {
    dispatch({ type: 'SET_USER', payload: user });
  }, []);

  const logoutUser = useCallback(async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    dispatch({ type: 'LOGOUT_USER' });
  }, []);

  const setMarkets = useCallback((markets) => {
    dispatch({ type: 'SET_MARKETS', payload: markets });
  }, []);

  const setOrders = useCallback((orders) => {
    dispatch({ type: 'SET_ORDERS', payload: orders });
  }, []);

  const addOrder = useCallback((order) => {
    dispatch({ type: 'ADD_ORDER', payload: order });
  }, []);

  const setLoading = useCallback((loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value = {
    ...state,
    setUser,
    logoutUser,
    setMarkets,
    setOrders,
    addOrder,
    setLoading,
    setError,
    clearError,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};