import axios from "axios";
import { getAuthHeaders } from '../utils/auth';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.withCredentials = true;

// Create axios instance with default config
export const api = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use(
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

// Fetch providers
export const fetchProviders = async (params = {}) => {
    try {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value) {
                queryParams.append(key, value);
            }
        });

        console.log('Fetching providers with URL:', 
            `${BACKEND_URL}/providers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
        );

        const response = await api.get(`/providers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`);
        console.log('Raw API response:', response.data);

        return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
        console.error("Error fetching providers:", {
            message: error.message,
            response: error.response?.data
        });
        return [];
    }
};

// Protected endpoint for provider's own data
export const fetchProviderDetails = async (providerId) => {
    try {
        console.log('Fetching provider details:', providerId);
        const response = await api.get(`/providers/${providerId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching provider details:", {
            message: error.message,
            response: error.response?.data
        });
        throw error;
    }
};

// Save provider (for clients)
export const saveProvider = async (providerId) => {
    try {
        console.log('Saving provider:', providerId);
        const response = await api.post('/saved-therapists', { providerId });
        console.log('Save provider response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error saving provider:', {
            message: error.message,
            response: error.response?.data
        });
        throw error;
    }
};

// Remove saved provider
export const removeSavedProvider = async (savedId) => {
    try {
        console.log('Removing saved provider:', savedId);
        const response = await api.delete(`/saved-therapists/${savedId}`);
        console.log('Remove provider response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error removing saved provider:', {
            message: error.message,
            response: error.response?.data
        });
        throw error;
    }
};

// Check if provider is saved
export const isProviderSaved = async (providerId) => {
    try {
        const response = await api.get('/saved-therapists');
        const savedProviders = response.data.savedProviders || [];
        return savedProviders.some(sp => 
            sp.providerId?._id === providerId || 
            sp.provider?.id === providerId
        );
    } catch (error) {
        console.error('Error checking if provider is saved:', {
            message: error.message,
            response: error.response?.data
        });
        return false;
    }
};

// Update saved provider
export const updateSavedProvider = async (savedId, updateData) => {
    try {
        console.log('Updating saved provider:', { savedId, updateData });
        const response = await api.put(`/saved-therapists/${savedId}`, updateData);
        console.log('Update provider response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating saved provider:', {
            message: error.message,
            response: error.response?.data
        });
        throw error;
    }
};

// Public endpoint for provider details (no auth required)
export const fetchProviderPublicDetails = async (providerId) => {
    try {
        console.log("Fetching public provider details for:", providerId);
        const response = await api.get(`/providers/${providerId}/public`);
        return response.data;
    } catch (error) {
        console.error("Error fetching provider public details:", {
            message: error.message,
            response: error.response?.data
        });
        throw error;
    }
};

// Update provider profile
export const updateProvider = async (formData, userid) => {
    try {
        console.log('Updating provider profile:', userid);
        const response = await api.put(`/providers/${userid}`, formData);
        console.log('Provider update response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Provider update error:', {
            message: error.message,
            response: error.response?.data
        });
        throw error;
    }
};
