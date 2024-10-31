import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const getAuthHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// Appointment Management
export const createAppointment = async (appointmentData) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/appointments`,
      {
        provider: appointmentData.providerId,
        datetime: appointmentData.datetime,
        duration: appointmentData.duration || 60,
        meetingType: appointmentData.meetingType,
        location: appointmentData.location,
        notes: appointmentData.notes,
      },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Error creating appointment:", error);
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
      getAuthHeader()
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
    const response = await axios.put(
      `${BACKEND_URL}/appointments/${appointmentId}`,
      { status },
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("Update appointment error:", error);
    throw error;
  }
};

export const cancelAppointment = async (appointmentId, reason, userType) => {
  try {
    console.log("Cancelling appointment:", { appointmentId, reason, userType });
    const response = await axios.post(
      `${BACKEND_URL}/appointments/${appointmentId}/cancel`,
      { reason },
      getAuthHeader()
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
