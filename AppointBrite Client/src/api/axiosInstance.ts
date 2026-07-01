/**
 * Axios instance with JWT interceptors.
 * Automatically attaches access token and handles token refresh.
 */
import axios from 'axios';
import { env } from '@/config/env';
import { store } from '@/store';
import { setCredentials, logout } from '@/store/slices/authSlice';

const axiosInstance = axios.create({
  baseURL: env.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor — attach access token
axiosInstance.interceptors.request.use(
  (config) => {
    const { accessToken } = store.getState().auth;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — handle 401 and refresh token
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          `${env.API_URL}/auth/refresh`,
          {},
          { withCredentials: true },
        );

        store.dispatch(
          setCredentials({
            user: data.data.user,
            accessToken: data.data.accessToken,
          }),
        );

        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return axiosInstance(originalRequest);
      } catch {
        store.dispatch(logout());
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
