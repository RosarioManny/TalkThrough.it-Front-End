import axios from 'axios';

// Use environment variables for flexibility in different environments
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

// Function to fetch providers
export const fetchProviders = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/search/providers`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    return res.data;
  } catch (error) {
    console.error('Fetch providers error:', error);
    throw error;
  }
};
