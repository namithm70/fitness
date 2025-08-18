import axios from 'axios';

// API Configuration for different environments
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://fitness-fkct.onrender.com' // Your actual backend URL
    : 'http://localhost:5000'
  );

// Always use the correct backend URL for production
const FINAL_API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://fitness-fkct.onrender.com' 
  : (process.env.REACT_APP_API_URL || 'http://localhost:5000');

// Debug logging to help troubleshoot
console.log('API Base URL:', API_BASE_URL);
console.log('Final API URL:', FINAL_API_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

export const API_CONFIG = {
  baseURL: FINAL_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Create axios instance with default configuration
const api = axios.create(API_CONFIG);

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['x-auth-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { api };
export default API_CONFIG;
