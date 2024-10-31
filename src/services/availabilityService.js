import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const getAuthHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    'Content-Type': 'application/json'
  },
});


export const getProviderAvailability = async (providerId) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/availability/provider/${providerId}`,
      getAuthHeaders()
    );
    return response.data.availability;
  } catch (error) {
    console.error("getProviderAvailability - Error:", error);
    throw error;
  }
};

export const updateProviderAvailability = async (providerId, availabilityData) => {
  if (!providerId) {
    throw new Error("Provider ID is required");
  }

  try {
    const response = await axios.put(
      `${BACKEND_URL}/availability/update`,
      { availabilityData },
      getAuthHeaders()
    );
    return response.data.availability;
  } catch (error) {
    console.error("updateProviderAvailability - Error:", error);
    throw error;
  }
};

export const getDayAvailability = async (providerId, dayOfWeek) => {
  try {
    console.log("Getting day availability:", { providerId, dayOfWeek });
    const response = await axios.get(
      `${BACKEND_URL}/availability/provider/${providerId}/day/${dayOfWeek}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching day availability:", error);
    throw error;
  }
};

export const getProviderPublicAvailability = async (providerId) => {
  try {
      console.log("Requesting availability for provider:", providerId);
      
      const response = await axios.get(
          `${BACKEND_URL}/availability/provider/${providerId}/public`
      );
      
      console.log("Received availability data:", {
          provider: `${response.data.provider.firstName} ${response.data.provider.lastName}`,
          availabilityCount: response.data.availability.length,
          availability: response.data.availability
      });

      return response.data;
  } catch (error) {
      console.error("Error in getProviderPublicAvailability:", error);
      throw error;
  }
};
