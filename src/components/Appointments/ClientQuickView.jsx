import React from "react";
import { theme } from "../../styles/theme";
import { useAuth } from "../../context/AuthContext";

export const ClientQuickView = ({ client, provider, onClose, isOpen }) => {
  const { user } = useAuth();
  if (!isOpen) return null;

  const isClientView = user?.type === "client";
  const personData = isClientView ? provider : client;

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

  if (!personData) return null;
  console.log("Modal Data:", {
    isClientView,
    personData,
    appointments: personData?.appointments,
    userType: user?.type,
  });
  return (
    <>
      {/* Single Overlay */}
      <div
        className="fixed inset-0 bg-prussian_blue-500 bg-opacity-75 z-40"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <div className="flex justify-between items-start mb-6">
              <h2 className={`${theme.text.heading} text-xl`}>
                {isClientView ? "Provider Details" : "Client Details"}
              </h2>
              <button
                onClick={onClose}
                className="text-prussian_blue-400 hover:text-prussian_blue-600 transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <div>
                  <h3 className={`${theme.text.body} font-medium text-lg mb-4`}>
                    {isClientView
                      ? "Professional Information"
                      : "Personal Information"}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-prussian_blue-400">
                        Name
                      </label>
                      <p className={`${theme.text.heading}`}>
                        {isClientView
                          ? `Dr. ${personData?.firstName} ${personData?.lastName}`
                          : `${personData?.firstName} ${personData?.lastName}`}
                      </p>
                    </div>

                    {personData?.location && (
                      <div>
                        <label className="text-sm text-prussian_blue-400">
                          Location
                        </label>
                        <p className={theme.text.body}>{personData.location}</p>
                      </div>
                    )}

                    {isClientView ? (
                      // Provider-specific information
                      <>
                        {personData?.specialties && (
                          <div>
                            <label className="text-sm text-prussian_blue-400">
                              Specialties
                            </label>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {personData.specialties.map(
                                (specialty, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-celestial_blue-50 text-celestial_blue-600 rounded-full text-sm"
                                  >
                                    {specialty}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}
                        {personData?.insuranceAccepted && (
                          <div>
                            <label className="text-sm text-prussian_blue-400">
                              Insurance Accepted
                            </label>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {personData.insuranceAccepted.map(
                                (insurance, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 bg-celadon-50 text-celadon-600 rounded-full text-sm"
                                  >
                                    {insurance}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      // Client-specific information
                      <>
                        {personData?.insuranceProvider && (
                          <div>
                            <label className="text-sm text-prussian_blue-400">
                              Insurance Provider
                            </label>
                            <p className={theme.text.body}>
                              {personData.insuranceProvider}
                            </p>
                          </div>
                        )}
                      </>
                    )}

                    {personData?.email && (
                      <div>
                        <label className="text-sm text-prussian_blue-400">
                          Email
                        </label>
                        <p className={theme.text.body}>{personData.email}</p>
                      </div>
                    )}
                  </div>
                </div>

                {isClientView
                  ? personData?.bio && (
                      <div>
                        <h3
                          className={`${theme.text.body} font-medium text-lg mb-2`}
                        >
                          About
                        </h3>
                        <p className={`${theme.text.body} whitespace-pre-wrap`}>
                          {personData.bio}
                        </p>
                      </div>
                    )
                  : personData?.therapyGoals && (
                      <div>
                        <h3
                          className={`${theme.text.body} font-medium text-lg mb-2`}
                        >
                          Therapy Goals
                        </h3>
                        <p className={`${theme.text.body} whitespace-pre-wrap`}>
                          {personData.therapyGoals}
                        </p>
                      </div>
                    )}
              </div>

              {/* Appointments History */}
              <div className="bg-white rounded-lg">
                <h3 className={`${theme.text.body} font-medium text-lg mb-4`}>
                  Upcoming Appointments
                </h3>
                <div className="space-y-3">
                  {personData?.appointments &&
                  personData.appointments.length > 0 ? (
                    personData.appointments.map((appointment) => (
                      <div
                        key={appointment._id}
                        className="p-4 bg-alice_blue-50 rounded-lg hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className={`${theme.text.body} font-medium`}>
                              {formatDate(appointment.datetime)}
                            </p>
                            <p className="text-sm text-prussian_blue-400">
                              {appointment.meetingType} •{" "}
                              {appointment.duration || "60"} minutes
                            </p>
                            {appointment.location && (
                              <p className="text-sm text-prussian_blue-400">
                                Location: {appointment.location}
                              </p>
                            )}
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium
                            ${
                              appointment.status === "confirmed"
                                ? "bg-celadon-100 text-celadon-700"
                                : appointment.status === "pending"
                                ? "bg-sunglow-100 text-sunglow-700"
                                : "bg-celestial_blue-100 text-celestial_blue-700"
                            }`}
                          >
                            {appointment.status.charAt(0).toUpperCase() +
                              appointment.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 bg-alice_blue-50 rounded-lg">
                      <p className="text-prussian_blue-400">
                        No upcoming appointments
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end border-t border-alice_blue-200 pt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-celestial_blue-500 text-celestial_blue-500 rounded-lg hover:-translate-y-0.5 hover:shadow-md transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
