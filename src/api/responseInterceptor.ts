import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import { http } from "./http";

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export function createRefreshInterceptor() {
  return async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;
    if (!original || error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    const refresh = localStorage.getItem("refresh");
    if (!refresh) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      const baseURL = import.meta.env.VITE_API_BASE || "http://localhost:8000/api";
      const { data } = await axios.post(`${baseURL}/auth/refresh/`, { refresh });
      localStorage.setItem("access", data.access);
      original.headers.Authorization = `Bearer ${data.access}`;
      return http(original);
    } catch {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      return Promise.reject(error);
    }
  };
}
