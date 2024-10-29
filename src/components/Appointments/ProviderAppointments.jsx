import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchProviderAppointments } from '../../services/dashboardService';

const ProviderAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadAppointments = async () => {
            try {
                setLoading(true);
                const data = await fetchProviderAppointments();
                setAppointments(data || []);
            } catch (err) {
                console.error('Error loading appointments:', err);
                setError('Failed to load appointments');
            } finally {
                setLoading(false);
            }
        };

        loadAppointments();
    }, []);

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">My Appointments</h1>
            <div className="space-y-4">
                {appointments.length > 0 ? (
                    appointments.map(appointment => (
                        <div 
                            key={appointment._id} 
                            className="bg-white p-4 rounded-lg shadow"
                        >
                            <div className="font-medium">
                                Client: {appointment.client?.firstName} {appointment.client?.lastName}
                            </div>
                            <div className="text-gray-600">
                                Date: {new Date(appointment.datetime).toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">
                                Duration: {appointment.duration} minutes
                            </div>
                            <div className="mt-2">
                                <span className={`px-2 py-1 rounded text-sm ${
                                    appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                    appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {appointment.status}
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center">No appointments found</p>
                )}
            </div>
        </div>
    );
};

export default ProviderAppointments;
