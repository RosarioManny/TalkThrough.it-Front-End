import axios from "axios";

// Use Vite's environment variable
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Function for signing up a new client
export const signupClient = async (formData) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/auth/register/client`, formData);
    console.log(res.data);
    localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (error) {
    console.error('Client Signup error:', error);
    throw error;
  }
};

// Function for signing up a new provider
export const signupProvider = async (formData) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/auth/register/provider`, formData);
    console.log(res.data);
    localStorage.setItem('token', res.data.token);
    return res.data;
  } catch (error) {
    console.error('Provider Signup error:', error);
    throw error;
  }
};

// Function for signing in an existing user
export const signin = async (clientData) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/auth/clients/signin`, clientData);
    console.log(res.data);

    if (res.data.error) {
      throw new Error(res.data.error);
    }

    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      const client = JSON.parse(atob(res.data.token.split('.')[1])); // Decode the JWT payload
      return client;
    }
  } catch (error) {
    console.error('Signin error:', error);
    throw error;
  }
};

// Function to get the current user from the token
export const getClient = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const client = JSON.parse(atob(token.split('.')[1]));
  return client;
};

// Function to sign out the user
export const signOut = () => {
  localStorage.removeItem('token');
};
