import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Production API Base URL (hard-coded to ensure it's in the build)
const API_BASE_URL = "http://45.8.149.194:5555/v1";

/**
 * Axios instance configured for Spring Boot backend
 * Base URL: Production server (hard-coded)
 * Automatically attaches JWT tokens and handles authentication errors
 * Implements automatic token refresh on 401 errors
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

/**
 * Process all requests that were queued while refreshing token
 */
const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

/**
 * Request Interceptor
 * Attaches JWT token from localStorage to Authorization header
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Get token from localStorage
    const token = localStorage.getItem('auth_token');
    
    // If token exists, attach it to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    // Handle request error
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles 401 Unauthorized errors with automatic token refresh
 * Falls back to logout and redirect if refresh fails
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return successful response as-is
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Check if error is 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Don't attempt refresh on login or refresh endpoints
      const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || 
                            originalRequest.url?.includes('/auth/register') ||
                            originalRequest.url?.includes('/auth/refresh');
      
      // If it's an auth endpoint or already retried, logout
      if (isAuthEndpoint || originalRequest._retry) {
        // Clear all authentication data from localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('current_user');
        
        // Redirect to login page
        window.location.href = '/login';
        return Promise.reject(error);
      }
      
      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch(err => {
            return Promise.reject(err);
          });
      }
      
      // Mark request as retried to prevent infinite loops
      originalRequest._retry = true;
      isRefreshing = true;
      
      // Get refresh token from localStorage
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        // No refresh token available, logout
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('current_user');
        window.location.href = '/login';
        return Promise.reject(error);
      }
      
      try {
        // Call refresh endpoint to get new access token
        const response = await axios.post(
          'http://localhost:5555/v1/auth/refresh',
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
        
        const { accessToken, refreshToken: newRefreshToken } = response.data;
        
        // Update tokens in localStorage
        localStorage.setItem('auth_token', accessToken);
        if (newRefreshToken) {
          localStorage.setItem('refresh_token', newRefreshToken);
        }
        
        // Update Authorization header with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        
        // Process queued requests with new token
        processQueue(null, accessToken);
        
        // Retry the original request with new token
        isRefreshing = false;
        return axiosInstance(originalRequest);
        
      } catch (refreshError) {
        // Refresh failed, process queue with error
        processQueue(refreshError as Error, null);
        isRefreshing = false;
        
        // Clear all authentication data from localStorage
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('current_user');
        
        // Redirect to login page
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Reject promise with error for further handling
    return Promise.reject(error);
  }
);

export default axiosInstance;
