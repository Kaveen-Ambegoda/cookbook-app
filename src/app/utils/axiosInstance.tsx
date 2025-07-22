// Location: src/app/utils/axiosInstance.ts (or wherever your API file is)

import axios from 'axios';

// --- THE DEFINITIVE FIX ---
// Hardcode the backend URL. This is now the single source of truth.
const API_BASE_URL = 'http://localhost:5007';

const API = axios.create({
  baseURL: API_BASE_URL, // All requests will now correctly start with http://localhost:5007
});

// Request Interceptor: Adds the auth token to every request header.
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      if (!config.headers) {
        config.headers = {};
      }
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Automatically handles token refreshing.
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      localStorage.getItem('refreshToken')
    ) {
      originalRequest._retry = true;
      try {
        // The refresh call also uses the configured baseURL automatically.
        const refreshResponse = await API.post('/api/Auth/refresh', {
          token: localStorage.getItem('token'),
          refreshToken: localStorage.getItem('refreshToken'),
        });

        const { token: newToken, refreshToken: newRefreshToken } = refreshResponse.data;
        localStorage.setItem('token', newToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return API(originalRequest);
        
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        if (typeof window !== 'undefined') {
          window.location.href = '/Pages/Login_Register/Login'; // Adjust to your login page path
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default API;