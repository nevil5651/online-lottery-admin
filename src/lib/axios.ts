// src/lib/axios.ts
import axios from 'axios';

// const apiClient = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || 'https://dummyapi.io', // fallback
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export { apiClient };


export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for auth tokens
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Handle unauthorized error
    }
    return Promise.reject(error);
  }
);

