import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  fetchSavedProviders,
  fetchClientAppointments,
} from "../../services/dashboardService";
import { theme } from "../../styles/theme";
import { AppointmentList } from "../Appointments/AppointmentList";

export const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [savedProviders, setSavedProviders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Initial data fetch
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both data sets
        const [appointmentsResult, savedProvidersResult] = await Promise.all([
          fetchClientAppointments(),
          fetchSavedProviders(),
        ]);

        console.log("Fetched appointments:", appointmentsResult);
        console.log("Fetched saved providers:", savedProvidersResult);

        setAppointments(appointmentsResult || []);
        setSavedProviders(savedProvidersResult || []);
      } catch (err) {
        console.error("Dashboard data fetch error:", err);
        setError({ general: "Failed to load dashboard data" });
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [user, navigate]);

  // Add a debug useEffect
  useEffect(() => {
    if (savedProviders?.length > 0) {
      console.log("Saved Providers Data Structure:", {
        firstProvider: savedProviders[0],
        allProviders: savedProviders,
      });
    }
  }, [savedProviders]);

  useEffect(() => {
    console.log("Appointments updated:", appointments);
  }, [appointments]);

  const formatProviderName = (provider) => {
    if (provider?.name) return provider.name;
    return provider?.firstName && provider?.lastName
      ? `Dr. ${provider.firstName} ${provider.lastName}`
      : provider?.email || "Provider Name Not Available";
  };

  const loadAppointments = async () => {
    try {
      setLoading(true);
      console.log("Fetching client appointments...");
      const data = await fetchClientAppointments();
      console.log("Received appointments:", data);
      setAppointments(data || []);
      setError(null);
    } catch (err) {
      console.error("Load appointments error:", err);
      setError((prev) => ({
        ...prev,
        appointments: "Failed to load appointments",
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

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      Saved Providers
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-celestial_blue-500">
                    {Array.isArray(savedProviders) ? savedProviders.length : 0}
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

            {/* Saved Providers Card */}
            <div className="bg-white rounded-xl border border-alice_blue-200 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-prussian_blue-500">
                    Saved Providers
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
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                </div>

                {error?.providers ? (
                  <div className="p-4 rounded-lg bg-sunglow-50 border border-sunglow-200">
                    <p className="text-sm text-sunglow-700">
                      {error.providers}
                    </p>
                  </div>
                ) : savedProviders.length > 0 ? (
                  <div className="space-y-4">
                      {savedProviders.map((saved) => {
                          // Debug log to see the full structure
                          console.log('Full saved provider data:', saved);
                          console.log('Provider data:', saved.provider);
                          // Access providerId directly from the saved object
                          const providerId = saved.providerId?._id || saved.provider?.id;
              
                          return (
                              <div
                                  key={saved.savedId || saved._id}
                                  className="p-4 rounded-lg bg-alice_blue-50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md cursor-pointer"
                                  onClick={() => {
                                      if (providerId) {
                                          console.log('Navigating to provider:', providerId);
                                          navigate(`/providerlist/${providerId}`);
                                      } else {
                                          console.error('Provider data structure:', saved);
                                          console.error('ProviderId not found in saved provider data');
                                      }
                                  }}
                              >
                                  <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full bg-celestial_blue-100 flex items-center justify-center">
                                          <span className="text-celestial_blue-500 font-medium">
                                              {saved.providerId ? (
                                                  // If using providerId structure
                                                  <>
                                                      {saved.providerId.firstName?.[0]}
                                                      {saved.providerId.lastName?.[0]}
                                                  </>
                                              ) : (
                                                  // If using provider.name structure
                                                  saved.provider?.name?.split(' ').map(n => n[0]).join('')
                                              )}
                                          </span>
                                      </div>
                                      <div className="flex-1 min-w-0">
                                          <p className="font-medium text-prussian_blue-500">
                                              {saved.providerId ? (
                                                  `Dr. ${saved.providerId.firstName} ${saved.providerId.lastName}`
                                              ) : (
                                                  saved.provider?.name
                                              )}
                                          </p>
                                          {(saved.providerId?.specialties || saved.provider?.specialties) && (
                                              <p className="text-sm text-prussian_blue-300 truncate">
                                                  {(saved.providerId?.specialties || saved.provider?.specialties)
                                                      .slice(0, 2)
                                                      .join(", ")}
                                                  {(saved.providerId?.specialties || saved.provider?.specialties).length > 2 && "..."}
                                              </p>
                                          )}
                                          <p className="text-sm text-prussian_blue-300">
                                              Category: {saved.category || 'Potential Matches'}
                                          </p>
                                      </div>
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
                                              d="M9 5l7 7-7 7"
                                          />
                                      </svg>
                                  </div>
                              </div>
                          );
                      })}
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
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-prussian_blue-400 mb-2">
                      No saved providers yet
                    </p>
                    <p className="text-sm text-prussian_blue-300 mb-4">
                      Browse our provider list to find the right match for you.
                    </p>
                    <Link
                      to="/providerlist"
                      className="inline-flex items-center gap-2 px-6 py-2 rounded-lg text-white bg-celestial_blue-500 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
                    >
                      Find Providers
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Appointments Card */}
            <div className="bg-white rounded-xl border border-alice_blue-200 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-prussian_blue-500">
                    Upcoming Appointments
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

                {error?.appointments ? (
                  <div className="p-4 rounded-lg bg-sunglow-50 border border-sunglow-200">
                    <p className="text-sm text-sunglow-700">
                      {error.appointments}
                    </p>
                  </div>
                ) : appointments.length > 0 ? (
                  <div className="space-y-4">
                    {appointments.map((appointment) => (
                      <div
                        key={appointment._id}
                        className="p-4 rounded-lg bg-alice_blue-50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-celestial_blue-100 flex items-center justify-center">
                              <span className="text-celestial_blue-500 font-medium">
                                {appointment.provider?.firstName?.[0]}
                                {appointment.provider?.lastName?.[0]}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-prussian_blue-500">
                                {formatProviderName(appointment.provider)}
                              </p>
                              <div className="flex items-center text-sm text-prussian_blue-300">
                                <svg
                                  className="w-4 h-4 mr-1"
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
                                {formatDate(appointment.datetime)}
                              </div>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium
                                                            ${
                                                              appointment.status ===
                                                              "confirmed"
                                                                ? "bg-celadon-100 text-celadon-700"
                                                                : appointment.status ===
                                                                  "pending"
                                                                ? "bg-sunglow-100 text-sunglow-700"
                                                                : "bg-celestial_blue-100 text-celestial_blue-700"
                                                            }`}
                          >
                            {appointment.status.charAt(0).toUpperCase() +
                              appointment.status.slice(1)}
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
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-prussian_blue-400 mb-2">
                      No upcoming appointments
                    </p>
                    <p className="text-sm text-prussian_blue-300 mb-4">
                      Book an appointment with one of our providers.
                    </p>
                    <Link
                      to="/providerlist"
                      className="inline-flex items-center gap-2 px-6 py-2 rounded-lg text-white bg-celestial_blue-500 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
                    >
                      Find Providers
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case "appointments":
        console.log("Rendering appointments tab with data:", appointments);
        return (
          <div className="bg-white rounded-xl border border-alice_blue-200 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-prussian_blue-500">
                  My Appointments
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

              <button
                onClick={() => navigate("/providerlist")}
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
                Book New Appointment
              </button>
            </div>

            {error?.appointments ? (
              <div className="p-4 rounded-lg bg-sunglow-50 border border-sunglow-200">
                <p className="text-sm text-sunglow-700">{error.appointments}</p>
              </div>
            ) : (
              <div className="overflow-hidden">
                <AppointmentList
                  appointments={appointments}
                  userType="client"
                  onUpdate={loadAppointments}
                />
              </div>
            )}
          </div>
        );

      default:
        return null;
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
    <div className="min-h-screen bg-alice_blue-500 py-8 px-4 sm:px-6 lg:px-8 pt-28 py-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className={`${theme.text.heading} text-3xl font-bold`}>
              Welcome, {user?.firstName}!
            </h1>
            <Link
              to="/providerlist"
              className="px-6 py-3 bg-celestial_blue-500 text-white rounded-lg hover:bg-celestial_blue-600 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Find Providers
            </Link>
          </div>
          <p className={theme.text.body}>
            Your journey of wellness begins here.
          </p>
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
        </div>

        {/* Content */}
        {renderContent()}
      </div>
    </div>
  );
};

export default ClientDashboard;
