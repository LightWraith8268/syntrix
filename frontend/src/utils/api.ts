import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_ORIGIN ?? window.location.origin,
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("syntrix:accessToken");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error", error);
    throw error;
  },
);
