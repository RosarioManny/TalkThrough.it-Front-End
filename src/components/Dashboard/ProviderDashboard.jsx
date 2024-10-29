import React, { useState, useEffect } from 'react';
import { fetchProviderClients, fetchProviderAppointments, fetchProviderAvailability } from '../../services/dashboardService';

const ProviderDashboard = () => {
  const [clients, setClients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [clientsData, appointmentsData, availabilityData] = await Promise.all([
          fetchProviderClients(),
          fetchProviderAppointments(),
          fetchProviderAvailability()
        ]);
        setClients(clientsData);
        setAppointments(appointmentsData);
        setAvailability(availabilityData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Dashboard data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Current Clients Section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">My Clients</h2>
          {clients.length > 0 ? (
            <ul className="space-y-2">
              {clients.map((client) => (
                <li key={client._id} className="p-2 hover:bg-gray-50">
                  {client.name}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No current clients</p>
          )}
        </div>

        {/* Appointments Section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Upcoming Appointments</h2>
          {appointments.length > 0 ? (
            <ul className="space-y-2">
              {appointments.map((appointment) => (
                <li key={appointment._id} className="p-2 hover:bg-gray-50">
                  {new Date(appointment.datetime).toLocaleDateString()} - {appointment.clientName}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No upcoming appointments</p>
          )}
        </div>

        {/* Availability Management Section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Manage Availability</h2>
          {availability.length > 0 ? (
            <ul className="space-y-2">
              {availability.map((slot) => (
                <li key={slot._id} className="p-2 hover:bg-gray-50">
                  {new Date(slot.datetime).toLocaleDateString()} - {slot.status}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No availability slots set</p>
          )}
          <button 
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => {/* Add functionality to manage availability */}}
          >
            Add Availability
          </button>
        </div>

        {/* Messages Section */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Recent Messages</h2>
          <p className="text-gray-500">Message feature coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
