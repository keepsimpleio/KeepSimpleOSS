import axios, { InternalAxiosRequestConfig } from 'axios';

import { getAccessToken } from '../cookie';

const defaultOptions = {
  baseURL: process.env.NEXT_PUBLIC_STRAPI,
};

const axiosInstance = axios.create(defaultOptions);

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();

    if (
      !token &&
      !['get', 'head', 'options'].includes(config.method ?? 'get')
    ) {
      throw new Error('Sign in to change your library.');
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  error => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const token = getAccessToken();
      if (token && error.config?.headers?.Authorization === `Bearer ${token}`) {
        window.localStorage.removeItem('accessToken');
        getAccessToken();
        window.dispatchEvent(new Event('auth:expired'));
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
