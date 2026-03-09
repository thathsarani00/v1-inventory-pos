/**
 * Authentication service for Spring Boot backend integration
 * Handles user registration, login, logout, and token management
 */

import axiosInstance from './axiosConfig';

// User interface matching backend response
export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phone?: string;
}

// Login response from backend
export interface LoginResponse {
  token: string;
  refreshToken: string;
  type: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

// Register response from backend
export interface RegisterResponse {
  message: string;
  userId: number;
  token: string;
  refreshToken: string;
}

// Registration data
export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

// Auth response for consistent return type
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

/**
 * Register a new user
 * POST /auth/register
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<RegisterResponse>('/auth/register', data);
    
    const { token, refreshToken, userId, message } = response.data;
    
    // Create user object from registration data
    const user: User = {
      id: userId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      role: 'USER', // Default role
      phone: data.phone,
    };
    
    // Save tokens and user to localStorage
    localStorage.setItem('auth_token', token);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('current_user', JSON.stringify(user));
    
    return {
      success: true,
      message: message || 'Registration successful!',
      user,
      token,
    };
  } catch (error: any) {
    // Handle error response
    let errorMessage = 'Registration failed. Please try again.';
    
    if (error.response?.data) {
      const data = error.response.data;
      
      // Check for validation errors (field-specific)
      if (data.errors && typeof data.errors === 'object') {
        const fieldErrors = Object.entries(data.errors)
          .map(([_field, msg]) => `${msg}`)
          .join(', ');
        errorMessage = fieldErrors;
      } 
      // Check for general error message
      else if (data.message) {
        errorMessage = data.message;
      }
      // Check for error property
      else if (data.error) {
        errorMessage = data.error;
      }
    }
    
    return {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Login user with email and password
 * POST /auth/login
 */
export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await axiosInstance.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    
    const { token, refreshToken, id, email: userEmail, firstName, lastName, role } = response.data;
    
    // Create user object from response
    const user: User = {
      id,
      firstName,
      lastName,
      email: userEmail,
      role,
    };
    
    // Save tokens and user to localStorage
    localStorage.setItem('auth_token', token);
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('current_user', JSON.stringify(user));
    
    return {
      success: true,
      message: 'Login successful!',
      user,
      token,
    };
  } catch (error: any) {
    // Handle error response
    let errorMessage = 'Login failed. Please try again.';
    
    if (error.response?.status === 401) {
      errorMessage = 'Invalid email or password';
    } else if (error.response?.status === 403) {
      errorMessage = 'Your account is inactive. Please contact support.';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    return {
      success: false,
      message: errorMessage,
    };
  }
};

/**
 * Logout user
 * Removes tokens and user data from localStorage
 */
export const logout = (): void => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('current_user');
};

/**
 * Get current logged-in user from localStorage
 */
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('current_user');
  const token = localStorage.getItem('auth_token');
  
  if (!userJson || !token) {
    return null;
  }

  try {
    return JSON.parse(userJson);
  } catch (error) {
    // If JSON parsing fails, clear invalid data
    logout();
    return null;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('auth_token');
  const user = localStorage.getItem('current_user');
  return !!(token && user);
};

/**
 * Get authentication token
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

/**
 * Get refresh token
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refresh_token');
};

