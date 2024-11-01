import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { theme } from "../../styles/theme";
import { toast } from "react-toastify";
import { AppointmentList } from "./AppointmentList";

export const ProviderAppointments = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-celestial_blue-500" />
      </div>
    );
  }

  return (
    <div className={`${theme.layout.container} p-6 pt-28 pb-16`}>
      <h1 className={`${theme.text.heading} text-2xl mb-6`}>My Appointments</h1>
      <AppointmentList userType="provider" />
    </div>
  );
};
