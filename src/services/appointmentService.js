import axios from "axios";
import { getAuthHeaders } from '../utils/auth';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Appointment Management
export const createAppointment = async (appointmentData) => {
  try {
    console.log("Creating appointment with data:", appointmentData); // Debug log

    const response = await axios.post(
      `${BACKEND_URL}/appointments`,
      appointmentData,
      getAuthHeaders()
    );

    console.log("Appointment creation response:", response.data); // Debug log
    return response.data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    console.error("Error response:", error.response?.data); // Add this to see server error
    throw error;
  }
};

export const getProviderAppointments = async (timeframe = 'upcoming') => {
  try {
      const response = await axios.get(
          `${BACKEND_URL}/appointments/provider`, {
              params: {
                  timeframe,
                  status: timeframe === 'upcoming' ? 'active' : 'all'
              },
              ...getAuthHeaders()
          }
      );
      return response.data.appointments;
  } catch (error) {
      console.error('Error fetching provider appointments:', error);
      throw error;
  }
};

export const getAppointments = async (userId, userType, filters = {}) => {
  try {
    const params = new URLSearchParams({
      page: filters.page?.toString() || "1",
      limit: filters.limit?.toString() || "10",
      timeframe: filters.timeframe || "all",
      status: filters.status || "all",
    });

    if (filters.startDate) {
      params.append("startDate", filters.startDate);
    }
    if (filters.endDate) {
      params.append("endDate", filters.endDate);
    }

    const response = await axios.get(
      `${BACKEND_URL}/appointments/provider?${params}`,
      getAuthHeaders()
    );

    return {
      appointments: response.data.appointments,
      pagination: response.data.pagination,
    };
  } catch (error) {
    console.error("Get appointments error:", error);
    throw error;
  }
};

export const updateAppointment = async (appointmentId, status) => {
  try {
      console.log('Updating appointment:', { appointmentId, status }); // Debug log
      const response = await axios.put(
          `${BACKEND_URL}/appointments/${appointmentId}`,
          { status },
          getAuthHeaders()
      );
      console.log('Update response:', response.data); // Debug log
      return response.data;
  } catch (error) {
      console.error('Update appointment error:', error.response?.data || error); // Enhanced error logging
      throw error;
  }
};

export const cancelAppointment = async (appointmentId, reason, userType) => {
  try {
    console.log("Cancelling appointment:", { appointmentId, reason, userType });
    const response = await axios.post(
      `${BACKEND_URL}/appointments/${appointmentId}/cancel`,
      { reason },
      getAuthHeaders()
    );
    console.log("Cancel response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Cancel appointment error details:", {
      error,
      response: error.response,
      data: error.response?.data,
    });
    throw (
      error.response?.data || {
        error: "Failed to cancel appointment",
      }
    );
  }
};

export const getAvailableTimeSlots = async (providerId, date) => {
  try {
    console.log("Frontend - Fetching available slots:", { providerId, date });

    const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" });
    console.log("Frontend - Calculated day of week:", dayOfWeek);

    const response = await axios.get(
      `${BACKEND_URL}/availability/provider/${providerId}/day/${dayOfWeek}`,
      {
        params: {
          date: date.toISOString(),
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Frontend - Raw API response:", response.data);

    const slots = response.data.timeSlots.map((slot) => ({
      ...slot,
      datetime: new Date(
        `${date.toISOString().split("T")[0]}T${slot.startTime}`
      ),
      availableMeetingTypes: slot.availableMeetingTypes,
    }));

    console.log("Frontend - Processed slots:", slots);
    return slots;
  } catch (error) {
    console.error("Frontend - Error fetching available time slots:", error);
    throw error;
  }
};
