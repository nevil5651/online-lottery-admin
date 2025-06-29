// import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// const apiClient: AxiosInstance = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
//   timeout: 15000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor for adding auth token
// apiClient.interceptors.request.use(
//   (config: AxiosRequestConfig) => {
//     const token = sessionStorage.getItem('adminToken');
//     if (token) {
//       config.headers = config.headers || {};
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error: AxiosError) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for error handling
// apiClient.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   (error: AxiosError) => {
//     // Handle 401 Unauthorized
//     if (error.response?.status === 401) {
//       // Redirect to login or handle token refresh
//       sessionStorage.removeItem('adminToken');
//       sessionStorage.removeItem('adminUser');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default apiClient;