// API Configuration for different environments
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://fitness-fkct.onrender.com' // Your actual backend URL (no port needed for Render)
    : 'http://localhost:5000'
  );

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

export default API_CONFIG;
