import React, { useState, useEffect } from "react";
import { theme } from "../../styles/theme";
import { toast } from "react-toastify";
import {
  getAppointments,
  updateAppointment,
  cancelAppointment,
} from "../../services/appointmentService";
import { ClientQuickView } from "./ClientQuickView";
import { CancellationModal } from "./CancellationModal";

const generateMeetingLink = (appointment) => {
  return {
    id: appointment._id,
    password: "123456", // In real implementation, this would be generated
    url: `https://zoom.us/j/${appointment._id}`,
  };
};

const handleCopyLink = (link) => {
  navigator.clipboard
    .writeText(link)
    .then(() => toast.success("Meeting link copied to clipboard!"))
    .catch(() => toast.error("Failed to copy link"));
};

export const AppointmentList = ({ userType = "provider", onUpdate }) => {
  const [appointments, setAppointments] = useState([]);
  const [currentView, setCurrentView] = useState("upcoming");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    pages: 1,
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [selectedClient, setSelectedClient] = useState(null);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  const [filters, setFilters] = useState({
    timeframe: "upcoming",
    status: "all",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 10,
  });

  const filteredAppointments = appointments.filter((appointment) => {
    if (currentView === "upcoming") {
      return !["rejected", "cancelled"].includes(appointment.status);
    }
    return true;
  });

  const isAppointmentPast = (appointment) => {
    // Get current time
    const now = new Date();

    // Get appointment time
    const appointmentTime = new Date(appointment.datetime);

    // Calculate end time by adding duration
    const appointmentEndTime = new Date(
      appointmentTime.getTime() + (appointment.duration || 60) * 60000
    );

    // Debug logs with more readable format
    console.log({
      appointmentId: appointment._id,
      appointmentStart: appointmentTime.toLocaleString(),
      appointmentEnd: appointmentEndTime.toLocaleString(),
      currentTime: now.toLocaleString(),
      isPast: now > appointmentEndTime,
      status: appointment.status,
    });

    // Return true if current time is past the appointment end time
    return now > appointmentEndTime;
  };

  useEffect(() => {
    loadAppointments();
  }, [filters]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await getAppointments(null, userType, filters);
      setAppointments(data.appointments || []);
      setPagination(data.pagination || { total: 0, page: 1, pages: 1 });
    } catch (err) {
      console.error("Load appointments error:", err);
      const errorMessage =
        err.response?.data?.message || "Failed to load appointments";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await updateAppointment(appointmentId, newStatus);
      await loadAppointments(); // Add this line to refresh the list
      toast.success(`Appointment ${newStatus} successfully`);
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast.error("Failed to update appointment status");
    }
  };

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancellationModal(true);
  };

  const handleCancelConfirm = async (reason) => {
    try {
      await cancelAppointment(selectedAppointment._id, reason, userType);
      toast.success("Appointment cancelled successfully");
      loadAppointments();
      setShowCancellationModal(false);
    } catch (err) {
      console.error("Cancel error in component:", err);
      toast.error(err.error || "Failed to cancel appointment");
      setShowCancellationModal(false);
    }
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleClientClick = (client) => {
    setSelectedClient({
      ...client,
      appointments: appointments.filter(
        (apt) => apt.client?._id === client._id
      ),
    });
    setIsClientModalOpen(true);
  };

  const handleClearFilters = () => {
    setFilters({
      timeframe: "upcoming",
      status: "all",
      startDate: "",
      endDate: "",
      page: 1,
      limit: 10,
    });
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= pagination.pages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded ${
            pagination.page === i
              ? "bg-celestial_blue-500 text-white"
              : "bg-alice_blue-100 text-prussian_blue hover:bg-alice_blue-200"
          }`}
        >
          {i}
        </button>
      );
    }
    return (
      <div className="flex items-center justify-center gap-2 mt-6">
        <button
          onClick={() => handlePageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
          className="px-3 py-1 rounded bg-alice_blue-100 text-prussian_blue hover:bg-alice_blue-200 disabled:opacity-50"
        >
          Previous
        </button>
        {pages}
        <button
          onClick={() => handlePageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.pages}
          className="px-3 py-1 rounded bg-alice_blue-100 text-prussian_blue hover:bg-alice_blue-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    );
  };

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-xl border border-alice_blue-200 p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-celestial_blue-500" />
            <p className="mt-4 text-prussian_blue-400">Loading appointments...</p>
        </div>
    );
}

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {/* Filters Section */}
        <div className="bg-white rounded-xl border border-alice_blue-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-prussian_blue-500">
              Filters
            </h3>
            {(filters.timeframe !== "upcoming" ||
              filters.status !== "all" ||
              filters.startDate ||
              filters.endDate) && (
              <button
                onClick={handleClearFilters}
                className="flex items-center gap-2 text-sm text-celestial_blue-500 hover:-translate-y-0.5 transition-all duration-300"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Clear Filters
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-prussian_blue-400">
                Time Frame
              </label>
              <select
                value={filters.timeframe}
                onChange={(e) =>
                  handleFilterChange("timeframe", e.target.value)
                }
                className="w-full rounded-lg border border-alice_blue-200 px-3 py-2 text-prussian_blue-500 bg-white hover:border-celestial_blue-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-celestial_blue-500"
              >
                <option value="all">All Time</option>
                <option value="upcoming">Upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-prussian_blue-400">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full rounded-lg border border-alice_blue-200 px-3 py-2 text-prussian_blue-500 bg-white hover:border-celestial_blue-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-celestial_blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-prussian_blue-400">
                Start Date
              </label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) =>
                  handleFilterChange("startDate", e.target.value)
                }
                className="w-full rounded-lg border border-alice_blue-200 px-3 py-2 text-prussian_blue-500 bg-white hover:border-celestial_blue-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-celestial_blue-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-prussian_blue-400">
                End Date
              </label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                className="w-full rounded-lg border border-alice_blue-200 px-3 py-2 text-alice_blue-300 bg-white hover:border-celestial_blue-300 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-celestial_blue-500"
              />
            </div>
          </div>
        </div>

        {(filters.timeframe !== "upcoming" ||
          filters.status !== "all" ||
          filters.startDate ||
          filters.endDate) && (
          <div className="flex justify-end">
            <button
              onClick={handleClearFilters}
              className="text-sm text-prussian_blue hover:text-alice_blue-300 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {error && (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
        <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-100">
                <svg 
                    className="w-5 h-5 text-red-500" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                </svg>
            </div>
            <p className="text-red-700">{error}</p>
        </div>
    </div>
)}

      <div className="flex gap-3 mb-6 bg-white p-2 rounded-lg border border-alice_blue-200">
        <button
          onClick={() => setCurrentView("upcoming")}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
            ${
              currentView === "upcoming"
                ? "bg-celestial_blue-500 text-white shadow-md transform -translate-y-0.5"
                : "bg-alice_blue-50 text-prussian_blue-400 hover:bg-alice_blue-100 hover:-translate-y-0.5 hover:shadow-sm"
            }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Upcoming
          </div>
        </button>
        <button
          onClick={() => setCurrentView("all")}
          className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300
            ${
              currentView === "all"
                ? "bg-celestial_blue-500 text-white shadow-md transform -translate-y-0.5"
                : "bg-alice_blue-50 text-prussian_blue-400 hover:bg-alice_blue-100 hover:-translate-y-0.5 hover:shadow-sm"
            }`}
        >
          <div className="flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            All Appointments
          </div>
        </button>
      </div>

      {/* Appointment Cards */}
      <div className="space-y-4">
      {filteredAppointments.length === 0 ? (
    <div className="bg-white rounded-xl border border-alice_blue-200 p-8">
        <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-alice_blue-50 flex items-center justify-center">
                <svg
                    className="w-8 h-8 text-celestial_blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                </svg>
            </div>
            <h3 className="text-lg font-semibold text-prussian_blue-500 mb-2">
                No appointments found
            </h3>
            <p className="text-sm text-prussian_blue-300">
                Try adjusting your filters or selecting a different view
            </p>
            <button
                onClick={handleClearFilters}
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-celestial_blue-50 text-celestial_blue-500 rounded-lg hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
            >
                <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                </svg>
                Clear Filters
            </button>
        </div>
    </div>
) : (
          filteredAppointments.map((appointment) => (
            <div
              key={appointment._id}
              className="bg-white rounded-xl border border-alice_blue-200 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Header Section */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-celestial_blue-100 flex items-center justify-center">
                    <span className="text-celestial_blue-500 font-medium">
                      {userType === "client"
                        ? `${appointment.provider?.firstName[0]}${appointment.provider?.lastName[0]}`
                        : `${appointment.client?.firstName[0]}${appointment.client?.lastName[0]}`}
                    </span>
                  </div>
                  <div>
                    <p
                      onClick={() =>
                        appointment.client &&
                        handleClientClick(appointment.client)
                      }
                      className="text-lg font-semibold text-prussian_blue-500 hover:text-celestial_blue-500 cursor-pointer transition-colors"
                    >
                      {userType === "client"
                        ? appointment.provider
                          ? `Dr. ${appointment.provider.firstName} ${appointment.provider.lastName}`
                          : "Provider Not Found"
                        : appointment.client
                        ? `${appointment.client.firstName} ${appointment.client.lastName}`
                        : "Client Not Found"}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <svg
                        className="w-4 h-4 text-celestial_blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-sm text-prussian_blue-400">
                        {new Date(appointment.datetime).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium
              ${
                appointment.status === "confirmed"
                  ? "bg-celadon-100 text-celadon-700"
                  : appointment.status === "pending"
                  ? "bg-sunglow-100 text-sunglow-700"
                  : appointment.status === "cancelled"
                  ? "bg-red-100 text-red-700"
                  : "bg-celestial_blue-100 text-celestial_blue-700"
              }`}
                  >
                    {appointment.status === "confirmed" && (
                      <svg
                        className="w-4 h-4 mr-1 inline"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                    {appointment.status}
                  </span>
                  {appointment.meetingType && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-alice_blue-100 text-alice_blue-700">
                      {appointment.meetingType}
                    </span>
                  )}
                </div>
              </div>

              {/* Additional Info */}
              {appointment.location && (
                <div className="flex items-center gap-2 mt-4 text-sm text-prussian_blue-400">
                  <svg
                    className="w-4 h-4 text-celestial_blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {appointment.location}
                </div>
              )}

              {appointment.notes && (
                <div className="flex items-start gap-2 mt-4 text-sm text-prussian_blue-400">
                  <svg
                    className="w-4 h-4 text-celestial_blue-500 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>{appointment.notes}</span>
                </div>
              )}

              {/* Video Meeting Section */}
              {appointment.meetingType === "video" &&
                appointment.status === "confirmed" && (
                  <div className="mt-6 pt-6 border-t border-alice_blue-200">
                    <div className="bg-alice_blue-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <svg
                          className="w-5 h-5 text-celestial_blue-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="font-medium text-prussian_blue-500">
                          Meeting Details
                        </span>
                      </div>

                      {/* Meeting Info */}
                      {(() => {
                        const meetingInfo = generateMeetingLink(appointment);
                        const appointmentTime = new Date(appointment.datetime);
                        const now = new Date();
                        const hoursUntilAppointment =
                          (appointmentTime - now) / (1000 * 60 * 60);

                        return (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-white rounded-lg p-3">
                                <span className="text-sm text-prussian_blue-400">
                                  Meeting ID
                                </span>
                                <p className="font-medium text-prussian_blue-600">
                                  {meetingInfo.id}
                                </p>
                              </div>
                              <div className="bg-white rounded-lg p-3">
                                <span className="text-sm text-prussian_blue-400">
                                  Password
                                </span>
                                <p className="font-medium text-prussian_blue-600">
                                  {meetingInfo.password}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              {hoursUntilAppointment > -1 &&
                                hoursUntilAppointment < 0.25 && (
                                  <a
                                    href={meetingInfo.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-celestial_blue-500 text-white rounded-lg hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
                                  >
                                    Join Now
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                      stroke="currentColor"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                      />
                                    </svg>
                                  </a>
                                )}
                              <button
                                onClick={() => handleCopyLink(meetingInfo.url)}
                                className="flex items-center gap-2 px-4 py-2 border border-celestial_blue-500 text-celestial_blue-500 rounded-lg hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
                              >
                                Copy Link
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                  />
                                </svg>
                              </button>
                            </div>

                            {hoursUntilAppointment > 0.25 && (
                              <p className="text-sm text-prussian_blue-400">
                                Join button will be available 15 minutes before
                                the appointment
                              </p>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}

              {/* Action Buttons */}
              {!isAppointmentPast(appointment) &&
                appointment.status !== "cancelled" &&
                filters.timeframe !== "past" && (
                  <div className="flex justify-end gap-3 mt-6">
                    {userType === "provider" &&
                      appointment.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleStatusUpdate(appointment._id, "confirmed")
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-celestial_blue-500 text-white rounded-lg hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Confirm
                          </button>
                          <button
                            onClick={() =>
                              handleStatusUpdate(appointment._id, "rejected")
                            }
                            className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            Reject
                          </button>
                        </>
                      )}
                    {appointment.status === "confirmed" && (
                      <button
                        onClick={() => handleCancelClick(appointment)}
                        className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        Cancel
                      </button>
                    )}
                  </div>
                )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {appointments.length > 0 && (
    <div className="mt-8">
        <div className="bg-white rounded-xl border border-alice_blue-200 p-4">
            <div className="flex items-center justify-between">
                <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 
                        ${pagination.page === 1
                            ? "bg-alice_blue-50 text-prussian_blue-300 cursor-not-allowed"
                            : "bg-alice_blue-50 text-prussian_blue-500 hover:bg-alice_blue-100 hover:-translate-y-0.5 hover:shadow-sm"
                        }`}
                >
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                    Previous
                </button>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-prussian_blue-400">
                        Page {pagination.page} of {pagination.pages}
                    </span>
                </div>

                <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.pages}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 
                        ${pagination.page === pagination.pages
                            ? "bg-alice_blue-50 text-prussian_blue-300 cursor-not-allowed"
                            : "bg-alice_blue-50 text-prussian_blue-500 hover:bg-alice_blue-100 hover:-translate-y-0.5 hover:shadow-sm"
                        }`}
                >
                    Next
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            </div>
        </div>
    </div>
)}

      {/* Client Quick View Modal */}
      {selectedClient && (
        <ClientQuickView
          client={selectedClient}
          isOpen={isClientModalOpen}
          onClose={() => setIsClientModalOpen(false)}
        />
      )}

      {/* Cancellation Modal */}
      <CancellationModal
        isOpen={showCancellationModal}
        onClose={() => {
          setShowCancellationModal(false);
          setSelectedAppointment(null);
        }}
        onConfirm={handleCancelConfirm}
        appointment={selectedAppointment}
      />
    </div>
  );
};
