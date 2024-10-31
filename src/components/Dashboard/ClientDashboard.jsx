import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  fetchSavedProviders,
  fetchClientAppointments,
} from "../../services/dashboardService";
import { getAuthHeaders } from "../../services/dashboardService";
import { theme } from "../../styles/theme";
import axios from "axios";

export const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [savedProviders, setSavedProviders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [providersData, appointmentsData, conversationsData] =
          await Promise.allSettled([
            fetchSavedProviders(),
            fetchClientAppointments(),
            getConversations(),
          ]);

        if (providersData.status === "fulfilled") {
          setSavedProviders(providersData.value || []);
        } else {
          setError((prev) => ({
            ...prev,
            providers: "Failed to load saved providers",
          }));
        }

        if (appointmentsData.status === "fulfilled") {
          setAppointments(appointmentsData.value || []);
        } else {
          setError((prev) => ({
            ...prev,
            appointments: "Failed to load appointments",
          }));
        }

        if (conversationsData.status === "fulfilled") {
          setConversations(conversationsData.value?.conversations || []);
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

    fetchAllData();
  }, [user, navigate]);

  const getConversations = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"
        }/messages/conversations`,
        getAuthHeaders()
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching conversations:", error);
      throw error;
    }
  };

  const formatProviderName = (provider) => {
    return provider.firstName && provider.lastName
      ? `${provider.firstName} ${provider.lastName}`
      : provider.email || "Provider Name Not Available";
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
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-celestial_blue-500"></div>
          <p className="mt-4 text-prussian_blue-400">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-alice_blue-500 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className={`${theme.text.heading} text-3xl font-bold`}>
            Welcome, {user?.firstName || "Client"}!
          </h1>
          <Link
            to="/providerlist"
            className={`${theme.button.primary} px-4 py-2 rounded-md shadow-sm text-sm font-medium`}
          >
            Find Providers
          </Link>
        </div>

        {/* Error Alert */}
        {error?.general && (
          <div
            className={`mb-6 p-4 ${theme.status.error} rounded-lg flex items-center`}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error.general}
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Saved Providers Card */}
          <div className={`${theme.card.default}`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className={`${theme.text.heading} text-xl`}>
                  Saved Providers
                </h2>
                <span className={theme.text.muted}>
                  {savedProviders.length} saved
                </span>
              </div>

              {error?.providers ? (
                <div className={`p-4 ${theme.status.error} rounded-lg`}>
                  {error.providers}
                </div>
              ) : savedProviders.length > 0 ? (
                <ul className="divide-y divide-alice_blue-200">
                  {savedProviders.map((provider) => (
                    <li key={provider._id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-celestial_blue-100 flex items-center justify-center">
                            <span className="text-celestial_blue-600 font-medium">
                              {provider.firstName?.[0]}
                              {provider.lastName?.[0]}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`${theme.text.heading} text-sm truncate`}
                          >
                            {formatProviderName(provider)}
                          </p>
                          {provider.specialties && (
                            <p
                              className={`${theme.text.muted} text-sm truncate`}
                            >
                              {provider.specialties.slice(0, 2).join(", ")}
                              {provider.specialties.length > 2 && "..."}
                            </p>
                          )}
                        </div>
                        <Link
                          to={`/provider/${provider._id}`}
                          className={`${theme.button.outline} px-3 py-1 text-xs rounded-md`}
                        >
                          View
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <svg
                    className="mx-auto h-12 w-12 text-prussian_blue-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p className={`mt-4 ${theme.text.muted}`}>
                    No saved providers yet. Browse our provider list to find the
                    right match for you.
                  </p>
                  <Link
                    to="/providerlist"
                    className={`${theme.button.primary} mt-4 px-4 py-2 rounded-md inline-flex`}
                  >
                    Find Providers
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Appointments Card */}
          <div className={`${theme.card.default}`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className={`${theme.text.heading} text-xl`}>
                  Upcoming Appointments
                </h2>
                <span className={theme.text.muted}>
                  {appointments.length} scheduled
                </span>
              </div>

              {error?.appointments ? (
                <div className={`p-4 ${theme.status.error} rounded-lg`}>
                  {error.appointments}
                </div>
              ) : appointments.length > 0 ? (
                <ul className="divide-y divide-alice_blue-200">
                  {appointments.map((appointment) => (
                    <li key={appointment._id} className="py-4">
                      <div className="flex flex-col space-y-2">
                        <div className="flex justify-between">
                          <div className={`${theme.text.heading} text-sm`}>
                            {appointment.provider &&
                              formatProviderName(appointment.provider)}
                          </div>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${
                                appointment.status === "confirmed"
                                  ? theme.status.success
                                  : appointment.status === "pending"
                                  ? theme.status.warning
                                  : theme.status.info
                              }`}
                          >
                            {appointment.status?.charAt(0).toUpperCase() +
                              appointment.status?.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-prussian_blue-400">
                          <svg
                            className="flex-shrink-0 mr-1.5 h-5 w-5 text-prussian_blue-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          {formatDate(appointment.datetime)}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <svg
                    className="mx-auto h-12 w-12 text-prussian_blue-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <p className={`mt-4 ${theme.text.muted}`}>
                    No upcoming appointments scheduled.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Messages Card */}
          <div className={`${theme.card.default}`}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className={`${theme.text.heading} text-xl`}>
                  Recent Messages
                </h2>
                <span className={theme.text.muted}>
                  {conversations.length} conversations
                </span>
              </div>

              {error?.messages ? (
                <div className={`p-4 ${theme.status.error} rounded-lg`}>
                  {error.messages}
                </div>
              ) : conversations.length > 0 ? (
                <ul className="divide-y divide-alice_blue-200">
                  {conversations.map((conversation) => (
                    <li key={conversation._id} className="py-4">
                      <Link
                        to={`/messages/${conversation._id}`}
                        className="flex items-center space-x-4 hover:bg-alice_blue-50 p-2 rounded-lg transition-colors duration-200"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-celestial_blue-100 flex items-center justify-center">
                            <span className="text-celestial_blue-600 font-medium">
                              {conversation.participant?.[0]}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`${theme.text.heading} text-sm truncate`}
                          >
                            {conversation.participant}
                          </p>
                          <p className={`${theme.text.muted} text-sm truncate`}>
                            {conversation.lastMessage || "No messages yet"}
                          </p>
                        </div>
                        {conversation.unread && (
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-celestial_blue-500 text-white text-xs">
                              {conversation.unread}
                            </span>
                          </div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <svg
                    className="mx-auto h-12 w-12 text-prussian_blue-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                  <p className={`mt-4 ${theme.text.muted}`}>
                    No messages yet. Start a conversation with a provider.
                  </p>
                  <Link
                    to="/providerlist"
                    className={`${theme.button.primary} mt-4 px-4 py-2 rounded-md inline-flex`}
                  >
                    Find Providers
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
