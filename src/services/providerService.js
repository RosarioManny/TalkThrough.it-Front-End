import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export const fetchProviders = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/providers`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      return res.data;
    } catch (error) {
      console.error('Fetch providers error:', error);
      throw error;
    }
};
