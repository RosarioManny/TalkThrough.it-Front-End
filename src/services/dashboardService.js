import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Helper function to get headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  console.log('Using token:', token); // Debug log
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

// Client Dashboard services
export const fetchSavedProviders = async () => {
    try { 
        const response = await axios.get(
            `${BACKEND_URL}/clients/dashboard/saved-providers`,
            getAuthHeaders() // Use the helper function
        );
        return response.data.savedProviders;
    } catch (error) {
        if (error.response?.status === 401) {
            console.error('Authentication token missing or invalid');
        }
        console.error('Error fetching saved providers:', error);
        throw error;
    }
};

export const fetchClientAppointments = async () => {
    try {
        const response = await axios.get(
            `${BACKEND_URL}/clients/dashboard/appointments`,
            getAuthHeaders()
        );
        return response.data.appointments || [];
    } catch (error) {
        if (error.response?.status === 401) {
            console.error('Authentication token missing or invalid');
        } else if (error.response?.status === 500) {
            console.error('Server error:', error.response.data);
        }
        console.error('Error fetching appointments:', error);
        // Return empty array instead of throwing
        return [];
    }
};

// Provider Dashboard services
export const fetchProviderClients = async () => {
    try {
        const response = await axios.get(
            `${BACKEND_URL}/providers/clients`,
            getAuthHeaders()
        );
        return response.data.clients;
    } catch (error) {
        if (error.response?.status === 401) {
            console.error('Authentication token missing or invalid');
        }
        console.error('Error fetching provider clients:', error);
        throw error;
    }
};

export const fetchProviderAppointments = async () => {
    try {
        const response = await axios.get(
            `${BACKEND_URL}/providers/appointments`,
            getAuthHeaders()
        );
        return response.data.appointments;
    } catch (error) {
        if (error.response?.status === 401) {
            console.error('Authentication token missing or invalid');
        }
        console.error('Error fetching appointments:', error);
        throw error;
    }
};

// Added missing availability functions
export const fetchProviderAvailability = async () => {
    try {
        const response = await axios.get(
            `${BACKEND_URL}/providers/availability`,
            getAuthHeaders()
        );
        return response.data.availability;
    } catch (error) {
        if (error.response?.status === 401) {
            console.error('Authentication token missing or invalid');
        }
        console.error('Error fetching provider availability:', error);
        throw error;
    }
};

export const updateProviderAvailability = async (availabilityData) => {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/providers/availability`,
            availabilityData,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            console.error('Authentication token missing or invalid');
        }
        console.error('Error updating provider availability:', error);
        throw error;
    }
};

// Add function to save a provider for clients
export const saveProvider = async (providerId) => {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/clients/save-provider`,
            { providerId },
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        if (error.response?.status === 401) {
            console.error('Authentication token missing or invalid');
        }
        console.error('Error saving provider:', error);
        throw error;
    }
};
