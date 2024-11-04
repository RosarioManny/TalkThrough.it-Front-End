import axios from 'axios';
import { getAuthHeaders } from '../utils/auth';
import { api } from './providerService';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

export const fetchSavedProviders = async () => {
    if (!localStorage.getItem('token')) {
        console.log('No token found, returning empty providers list');
        return [];
    }

    try {
        console.log('Fetching saved providers...');
        const response = await api.get('/saved-therapists');
        console.log('Raw saved providers response:', response.data);

        if (!response.data || (!response.data.savedProviders && !Array.isArray(response.data))) {
            console.warn('Unexpected response format:', response.data);
            return [];
        }

        const providers = response.data.savedProviders || response.data;
        console.log('Processed saved providers:', providers);
        
        return providers;
    } catch (error) {
        console.error('Error fetching saved providers:', error);
        return [];
    }
};

export const fetchProviderDetails = async (providerId) => {
    try {
        const response = await axios.get(
            `${BACKEND_URL}/providers/${providerId}/details`,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching provider details:', error);
        throw error;
    }
};

export const fetchClientAppointments = async () => {
    try {
        console.log('Fetching client appointments...');
        const response = await axios.get(
            `${BACKEND_URL}/clients/dashboard/appointments`,
            {
                ...getAuthHeaders(),
                headers: {
                    ...getAuthHeaders().headers,
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            }
        );
        console.log('Appointments response:', response.data);
        return response.data.appointments || [];
    } catch (error) {
        console.error('Error fetching client appointments:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
        throw error;
    }
};

// Provider Dashboard services
export const fetchProviderClients = async () => {
    try {
        // console.log('Fetching provider clients...'); // Debug log
        const response = await axios.get(
            `${BACKEND_URL}/providers/dashboard/clients`,
            getAuthHeaders()
        );
        // console.log('Clients response:', response.data); // Debug log
        return response.data.clients || [];
    } catch (error) {
        if (error.response?.status === 401) {
            // console.error('Authentication token missing or invalid');
        }
        console.error('Error fetching provider clients:', error);
        throw error;
    }
};

export const fetchProviderAppointments = async () => {
    try {
        console.log('Fetching provider appointments...'); // Debug log
        const response = await axios.get(
            `${BACKEND_URL}/providers/dashboard/appointments`,
            getAuthHeaders()
        );
        console.log('Appointments response:', response.data); // Debug log
        return response.data.appointments || [];
    } catch (error) {
        if (error.response?.status === 401) {
            console.error('Authentication token missing or invalid');
        }
        console.error('Error fetching appointments:', error);
        throw error;
    }
};

export const fetchProviderAvailability = async () => {
    try {
        // Get user ID from token
        const token = localStorage.getItem('token');
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken._id;

        const response = await axios.get(
            `${BACKEND_URL}/availability/provider/${userId}`,
            getAuthHeaders()
        );
        return response.data.availability || [];
    } catch (error) {
        console.error("Error fetching provider availability:", error);
        throw error;
    }
};

// Update availability
export const updateProviderAvailability = async (availabilityData) => {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/providers/dashboard/availability`,
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

// Sending Message
export const sendMessage = async () => {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/messages/`,
            getAuthHeaders()
        )
        return response.data
    } catch (error) {
        if (error.response?.status === 401) {
            console.error('Authentication token missing or invalid');
        }
        console.error('Error saving provider:', error);
        throw error; 
    }
}

//get my client
export const fetchClientProfile = async() => {
    try {
        const response = await axios.get(
            `${BACKEND_URL}/clients/profile`,getAuthHeaders()
        )
        console.log(response)
        return response.data.profile
    } catch (error) {
     console.log(error)   
    }
}

// edit client - Gabe
export const updateClient = async(formData) => {
    try {
      const res = await axios.put(`${BACKEND_URL}/clients/profile/`, formData, getAuthHeaders())
      console.log('Client registration response:', res.data);
      return res.data
    } catch (error) {
      console.error('Client Signup error:', error);
      throw error;
    }
}
