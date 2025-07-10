import axios from 'axios';

// Use environment variable if available, otherwise use localhost
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/auth';

// Create a default axios instance
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 15000, // 15 seconds timeout
});

// Create a private axios instance with auth token
export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: false,
    timeout: 15000, // 15 seconds timeout
});

// Add request interceptor to add token to requests
axiosPrivate.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// Add response interceptor to handle errors and retry on 5xx errors (server wake-up issues)
axiosPrivate.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        
        // If the error is due to network issues or server errors (5xx)
        // and we haven't already tried to retry
        if ((error.code === 'ECONNABORTED' || 
             (error.response && error.response.status >= 500) || 
             !error.response) && 
            !originalRequest._retry) {
            
            originalRequest._retry = true;
            
            // Wait for a moment to allow server to wake up
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Retry the request
            return axiosPrivate(originalRequest);
        }
        
        return Promise.reject(error);
    }
);

// Add the same retry logic to the default axios instance
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        
        if ((error.code === 'ECONNABORTED' || 
             (error.response && error.response.status >= 500) || 
             !error.response) && 
            !originalRequest._retry) {
            
            originalRequest._retry = true;
            await new Promise(resolve => setTimeout(resolve, 3000));
            return axiosInstance(originalRequest);
        }
        
        return Promise.reject(error);
    }
);

export default axiosInstance; 