import React from 'react';
import { theme } from '../../styles/theme';

export const ClientQuickView = ({ client, onClose, isOpen }) => {
    if (!isOpen) return null;

    console.log('Client data in modal:', client); // Debug log

    return (
        <div className="fixed inset-0 bg-prussian_blue-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                    <h2 className={`${theme.text.heading} text-xl`}>
                        Client Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-prussian_blue-400 hover:text-prussian_blue-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Client Information */}
                    <div className="space-y-4">
                        <div>
                            <h3 className={`${theme.text.body} font-medium text-lg mb-4`}>Personal Information</h3>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm text-prussian_blue-400">Name</label>
                                    <p className={`${theme.text.heading}`}>
                                        {client.firstName} {client.lastName}
                                    </p>
                                </div>

                                {client.location && (
                                    <div>
                                        <label className="text-sm text-prussian_blue-400">Location</label>
                                        <p className={theme.text.body}>{client.location}</p>
                                    </div>
                                )}

                                {client.insuranceProvider && (
                                    <div>
                                        <label className="text-sm text-prussian_blue-400">Insurance Provider</label>
                                        <p className={theme.text.body}>{client.insuranceProvider}</p>
                                    </div>
                                )}

                                {client.email && (
                                    <div>
                                        <label className="text-sm text-prussian_blue-400">Email</label>
                                        <p className={theme.text.body}>{client.email}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {client.therapyGoals && (
                            <div>
                                <h3 className={`${theme.text.body} font-medium text-lg mb-2`}>Therapy Goals</h3>
                                <p className={`${theme.text.body} whitespace-pre-wrap`}>
                                    {client.therapyGoals}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Appointments History */}
                    <div>
                        <h3 className={`${theme.text.body} font-medium text-lg mb-4`}>Appointments History</h3>
                        <div className="space-y-3">
                            {client.appointments && client.appointments.length > 0 ? (
                                client.appointments.map(appointment => (
                                    <div 
                                        key={appointment._id}
                                        className="p-3 bg-alice_blue-50 rounded-lg"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className={`${theme.text.body} font-medium`}>
                                                    {new Date(appointment.datetime).toLocaleString()}
                                                </p>
                                                <p className="text-sm text-prussian_blue-400">
                                                    {appointment.meetingType} • {appointment.duration} minutes
                                                </p>
                                                {appointment.location && (
                                                    <p className="text-sm text-prussian_blue-400">
                                                        Location: {appointment.location}
                                                    </p>
                                                )}
                                            </div>
                                            <span className={`${theme.badges.new} capitalize`}>
                                                {appointment.status}
                                            </span>
                                        </div>
                                        {appointment.notes && (
                                            <p className="text-sm text-prussian_blue-400 mt-2 border-t border-alice_blue-200 pt-2">
                                                Notes: {appointment.notes}
                                            </p>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-prussian_blue-400 text-center py-4">
                                    No appointment history found
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-6 flex justify-end border-t border-alice_blue-200 pt-4">
                    <button
                        onClick={onClose}
                        className={`${theme.button.outline} px-4 py-2 rounded-lg text-sm`}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};
