import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { theme } from "../../styles/theme";
import axios from "axios";
import {
  fetchProviderClients,
  fetchProviderAppointments,
  fetchProviderAvailability,
} from "../../services/dashboardService";
import { AppointmentList } from "../Appointments/AppointmentList";
import { ProviderAvailability } from "../Availability/ProviderAvailability";
export const ProviderDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showAvailabilityReminder, setShowAvailabilityReminder] =
    useState(false);

  const getConversations = async () => {
    return[];
    // try {
    //   const getAuthHeaders = () => ({
    //     headers: {
    //       Authorization: `Bearer ${localStorage.getItem("token")}`,
    //       "Content-Type": "application/json",
    //     },
    //   });
    //   const response = await axios.get(
    //     `${BACKEND_URL}/messages/conversations`,
    //     getAuthHeaders() // Add auth headers
    //   );
    //   return response.data;
    // } catch (error) {
    //   console.error("Error fetching conversations:", error);
    //   throw error;
    // }
  };

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          clientsData,
          appointmentsData,
          availabilityData,
          conversationsData,
        ] = await Promise.allSettled([
          fetchProviderClients(),
          fetchProviderAppointments(),
          fetchProviderAvailability(),
          getConversations(),
        ]);

        if (clientsData.status === "fulfilled") {
          setClients(clientsData.value || []);
        } else {
          setError((prev) => ({ ...prev, clients: "Failed to load clients" }));
        }

        if (appointmentsData.status === "fulfilled") {
          setAppointments(appointmentsData.value || []);
        } else {
          setError((prev) => ({
            ...prev,
            appointments: "Failed to load appointments",
          }));
        }

        if (availabilityData.status === "fulfilled") {
          setAvailability(availabilityData.value || []);
          setShowAvailabilityReminder(
            availabilityData.value || availabilityData.value.length === 0
          );
        } else {
          setError((prev) => ({
            ...prev,
            availability: "Failed to load availability",
          }));
        }

        if (conversationsData.status === "fulfilled") {
          setConversations(conversationsData.value || []);
        } else {
          setError((prev) => ({
            ...prev,
            messages: "Failed to load messages",
          }));
        }
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
        setError({ general: "Failed to load dashboard data" });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, navigate]);

  const handleAvailabilityUpdate = async () => {
    try {
      await fetchDashboardData();
      setSuccessMessage("Availability updated successfully");
    } catch (err) {
      setError((prev) => ({
        ...prev,
        availability: "Failed to update availability",
      }));
    }
  };
  const handleAppointmentUpdate = async () => {
    try {
        setLoading(true);
        const data = await fetchProviderAppointments();
        // Filter out rejected and cancelled appointments for upcoming view
        const filteredAppointments = data.filter(apt => 
            !['rejected', 'cancelled'].includes(apt.status)
        );
        setAppointments(filteredAppointments);
        setSuccessMessage("Appointments updated successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
        setError(prev => ({
            ...prev,
            appointments: "Failed to update appointments"
        }));
    } finally {
        setLoading(false);
    }
};


  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Date not available";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-alice_blue-500">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-celestial_blue-500"></div>
      </div>
    );
  }
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Current Clients Card */}
              <div className="bg-white rounded-xl border border-alice_blue-200 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-prussian_blue-500">
                      My Clients
                    </h2>
                    <div className="p-2 rounded-lg bg-alice_blue-50">
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
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                  </div>

                  {error?.clients ? (
                    <div className="p-4 rounded-lg bg-sunglow-50 border border-sunglow-200">
                      <p className="text-sm text-sunglow-700">
                        {error.clients}
                      </p>
                    </div>
                  ) : clients.length > 0 ? (
                    <div className="space-y-3">
                      {clients.map((client) => (
                        <div
                          key={client._id}
                          className="p-4 rounded-lg bg-alice_blue-50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-celestial_blue-100 flex items-center justify-center">
                              <span className="text-celestial_blue-500 font-medium">
                                {client.firstName[0]}
                                {client.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-prussian_blue-500">
                                {client.firstName} {client.lastName}
                              </div>
                              <div className="text-sm text-prussian_blue-300">
                                {client.email}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
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
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                      </div>
                      <p className="text-prussian_blue-400 mb-2">
                        No clients yet
                      </p>
                      <p className="text-sm text-prussian_blue-300">
                        Your client list will appear here once you start
                        accepting appointments.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Stats Card */}
              <div className="bg-white rounded-xl border border-alice_blue-200 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-prussian_blue-500">
                    Quick Stats
                  </h2>
                  <div className="p-2 rounded-lg bg-alice_blue-50">
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-alice_blue-50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-celestial_blue-100">
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
                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-prussian_blue-400">
                        Total Clients
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-celestial_blue-500">
                      {clients.length}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-alice_blue-50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-celestial_blue-100">
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
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-prussian_blue-400">
                        Upcoming
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-celestial_blue-500">
                      {
                        appointments.filter(
                          (apt) => new Date(apt.datetime) > new Date()
                        ).length
                      }
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity Card */}
              <div className="bg-white rounded-xl border border-alice_blue-200 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-prussian_blue-500">
                    Recent Activity
                  </h2>
                  <div className="p-2 rounded-lg bg-alice_blue-50">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>

                {appointments.length > 0 ? (
                  <div className="space-y-4">
                    {appointments.slice(0, 5).map((appointment) => (
                      <div
                        key={appointment._id}
                        className="p-4 rounded-lg bg-alice_blue-50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-celestial_blue-100 flex items-center justify-center">
                              {" "}
                              {/* Ensuring exact same classes */}
                              <span className="text-celestial_blue-500 font-medium">
                                {appointment.client?.firstName?.[0]}
                                {appointment.client?.lastName?.[0]}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-prussian_blue-500">
                                {appointment.client?.firstName}{" "}
                                {appointment.client?.lastName}
                              </div>
                              <div className="text-sm text-prussian_blue-300">
                                {formatDate(appointment.datetime)}
                              </div>
                            </div>
                          </div>
                          <span
                            className={`
        px-3 py-1 rounded-full text-sm font-medium
        ${
          appointment.status === "confirmed"
            ? "bg-celadon-100 text-celadon-700"
            : appointment.status === "pending"
            ? "bg-sunglow-100 text-sunglow-700"
            : "bg-celestial_blue-100 text-celestial_blue-700"
        }
      `}
                          >
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
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
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-prussian_blue-400 mb-2">
                      No recent activity
                    </p>
                    <p className="text-sm text-prussian_blue-300">
                      Your recent appointments will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Messages Section */}
            <div className="bg-white rounded-xl border border-alice_blue-200 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-prussian_blue-500">
                  Recent Messages
                </h2>
                <div className="p-2 rounded-lg bg-alice_blue-50">
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
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
              </div>

              {error?.messages ? (
                <div className="p-4 rounded-lg bg-sunglow-50 border border-sunglow-200">
                  <p className="text-sm text-sunglow-700">{error.messages}</p>
                </div>
              ) : conversations?.length > 0 ? (
                <div className="space-y-4">
                  {conversations.slice(0, 5).map((conversation) => (
                    <div
                      key={conversation._id}
                      onClick={() => navigate(`/messages/${conversation._id}`)}
                      className="p-4 rounded-lg bg-alice_blue-50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-celestial_blue-100 flex items-center justify-center">
                            <span className="text-celestial_blue-500 font-medium">
                              {conversation.client?.firstName?.[0]}
                              {conversation.client?.lastName?.[0]}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-prussian_blue-500">
                              {conversation.client?.firstName}{" "}
                              {conversation.client?.lastName}
                            </div>
                            <p className="text-sm text-prussian_blue-300 truncate max-w-[200px]">
                              {conversation.lastMessage || "No messages"}
                            </p>
                          </div>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <span className="ml-3 px-2.5 py-0.5 rounded-full text-sm font-medium bg-celestial_blue-100 text-celestial_blue-700">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
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
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                  <p className="text-prussian_blue-400 mb-2">No messages yet</p>
                  <p className="text-sm text-prussian_blue-300">
                    Messages from your clients will appear here
                  </p>
                </div>
              )}
            </div>

            {/* Availability Summary */}
            <div className="bg-white rounded-xl border border-alice_blue-200 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-prussian_blue-500">
                    Availability Overview
                  </h2>
                  <div className="p-2 rounded-lg bg-alice_blue-50">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab("availability")}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-celestial_blue-500 bg-celestial_blue-50 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Manage Availability
                </button>
              </div>

              {error?.availability ? (
                <div className="p-4 rounded-lg bg-sunglow-50 border border-sunglow-200">
                  <p className="text-sm text-sunglow-700">
                    {error.availability}
                  </p>
                </div>
              ) : availability?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {availability.map((slot) => (
                    <div
                      key={slot._id}
                      className="p-4 bg-alice_blue-50 rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex items-center gap-2 mb-2">
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
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <div className="font-medium text-prussian_blue-500">
                          {slot.dayOfWeek}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
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
                          {slot.timeSlots.length} time slots available
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
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
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-prussian_blue-400 mb-4">
                    No availability set yet
                  </p>
                  <button
                    onClick={() => setActiveTab("availability")}
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-lg text-white bg-celestial_blue-500 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
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
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Set Your Availability
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => setActiveTab("appointments")}
                className="w-full bg-white p-6 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-alice_blue-200 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-alice_blue-50">
                    <svg
                      className="w-6 h-6 text-celestial_blue-500"
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
                  <div>
                    <h3 className="text-lg font-semibold text-prussian_blue-500">
                      View All Appointments
                    </h3>
                    <p className="text-sm text-prussian_blue-300 mt-1">
                      Manage your upcoming and past appointments
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate("/messages")}
                className="w-full bg-white p-6 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-alice_blue-200 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-alice_blue-50">
                    <svg
                      className="w-6 h-6 text-celestial_blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-prussian_blue-500">
                      Message Center
                    </h3>
                    <p className="text-sm text-prussian_blue-300 mt-1">
                      View and respond to client messages
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => navigate("/provider/profile")}
                className="w-full bg-white p-6 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border border-alice_blue-200 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-alice_blue-50">
                    <svg
                      className="w-6 h-6 text-celestial_blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-prussian_blue-500">
                      Edit Profile
                    </h3>
                    <p className="text-sm text-prussian_blue-300 mt-1">
                      Update your professional information
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        );
      case "appointments":
        return (
          <div className="bg-white rounded-xl border border-alice_blue-200 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-prussian_blue-500">
                  Appointments
                </h2>
                <div className="p-2 rounded-lg bg-alice_blue-50">
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
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>

              {/* Filter/Sort Options could go here */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAppointmentUpdate}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-celestial_blue-500 bg-celestial_blue-50 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
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
                  Refresh
                </button>
              </div>
            </div>

            {successMessage && (
              <div className="mb-6 p-4 rounded-lg bg-celadon-50 border border-celadon-200">
                <p className="text-sm text-celadon-700">{successMessage}</p>
              </div>
            )}

            {error?.appointments ? (
              <div className="p-4 rounded-lg bg-sunglow-50 border border-sunglow-200">
                <p className="text-sm text-sunglow-700">{error.appointments}</p>
              </div>
            ) : (
              <div className="overflow-hidden">
                <AppointmentList
                  appointments={appointments}
                  userType="provider"
                  onUpdate={handleAppointmentUpdate}
                />
              </div>
            )}
          </div>
        );

      case "availability":
        return <ProviderAvailability onUpdate={handleAvailabilityUpdate} />;
      default:
        return null;
    }
  };
  return (
    <div className={theme.layout.wrapper}>
      <div className={`${theme.layout.container} pt-20`}>
        <div className="py-8">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className={`${theme.text.heading} text-3xl mb-2`}>
              Welcome, {user.lastName}
            </h1>
            <p className={theme.text.body}>
              Manage your practice and appointments
            </p>
          </div>
          {/* Availability Reminder Banner */}
          {showAvailabilityReminder && (
            <div
              className={`${theme.card.default} p-4 mb-6 bg-sunglow-50/50 border-l-4 border-sunglow-500`}
            >
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-sunglow-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3
                    className={`${theme.text.heading} text-sm text-prussian_blue-800`}
                  >
                    Set Your Availability
                  </h3>
                  <div className="mt-2 text-sm text-prussian_blue-600">
                    <p>
                      Please set your availability to start receiving
                      appointment requests from clients.
                    </p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => setActiveTab("availability")}
                      className={`${theme.button.primary} text-sm`}
                    >
                      Set Availability Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success/Error Messages */}
          {successMessage && (
            <div className={`${theme.status.success} p-4 mb-6 rounded-lg`}>
              {successMessage}
            </div>
          )}
          {error?.general && (
            <div className={`${theme.status.error} p-4 mb-6 rounded-lg`}>
              {error.general}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex gap-3 mb-8 pb-5 border-b border-alice_blue-200">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5
      ${
        activeTab === "overview"
          ? "bg-celestial_blue-500 text-white shadow-lg shadow-celestial_blue-500/30"
          : "bg-alice_blue-100 text-alice_blue-500 hover:bg-celestial_blue-100 hover:text-white hover:shadow-md"
      }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("appointments")}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5
      ${
        activeTab === "appointments"
          ? "bg-celestial_blue-500 text-white shadow-lg shadow-celestial_blue-500/30"
          : "bg-alice_blue-100 text-alice_blue-500 hover:bg-celestial_blue-100 hover:text-white hover:shadow-md"
      }`}
            >
              Appointments
            </button>
            <button
              onClick={() => setActiveTab("availability")}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:-translate-y-0.5
      ${
        activeTab === "availability"
          ? "bg-celestial_blue-500 text-white shadow-lg shadow-celestial_blue-500/30"
          : "bg-alice_blue-100 text-alice_blue-500 hover:bg-celestial_blue-100 hover:text-white hover:shadow-md"
      }`}
            >
              Availability
            </button>
          </div>

          {/* Tab Content */}
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
