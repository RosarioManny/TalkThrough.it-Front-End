import axios from "axios";
import { getAuthHeaders } from '../utils/auth';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
axios.defaults.headers.common['Content-Type'] = 'application/json';

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
          `${BACKEND_URL}/providers?${queryParams.toString()}`  // Changed to /providers
      );

      const response = await axios.get(
          `${BACKEND_URL}/providers?${queryParams.toString()}`  // Changed to match your route
      );

      console.log('Raw API response:', response.data);

      // Ensure we're always returning an array
      const providers = Array.isArray(response.data) ? response.data : [];

      console.log('Processed providers:', providers);

      return providers; // Return the array directly
  } catch (error) {
      console.error("Error fetching providers:", error);
      throw error;
  }
};



// Protected endpoint for provider's own data
export const fetchProviderDetails = async (providerId) => {
    try {
        const response = await axios.get(
            `${BACKEND_URL}/providers/${providerId}`,
            getAuthHeaders() 
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching provider details:", error);
        throw error;
    }
};

// Save provider (for clients)
export const saveProvider = async (providerId) => {
    try {
        const response = await axios.post(
            `${BACKEND_URL}/clients/save-provider`,
            { providerId },
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error saving provider:", error);
        throw error;
    }
};

//remove provider from favorites for clients
export const removeSavedProvider = async (providerId) => {
    try {
        const response = await axios.put(
            `${BACKEND_URL}/clients/save-provider`,
            { providerId },
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error('Error saving provider:', error);
        throw error;
    }
};

// Get provider availability
export const getProviderAvailability = async (providerId, date) => {
    try {
        const params = new URLSearchParams();
        if (date) params.append('date', date);

        const response = await axios.get(
            `${BACKEND_URL}/providers/${providerId}/availability${params.toString() ? `?${params.toString()}` : ''}`,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching provider availability:", error);
        throw error;
    }
};


// Public endpoint for provider details (no auth required)
export const fetchProviderPublicDetails = async (providerId) => {
    try {
        console.log("Fetching public provider details for:", providerId);
        const response = await axios.get(
            `${BACKEND_URL}/providers/${providerId}/public`
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching provider public details:", error);
        throw error;
    }
};

//update provider profile
export const updateProvider = async(formData,userid) => {
    try {
      const res = await axios.put(`${BACKEND_URL}/providers/${userid}`, formData, getAuthHeaders())
      console.log('Provider registration response:', res.data);
      return res.data
    } catch (error) {
      console.error('Provider Signup error:', error);
      throw error;
    }
  }