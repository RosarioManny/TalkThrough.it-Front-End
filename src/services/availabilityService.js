import axios from "axios";
import { getAuthHeaders } from '../utils/auth';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

// Create axios instance with default config
const api = axios.create({
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

// Get provider's availability
export const getProviderAvailability = async (providerId) => {
    try {
        console.log('Fetching availability for provider:', providerId);
        const response = await api.get(`/availability/provider/${providerId}`);
        console.log('Availability response:', response.data);
        return response.data.availability || [];
    } catch (error) {
        console.error("getProviderAvailability - Error:", {
            message: error.message,
            response: error.response?.data
        });
        return [];
    }
};

// Update provider's availability (protected route)
export const updateProviderAvailability = async (availabilityData) => {
    try {
        console.log('Updating availability:', availabilityData);
        const response = await api.put(
            '/availability/update',
            availabilityData
        );
        console.log('Update response:', response.data);
        return response.data.availability;
    } catch (error) {
        console.error("updateProviderAvailability - Error:", {
            message: error.message,
            response: error.response?.data
        });
        throw error;
    }
};

// Get availability for specific day
export const getDayAvailability = async (providerId, dayOfWeek) => {
    try {
        console.log("Getting day availability:", { providerId, dayOfWeek });
        const response = await api.get(
            `/availability/provider/${providerId}/day/${dayOfWeek}`
        );
        console.log('Day availability response:', response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching day availability:", {
            message: error.message,
            response: error.response?.data
        });
        return { availability: [] };
    }
};

// Get public availability view
export const getProviderPublicAvailability = async (providerId) => {
    try {
        console.log("Requesting public availability for provider:", providerId);
        
        const response = await api.get(
            `/availability/provider/${providerId}/public`
        );
        
        console.log("Received public availability data:", {
            providerId,
            availabilityCount: response.data.availability?.length || 0,
            data: response.data
        });

        return response.data;
    } catch (error) {
        console.error("Error in getProviderPublicAvailability:", {
            message: error.message,
            response: error.response?.data
        });
        return { availability: [] };
    }
};

// Get formatted availability for booking
export const getBookingAvailability = async (providerId, startDate, endDate) => {
    try {
        console.log("Fetching booking availability:", { providerId, startDate, endDate });
        
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);

        const response = await api.get(
            `/availability/provider/${providerId}/booking${params.toString() ? `?${params}` : ''}`
        );

        console.log("Booking availability response:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching booking availability:", {
            message: error.message,
            response: error.response?.data
        });
        return { availability: [] };
    }
};

// Validate availability data
export const validateAvailabilityData = (data) => {
    // Validate the structure of availability data
    if (!Array.isArray(data)) {
        throw new Error('Availability data must be an array');
    }

    return data.every(slot => {
        return (
            slot.dayOfWeek && 
            Array.isArray(slot.timeSlots) &&
            slot.timeSlots.every(timeSlot => 
                timeSlot.startTime && 
                timeSlot.endTime && 
                Array.isArray(timeSlot.availableMeetingTypes)
            )
        );
    });
};

// Format availability for display
export const formatAvailabilityForDisplay = (availability) => {
    if (!Array.isArray(availability)) return [];

    return availability.map(slot => ({
        dayOfWeek: slot.dayOfWeek,
        isAvailable: slot.isAvailable,
        timeSlots: slot.timeSlots.map(time => ({
            startTime: new Date(time.startTime).toLocaleTimeString(),
            endTime: new Date(time.endTime).toLocaleTimeString(),
            isBooked: time.isBooked,
            meetingTypes: time.availableMeetingTypes
        }))
    }));
};

// Helper function to check if a time slot is available
export const isTimeSlotAvailable = (slot) => {
    return slot && 
           !slot.isBooked && 
           slot.availableMeetingTypes && 
           slot.availableMeetingTypes.length > 0;
};

export default {
    getProviderAvailability,
    updateProviderAvailability,
    getDayAvailability,
    getProviderPublicAvailability,
    getBookingAvailability,
    validateAvailabilityData,
    formatAvailabilityForDisplay,
    isTimeSlotAvailable
};
