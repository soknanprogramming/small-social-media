this my axios config

``` ts
// frontend/src/libs/axios.ts

import axios from "axios";
import { store } from "../app/store";
import { setLoggedIn } from "../features/auth/loginSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      store.dispatch(setLoggedIn(false));
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default api;


```



