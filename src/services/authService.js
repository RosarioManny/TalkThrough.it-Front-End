// authService.js
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const signupClient = async (formData) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/auth/register/client`, formData);
    console.log('Client registration response:', res.data);
    localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (error) {
    console.error('Client Signup error:', error);
    throw error;
  }
};

export const signupProvider = async (formData) => {
  try {
    // Ensure field names match exactly what the backend expects
    const submitData = {
      ...formData,
      yearsOfExperience: formData.yearsOfExperience, // Make sure we're using the correct field name
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
    
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
    }
    
    return res.data;
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
    const res = await axios.post(`${BACKEND_URL}/auth/login`, userData);
    console.log('Signin response:', res.data);

    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      const user = JSON.parse(atob(res.data.token.split('.')[1]));
      return user;
    }
  } catch (error) {
    console.error('Signin error:', error);
    throw error;
  }
};

export const getUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const user = JSON.parse(atob(token.split('.')[1]));
  return user;
};

export const signOut = () => {
  localStorage.removeItem('token');
};
