import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  fetchSavedProviders,
  fetchClientAppointments,
} from "../../services/dashboardService";
import { getAuthHeaders } from "../../services/dashboardService";
import axios from "axios";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [savedProviders, setSavedProviders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state before fetching

        // Fetch data separately to handle individual errors
        try {
          const providersData = await fetchSavedProviders();
          setSavedProviders(providersData || []);
        } catch (providerError) {
          console.error("Error fetching providers:", providerError);
          setError((prev) => ({
            ...prev,
            providers: "Failed to load saved providers",
          }));
        }

        try {
          const appointmentsData = await fetchClientAppointments();
          setAppointments(appointmentsData || []);
        } catch (appointmentError) {
          console.error("Error fetching appointments:", appointmentError);
          setError((prev) => ({
            ...prev,
            appointments: "Failed to load appointments",
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

  // gabe start

  const [conversations, setConversations] = useState([]);

  const getConversations = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/messages/conversations`,
        getAuthHeaders()
      );
      return response.data
    } catch (error) {
      if (error.response?.status === 401) {
        console.error("Authentication token missing or invalid");
      }
      console.error("Error saving provider:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchConvos = async () => {
      const convoData = await getConversations();
      setConversations(convoData.conversations);
    };
    fetchConvos();
  }, []);

  //gabe end here
  
  // Helper function to format provider name
  const formatProviderName = (provider) => {
    return provider.firstName && provider.lastName
      ? `${provider.firstName} ${provider.lastName}`
      : provider.email || "Provider Name Not Available";
  };

  // Helper function to format date
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
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div className='p-6 bg-gray-50 min-h-screen'>
      <h1 className='text-3xl font-bold mb-8 text-gray-800'>My Dashboard</h1>

      {error?.general && (
        <div className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
          {error.general}
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {/* Saved Providers Section */}
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>
            Saved Providers
          </h2>
          {error?.providers ? (
            <p className='text-red-500'>{error.providers}</p>
          ) : savedProviders.length > 0 ? (
            <ul className='space-y-3'>
              {savedProviders.map((provider) => (
                <li
                  key={provider._id}
                  className='p-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors duration-200'>
                  <div className='font-medium'>
                    {formatProviderName(provider)}
                  </div>
                  {provider.specialties && (
                    <div className='text-sm text-gray-600'>
                      {provider.specialties.join(", ")}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-gray-500'>
              No saved providers yet. Browse our provider list to find the right
              match for you.
            </p>
          )}
        </div>

        {/* Upcoming Appointments Section */}
        <div className='bg-white p-6 rounded-lg shadow-md'>
          <h2 className='text-2xl font-semibold mb-4 text-gray-800'>
            Upcoming Appointments
          </h2>
          {error?.appointments ? (
            <p className='text-red-500'>{error.appointments}</p>
          ) : appointments.length > 0 ? (
            <ul className='space-y-3'>
              {appointments.map((appointment) => (
                <li
                  key={appointment._id}
                  className='p-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors duration-200'>
                  <div className='font-medium'>
                    {appointment.provider &&
                      formatProviderName(appointment.provider)}
                  </div>
                  <div className='text-sm text-gray-600'>
                    {formatDate(appointment.datetime)}
                  </div>
                  {appointment.status && (
                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        appointment.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                      {appointment.status.charAt(0).toUpperCase() +
                        appointment.status.slice(1)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className='text-gray-500'>No upcoming appointments scheduled.</p>
          )}
        </div>

        {/* Recent Messages Section */}
        {conversations.map((convo)=>(
            <>
              <p>to {convo.otherUser.name}</p>
              <p>{convo.lastMessage.content}</p>
            </>
        ))}

        <Link to='/messages/:messageId'>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <h2 className='text-2xl font-semibold mb-4 text-gray-800'>
              Recent Messages
            </h2>
            <div className='text-gray-500 flex flex-col items-center justify-center h-40'>
              <svg
                className='w-12 h-12 text-gray-400 mb-3'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z'
                />
              </svg>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ClientDashboard;
