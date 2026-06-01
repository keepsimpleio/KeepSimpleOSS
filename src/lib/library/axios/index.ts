import axios, { InternalAxiosRequestConfig } from 'axios';
import { getCookie } from '../cookie';

const defaultOptions = {
  baseURL: process.env.NEXT_PUBLIC_STRAPI,
};

const axiosInstance = axios.create(defaultOptions);

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = getCookie('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error) => Promise.reject(error)
);

export default axiosInstance;
