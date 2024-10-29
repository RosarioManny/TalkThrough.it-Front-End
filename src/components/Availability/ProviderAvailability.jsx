import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchProviderAvailability, updateProviderAvailability } from '../../services/dashboardService';

const ProviderAvailability = () => {
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadAvailability();
    }, []);

    const loadAvailability = async () => {
        try {
            setLoading(true);
            const data = await fetchProviderAvailability();
            setAvailability(data || []);
        } catch (err) {
            console.error('Error loading availability:', err);
            setError('Failed to load availability');
        } finally {
            setLoading(false);
        }
    };

    const handleAddSlot = async () => {
        // Add functionality to add availability slot
        console.log('Add slot functionality to be implemented');
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Availability</h1>
                <button 
                    onClick={handleAddSlot}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add Availability Slot
                </button>
            </div>
            <div className="space-y-4">
                {availability.length > 0 ? (
                    availability.map(slot => (
                        <div 
                            key={slot._id} 
                            className="bg-white p-4 rounded-lg shadow flex justify-between items-center"
                        >
                            <div>
                                <div className="font-medium">
                                    {new Date(slot.datetime).toLocaleString()}
                                </div>
                                <div className="text-sm text-gray-500">
                                    Duration: {slot.duration} minutes
                                </div>
                            </div>
                            <button 
                                className="text-red-500 hover:text-red-700"
                                onClick={() => {/* Add delete functionality */}}
                            >
                                Remove
                            </button>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-center">No availability slots set</p>
                )}
            </div>
        </div>
    );
};

export default ProviderAvailability;
