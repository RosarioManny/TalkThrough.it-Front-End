import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
    fetchProviderClients, 
    fetchProviderAppointments, 
    fetchProviderAvailability 
} from '../../services/dashboardService';

export const ProviderDashboard = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [clients, setClients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);

                try {
                    const clientsData = await fetchProviderClients();
                    setClients(clientsData || []);
                } catch (clientError) {
                    console.error('Error fetching clients:', clientError);
                    setError(prev => ({ ...prev, clients: 'Failed to load clients' }));
                }

                try {
                    const appointmentsData = await fetchProviderAppointments();
                    setAppointments(appointmentsData || []);
                } catch (appointmentError) {
                    console.error('Error fetching appointments:', appointmentError);
                    setError(prev => ({ ...prev, appointments: 'Failed to load appointments' }));
                }

                try {
                    const availabilityData = await fetchProviderAvailability();
                    setAvailability(availabilityData || []);
                } catch (availabilityError) {
                    console.error('Error fetching availability:', availabilityError);
                    setError(prev => ({ ...prev, availability: 'Failed to load availability' }));
                }

            } catch (err) {
                console.error('Dashboard data fetch error:', err);
                setError({ general: 'Failed to load dashboard data' });
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user, navigate]);

    const formatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Date not available';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Provider Dashboard</h1>
            
            {error?.general && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error.general}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Current Clients Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">My Clients</h2>
                    {error?.clients ? (
                        <p className="text-red-500">{error.clients}</p>
                    ) : clients.length > 0 ? (
                        <ul className="space-y-3">
                            {clients.map((client) => (
                                <li 
                                    key={client._id}
                                    className="p-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors duration-200"
                                >
                                    <div className="font-medium">
                                        {client.firstName} {client.lastName}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {client.email}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No clients yet.</p>
                    )}
                </div>

                {/* Upcoming Appointments Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Upcoming Appointments</h2>
                    {error?.appointments ? (
                        <p className="text-red-500">{error.appointments}</p>
                    ) : appointments.length > 0 ? (
                        <ul className="space-y-3">
                            {appointments.map((appointment) => (
                                <li 
                                    key={appointment._id}
                                    className="p-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors duration-200"
                                >
                                    <div className="font-medium">
                                        {appointment.client?.firstName} {appointment.client?.lastName}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {formatDate(appointment.datetime)}
                                    </div>
                                    {appointment.status && (
                                        <span className={`text-xs px-2 py-1 rounded ${
                                            appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                                            appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                            'bg-gray-100 text-gray-800'
                                        }`}>
                                            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No upcoming appointments.</p>
                    )}
                </div>

                {/* Availability Management Section */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">My Availability</h2>
                    {error?.availability ? (
                        <p className="text-red-500">{error.availability}</p>
                    ) : (
                        <div>
                            <button 
                                className="mb-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                                onClick={() => {/* Add functionality to manage availability */}}
                            >
                                Manage Availability
                            </button>
                            {availability.length > 0 ? (
                                <ul className="space-y-3">
                                    {availability.map((slot) => (
                                        <li 
                                            key={slot._id}
                                            className="p-3 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors duration-200"
                                        >
                                            <div className="text-sm text-gray-600">
                                                {formatDate(slot.datetime)}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Duration: {slot.duration} minutes
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">No availability slots set.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProviderDashboard;
