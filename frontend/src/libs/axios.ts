import axios from "axios";
import { store } from "../app/store";
import { deleteToken } from "../features/auth/jwtSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const token = store.getState().jwt.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // token invalid / expired
      store.dispatch(deleteToken());

      // redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;