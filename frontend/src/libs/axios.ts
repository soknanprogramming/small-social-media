
// frontend/src/libs/axios.ts

import axios from "axios";
import { store } from "../app/store";
import { setLoggedIn } from "../features/auth/loginSlice";
import { isTokenExpired } from "./token";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // secure storage recommended for production

  if (token) {
    // attach JWT to Authorization header
    config.headers.Authorization = `Bearer ${token}`;

    // check token expiration
    if (isTokenExpired(token)) {
      store.dispatch(setLoggedIn(false));
      window.dispatchEvent(new Event("unauthorized"));
    }
  }

  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // console.error(localStorage.getItem("token"));

    if (status === 401) {
      // token invalid / expired
      store.dispatch(setLoggedIn(false));

      // notify app
      window.dispatchEvent(new Event("unauthorized"));
    }

    return Promise.reject(error);
  }
);

export default api;
