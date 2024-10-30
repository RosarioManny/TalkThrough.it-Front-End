import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };
};

// Fetch providers with filters and pagination
export const fetchProviders = async (params = {}) => {
    try {
        const {
            page = 1,
            limit = 9,
            search = '',
            specialty = '',
            insurance = '',
            location = '',
            language = '',
            sessionType = '',
            gender = '',
        } = params;

        const queryParams = new URLSearchParams({
            page,
            limit,
            ...(search && { search }),
            ...(specialty && { specialty }),
            ...(insurance && { insurance }),
            ...(location && { location }),
            ...(language && { language }),
            ...(sessionType && { sessionType }),
            ...(gender && { gender }),
        });

        const response = await axios.get(
            `${BACKEND_URL}/providers?${queryParams}`,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching providers:', error);
        throw error;
    }
};

// Fetch single provider details
export const fetchProviderDetails = async (providerId) => {
    try {
        const response = await axios.get(
            `${BACKEND_URL}/providers/${providerId}`,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching provider details:', error);
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
        console.error('Error saving provider:', error);
        throw error;
    }
};

// Get provider availability
export const getProviderAvailability = async (providerId, date) => {
    try {
        const response = await axios.get(
            `${BACKEND_URL}/providers/${providerId}/availability`,
            {
                params: { date },
                ...getAuthHeaders()
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching provider availability:', error);
        throw error;
    }
};

// Get provider reviews
export const getProviderReviews = async (providerId) => {
    try {
        const response = await axios.get(
            `${BACKEND_URL}/providers/${providerId}/reviews`,
            getAuthHeaders()
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching provider reviews:', error);
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