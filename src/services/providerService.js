import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// Fetch providers with filters and pagination
export const fetchProviders = async (params = {}) => {
  try {
      const {
          page = 1,
          limit = 9,
          search = "",
          specialty = "",
          insurance = "",
          location = "",
          languages = "",
          sessionType = "",
      } = params;

      const queryParams = new URLSearchParams();
      
      if (page) queryParams.append('page', page);
      if (limit) queryParams.append('limit', limit);
      if (search) queryParams.append('search', search);
      if (specialty) queryParams.append('specialty', specialty);
      if (insurance) queryParams.append('insurance', insurance);
      if (location) queryParams.append('location', location);
      if (languages) queryParams.append('languages', languages);
      if (sessionType) queryParams.append('sessionType', sessionType);

      console.log('Query params being sent:', queryParams.toString()); // Debug log

      const response = await axios.get(
          `${BACKEND_URL}/providers?${queryParams}`,
          getAuthHeaders()
      );
      return response.data;
  } catch (error) {
      console.error("Error fetching providers:", error);
      throw error;
  }
};



// Protected endpoint remains the same for provider's own data
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

// Get provider availability
export const getProviderAvailability = async (providerId, date) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/providers/${providerId}/availability`,
      {
        params: { date },
        ...getAuthHeaders(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching provider availability:", error);
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
    console.error("Error fetching provider reviews:", error);
    throw error;
  }
};

// Public endpoint for provider details (no auth required)
export const fetchProviderPublicDetails = async (providerId) => {
  try {
    console.log("Fetching public provider details for:", providerId);
    const response = await axios.get(
      `${BACKEND_URL}/providers/public/${providerId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching provider public details:", error);
    throw error;
  }
};