import axios from "axios";
import { isTokenExpired } from "../utils/auth";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Configure axios defaults
const axiosInstance = axios.create({
    baseURL: BACKEND_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true  // Important for CORS requests with credentials
});

// Request interceptor to add authorization header
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const handleAuthSuccess = (response) => {
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        const user = JSON.parse(atob(response.data.token.split('.')[1]));
        localStorage.setItem('user', JSON.stringify(user));
        console.log('Token and user data stored');
    }
    return response.data;
};

export const signupClient = async (formData) => {
    try {
        const res = await axios.post(`${BACKEND_URL}/auth/register/client`, formData);
        console.log('Client registration response:', res.data);
        return handleAuthSuccess(res);
    } catch (error) {
        console.error('Client Signup error:', error);
        throw error;
    }
};

export const signupProvider = async (formData) => {
    try {
        const submitData = {
            ...formData,
            yearsOfExperience: formData.yearsOfExperience,
        };

        console.log('Provider Registration Request:', {
            url: `${BACKEND_URL}/auth/register/provider`,
            data: {
                ...submitData,
                password: '[HIDDEN]'
            }
        });

        const res = await axios.post(
            `${BACKEND_URL}/auth/register/provider`, 
            submitData
        );

        console.log('Provider registration response:', res.data);
        return handleAuthSuccess(res);
    } catch (error) {
        console.error('Provider Signup error:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        throw error;
    }
};

export const signin = async (userData) => {
  try {
    console.log('Attempting to connect to:', BACKEND_URL); // For debugging
      const res = await axios.post(`${BACKEND_URL}/auth/login`, userData);
      if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          const user = JSON.parse(atob(res.data.token.split('.')[1]));
          localStorage.setItem('user', JSON.stringify(user));
          return res.data;
      }
      return { error: 'Invalid response from server' };
  } catch (error) {
      console.log('Signin error:', error.response?.status);
      if (error.response?.status === 401) {
          return { error: 'Invalid email or password' };
      }
      return { error: 'An error occurred during the login process' };
  }
};


export const getUser = () => {
    if (isTokenExpired()) {
        signOut();
        return null;
    }

    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            return JSON.parse(storedUser);
        }

        const token = localStorage.getItem('token');
        if (!token) return null;
        
        const user = JSON.parse(atob(token.split('.')[1]));
        localStorage.setItem('user', JSON.stringify(user));
        return user;
    } catch (error) {
        console.error('Error getting user data:', error);
        signOut();
        return null;
    }
};

export const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('storage'));
};
