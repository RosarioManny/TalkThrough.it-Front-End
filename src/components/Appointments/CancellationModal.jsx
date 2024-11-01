import React, { useState } from "react";
import { theme } from "../../styles/theme";

export const CancellationModal = ({
  isOpen,
  onClose,
  onConfirm,
  appointment,
}) => {
  const [reason, setReason] = useState("");

  // Check if appointment is within 24 hours
  const isWithin24Hours = () => {
    if (!appointment?.datetime) return false;
    const appointmentTime = new Date(appointment.datetime);
    const now = new Date();
    const hoursUntilAppointment = (appointmentTime - now) / (1000 * 60 * 60);
    return hoursUntilAppointment < 24;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isWithin24Hours()) {
      toast.warning(
        "Appointments cannot be cancelled within 24 hours of the scheduled time"
      );
      return;
    }
    onConfirm(reason);
    setReason("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-prussian_blue-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-start mb-4">
          <h2 className={`${theme.text.heading} text-xl`}>
            Cancel Appointment
          </h2>
          <button
            onClick={onClose}
            className="text-prussian_blue-400 hover:text-prussian_blue-600"
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

        {isWithin24Hours() && (
          <div className={`${theme.status.warning} p-4 mb-4 rounded-lg`}>
            <p className="font-medium">Warning</p>
            <p>
              Appointments cannot be cancelled within 24 hours of the scheduled
              time.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-prussian_blue mb-1">
              Cancellation Reason
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="block w-full rounded-md border border-alice_blue-300 px-3 py-2 text-prussian_blue shadow-sm focus:outline-none focus:ring-2 focus:ring-celestial_blue-500 focus:border-celestial_blue-500 sm:text-sm"
              rows="4"
              placeholder="Please provide a reason for cancellation"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className={`${theme.button.outline} px-4 py-2 rounded-lg text-sm`}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isWithin24Hours()}
              className={`${theme.button.primary} px-4 py-2 rounded-lg text-sm disabled:opacity-50`}
            >
              Confirm Cancellation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
