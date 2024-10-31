import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { theme } from "../../styles/theme";
import Calendar from "./Calendar";
import { ProviderPublicAvailability } from "../Availability/ProviderPublicAvailability";
import { fetchProviderPublicDetails } from "../../services/providerService";
import {
  getProviderPublicAvailability,
  getDayAvailability,
} from "../../services/availabilityService";
import {
  getAvailableTimeSlots,
  createAppointment,
} from "../../services/appointmentService";
import { toast } from "react-toastify";

const meetingTypes = [
  { value: "video", label: "Video Call" },
  { value: "phone", label: "Phone Call" },
  { value: "inPerson", label: "In Person" },
];

export const AppointmentBookingPage = () => {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [availableDates, setAvailableDates] = useState([]);
  const [providerAvailability, setProviderAvailability] = useState(null);
  const [currentStep, setCurrentStep] = useState("date"); // date, time, details, confirm
  const [bookingData, setBookingData] = useState({
    provider: null,
    selectedDate: null,
    selectedTime: null,
    meetingType: null, //
    location: "",
    notes: "",
    duration: 60,
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  

  // Route protection
  useEffect(() => {
    if (!user) {
      navigate("/signin", {
        state: { from: `/book-appointment/${providerId}` },
      });
      return;
    }

    if (user.type === "provider") {
      navigate("/dashboard");
      return;
    }
  }, [user, providerId, navigate]);

  useEffect(() => {
    if (providerId) {
      loadData();
    }
  }, [providerId]);

  // Load time slots when date is selected
  useEffect(() => {
    const loadTimeSlots = async () => {
      if (!bookingData.selectedDate) return;

      try {
        setLoading(true);
        const dayOfWeek = bookingData.selectedDate.toLocaleString("en-US", {
          weekday: "long",
        });
        const availabilityData = await getDayAvailability(
          providerId,
          dayOfWeek
        );

        console.log("Available slots for day:", availabilityData);
        setAvailableSlots(availabilityData.timeSlots || []);
        setError(null);
      } catch (err) {
        console.error("Failed to load time slots:", err);
        toast.error("Failed to load available time slots");
        setError("Failed to load available time slots");
      } finally {
        setLoading(false);
      }
    };

    if (currentStep === "time") {
      loadTimeSlots();
    }
  }, [providerId, bookingData.selectedDate, currentStep]);

  const loadData = async () => {
    try {
      setIsInitialLoading(true);
      console.log("Starting to load data for provider:", providerId);

      const response = await getProviderPublicAvailability(providerId);
      console.log("Raw availability response:", response);

      if (!response.provider) {
        throw new Error("Provider data not found in response");
      }

      setProviderAvailability(response);
      setBookingData((prev) => ({
        ...prev,
        provider: response.provider,
      }));

      // Generate available dates
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const nextFourMondays = [];
      let current = new Date(today);

      // Find next 4 Mondays
      while (nextFourMondays.length < 4) {
        if (current.getDay() === 1) {
          // 1 represents Monday
          nextFourMondays.push(new Date(current));
        }
        current.setDate(current.getDate() + 1);
      }

      console.log("Generated Mondays:", nextFourMondays);
      setAvailableDates(nextFourMondays);
    } catch (err) {
      console.error("Error in loadData:", err);
      setError(err.message);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleDateSelect = async (date) => {
    try {
      setLoading(true);
      const dayOfWeek = date.toLocaleString("en-US", { weekday: "long" });
      console.log("Selected date:", date, "Day of week:", dayOfWeek);

      // Use the stored provider availability
      const dayAvailability = providerAvailability?.availability.find(
        (day) => day.dayOfWeek === dayOfWeek
      );

      if (dayAvailability && dayAvailability.timeSlots.length > 0) {
        setBookingData((prev) => ({
          ...prev,
          selectedDate: date,
        }));
        setAvailableSlots(dayAvailability.timeSlots);
        setCurrentStep("time");
      } else {
        toast.error("No available time slots for this date");
      }
    } catch (err) {
      console.error("Error fetching time slots:", err);
      toast.error("Failed to load time slots");
    } finally {
      setLoading(false);
    }
  };

  const handleTimeSelect = (time, slot) => {
    console.log("Selected time slot:", {
        time,
        slot
    });
    
    setBookingData((prev) => ({
        ...prev,
        selectedTime: time,
        meetingType: slot.availableMeetingTypes?.[0] || "video"
    }));
    setCurrentStep("details");
};

  const handleDetailsSubmit = () => {
    if (
      bookingData.meetingType === "inPerson" &&
      !bookingData.location.trim()
    ) {
      toast.error("Location is required for in-person appointments");
      return;
    }
    setCurrentStep("confirm");
  };

  const handleBookAppointment = async () => {
    try {
        setLoading(true);

        // Format the appointment date and time
        const appointmentDateTime = new Date(bookingData.selectedDate);
        
        // Handle the time based on how it's stored
        if (typeof bookingData.selectedTime === 'string') {
            const [hours, minutes] = bookingData.selectedTime.split(':');
            appointmentDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        } else if (bookingData.selectedTime instanceof Date) {
            appointmentDateTime.setHours(
                bookingData.selectedTime.getHours(),
                bookingData.selectedTime.getMinutes(),
                0,
                0
            );
        }

        console.log("Creating appointment with data:", {
            date: appointmentDateTime,
            meetingType: bookingData.meetingType,
            provider: providerId,
            duration: bookingData.duration
        });

        const appointmentData = {
            provider: providerId,
            datetime: appointmentDateTime.toISOString(),
            duration: bookingData.duration,
            meetingType: bookingData.meetingType,
            ...(bookingData.meetingType === "inPerson" && {
                location: bookingData.location.trim()
            }),
            ...(bookingData.notes && {
                notes: bookingData.notes.trim()
            })
        };

        await createAppointment(appointmentData);
        toast.success("Appointment booked successfully!");
        navigate("/client/dashboard");
    } catch (err) {
        console.error("Booking error:", err);
        console.error("Booking data:", bookingData);
        toast.error(err.response?.data?.error || "Failed to book appointment");
        setError("Failed to book appointment. Please try again.");
    } finally {
        setLoading(false);
    }
};


  const renderStepContent = () => {
    switch (currentStep) {
      case "date":
        return (
          <div className="space-y-6">
            <h2 className={`${theme.text.heading} text-xl`}>Select a Date</h2>
            <Calendar
              selectedDate={bookingData.selectedDate}
              onDateSelect={handleDateSelect}
              availableDates={availableDates}
            />
          </div>
        );

        case "time":
          return (
              <div className="space-y-6">
                  <h2 className={`${theme.text.heading} text-xl`}>Select a Time</h2>
                  <ProviderPublicAvailability
                      availableSlots={availableSlots}
                      selectedTime={bookingData.selectedTime}
                      onTimeSelect={handleTimeSelect}
                      meetingTypes={meetingTypes}
                  />
                  <button
                      onClick={() => setCurrentStep("date")}
                      className={`${theme.button.outline} mt-4`}
                  >
                      Back to Date Selection
                  </button>
              </div>
          );

      case "details":
        console.log("Current booking data:", bookingData);
        console.log("Available slots:", availableSlots);

        // Find the selected time slot
        const selectedSlot = availableSlots.find((slot) => {
          const slotTime = new Date();
          const [hours, minutes] = slot.startTime.split(":");
          slotTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
          // Add debug log to see what we're comparing
          console.log("Comparing slots:", {
              slotTime: slotTime.toISOString(),
              selectedTime: bookingData.selectedTime.toISOString(),
              matches: slotTime.getTime() === bookingData.selectedTime.getTime()
          });
  
          return slotTime.getTime() === bookingData.selectedTime.getTime();
      });
  
      console.log("Selected slot:", selectedSlot);

        console.log("Selected slot:", selectedSlot);

        // Get available meeting types from the selected slot
        const availableMeetingTypes = selectedSlot?.availableMeetingTypes || [];
        console.log("Available meeting types:", availableMeetingTypes);

        return (
          <div className="space-y-6">
            {console.log("Current booking data:", bookingData)}
            {console.log("Available slots:", availableSlots)}

            <h2 className={`${theme.text.heading} text-xl`}>
              Appointment Details
            </h2>
            <div className="space-y-4">
              <div>
              <label className={`${theme.text.label} block mb-2`}>
                        Meeting Type
                    </label>
                    <select
                        value={bookingData.meetingType}
                        onChange={(e) =>
                            setBookingData((prev) => ({
                                ...prev,
                                meetingType: e.target.value,
                            }))
                        }
                        className={`${theme.input.default} w-full`}
                    >
                        {meetingTypes
                            .filter((type) => {
                                const isAvailable = availableMeetingTypes.includes(type.value);
                                console.log(`Meeting type ${type.value} available:`, isAvailable);
                                return isAvailable;
                            })
                            .map(({ value, label }) => (
                                <option key={value} value={value}>
                                    {label}
                                </option>
                            ))}
                    </select>
                </div>

              {bookingData.meetingType === "inPerson" && (
                <div>
                  <label className={`${theme.text.label} block mb-2`}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={bookingData.location}
                    onChange={(e) =>
                      setBookingData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    className={`${theme.input.default} w-full`}
                    placeholder="Enter meeting location"
                    required
                  />
                </div>
              )}

              <div>
                <label className={`${theme.text.label} block mb-2`}>
                  Notes (Optional)
                </label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) =>
                    setBookingData((prev) => ({
                      ...prev,
                      notes: e.target.value,
                    }))
                  }
                  className={`${theme.input.default} w-full`}
                  rows="3"
                  placeholder="Any additional notes for the provider"
                />
              </div>

              <div className="flex justify-between">
                <button
                  onClick={() => setCurrentStep("time")}
                  className={theme.button.outline}
                >
                  Back
                </button>
                <button
                  onClick={handleDetailsSubmit}
                  className={theme.button.primary}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        );

      case "confirm":
        return (
          <div className="space-y-6">
            <h2 className={`${theme.text.heading} text-xl`}>
              Confirm Appointment
            </h2>
            <div className={`${theme.card.default} p-6 space-y-4`}>
              <div>
                <h3 className="font-medium text-lg">Provider</h3>
                <p>
                  Dr. {bookingData.provider?.firstName}{" "}
                  {bookingData.provider?.lastName}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-lg">Date & Time</h3>
                <p>{bookingData.selectedDate?.toLocaleDateString()}</p>
                <p>
                  {bookingData.selectedTime?.toLocaleTimeString([], {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-lg">Type</h3>
                <p>
                  {
                    meetingTypes.find(
                      (t) => t.value === bookingData.meetingType
                    )?.label
                  }
                </p>
                {bookingData.meetingType === "inPerson" && (
                  <p>Location: {bookingData.location}</p>
                )}
              </div>
              {bookingData.notes && (
                <div>
                  <h3 className="font-medium text-lg">Notes</h3>
                  <p>{bookingData.notes}</p>
                </div>
              )}
            </div>
            <div className="flex justify-between">
              <button
                onClick={() => setCurrentStep("date")}
                className={`${theme.button.outline} mt-4`}
              >
                Back to Date Selection
              </button>
              <button
                onClick={handleBookAppointment}
                disabled={loading}
                className={`${theme.button.primary} disabled:opacity-50`}
              >
                {loading ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isInitialLoading || !bookingData.provider) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-celestial_blue-500" />
      </div>
    );
  }

  return (
    <div className={theme.layout.container}>
      <div className="max-w-4xl mx-auto py-8">
        {error && (
          <div className={`${theme.status.error} p-4 mb-6 rounded-lg`}>
            {error}
          </div>
        )}

        {/* Provider Info */}
        <div className={`${theme.card.default} p-6 mb-8`}>
          <div className="flex items-center gap-4">
            {bookingData.provider?.profileImage ? (
              <img
                src={bookingData.provider.profileImage}
                alt={bookingData.provider.firstName}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-celestial_blue-100 flex items-center justify-center">
                <span className="text-2xl text-celestial_blue-500">
                  {bookingData.provider?.firstName?.[0]}
                  {bookingData.provider?.lastName?.[0]}
                </span>
              </div>
            )}
            <div>
              <h1 className={`${theme.text.heading} text-2xl mb-1`}>
                Book Appointment with Dr. {bookingData.provider?.firstName}{" "}
                {bookingData.provider?.lastName}
              </h1>
              <p className="text-prussian_blue-400">
                {bookingData.provider?.credentials}
              </p>
            </div>
          </div>
        </div>
        {/* debug */}
        <div className="mb-4 p-4 bg-alice_blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-prussian_blue-500 mb-2">
            Available Dates:
          </h3>
          <div className="text-sm text-prussian_blue-400">
            {availableDates.map((date) => (
              <div key={date.toISOString()}>
                {date.toLocaleDateString()} (
                {date.toLocaleString("en-US", { weekday: "long" })})
              </div>
            ))}
          </div>
        </div>
        {/* Step Content */}
        {renderStepContent()}
      </div>
    </div>
  );
};
