import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { theme } from "../../styles/theme";
import {
  getProviderAvailability,
  updateProviderAvailability,
} from "../../services/availabilityService";
import { toast } from "react-toastify";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const meetingTypes = [
  {
    value: "video",
    label: "Video Call",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    value: "phone",
    label: "Phone Call",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
        />
      </svg>
    ),
  },
  {
    value: "inPerson",
    label: "In Person",
    icon: (
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
];

const timeSlots = Array.from({ length: 24 }, (_, i) => ({
  displayTime: `${i % 12 || 12}:00 ${i < 12 ? "AM" : "PM"}`,
  startTime: `${i.toString().padStart(2, "0")}:00`,
  endTime: `${(i + 1).toString().padStart(2, "0")}:00`,
  availableMeetingTypes: [], // Will be populated when slot is selected
}));

const validateAvailability = (availability) => {
  const hasAtLeastOneDay = Object.values(availability).some(
    (day) => day.isAvailable
  );
  if (!hasAtLeastOneDay) {
    throw new Error("Please select at least one day of availability");
  }

  Object.entries(availability).forEach(([day, data]) => {
    if (data.isAvailable) {
      if (!data.timeSlots || data.timeSlots.length === 0) {
        throw new Error(`Please select at least one time slot for ${day}`);
      }

      data.timeSlots.forEach((slot) => {
        if (
          !slot.availableMeetingTypes ||
          slot.availableMeetingTypes.length === 0
        ) {
          throw new Error(
            `Please select at least one meeting type for each time slot on ${day}`
          );
        }
      });
    }
  });
};

const validateTimeSlot = (slot) => {
  const [startHour] = slot.startTime.split(":").map(Number);
  const [endHour] = slot.endTime.split(":").map(Number);

  if (endHour - startHour !== 1) {
    throw new Error("Time slots must be 1 hour in duration");
  }

  if (!Array.isArray(slot.availableMeetingTypes)) {
    throw new Error("Meeting types must be specified");
  }

  const validMeetingTypes = meetingTypes.map((type) => type.value);
  if (
    !slot.availableMeetingTypes.every((type) =>
      validMeetingTypes.includes(type)
    )
  ) {
    throw new Error("Invalid meeting type specified");
  }

  return startHour < endHour && startHour >= 0 && endHour <= 24;
};

export const ProviderAvailability = () => {
  const { user } = useAuth();
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  console.log("ProviderAvailability - Initial user:", user);
  console.log("ProviderAvailability - User ID:", user?._id);
  console.log("ProviderAvailability - User type:", user?.type);
  useEffect(() => {
    if (!user || !user._id) {
      setError("User not found");
      return;
    }
    loadAvailability();
  }, [user]);

  const MeetingTypePopup = ({ day, timeSlot, onSelect, onClose }) => {
    return (
      <div className="absolute z-50 mt-2 bg-white rounded-lg shadow-lg border border-alice_blue-200 p-2 w-48">
        {meetingTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => onSelect(day, timeSlot, type.value)}
            className={`
                          w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm
                          ${
                            isMeetingTypeSelected(day, timeSlot, type.value)
                              ? "bg-celestial_blue-500 text-white"
                              : "text-prussian_blue-500 hover:bg-alice_blue-50"
                          }
                      `}
          >
            {type.icon}
            <span>{type.label}</span>
          </button>
        ))}
      </div>
    );
  };

  const loadAvailability = async () => {
    try {
      setLoading(true);
      const data = await getProviderAvailability(user._id);
      console.log("TEST - Loaded availability data:", data);

      // Initialize all days with empty data
      const formattedData = daysOfWeek.reduce(
        (acc, day) => ({
          ...acc,
          [day]: {
            dayOfWeek: day,
            isAvailable: false,
            timeSlots: [],
          },
        }),
        {}
      );

      // Merge any existing availability data
      if (data && Array.isArray(data)) {
        data.forEach((dayData) => {
          if (dayData.dayOfWeek) {
            formattedData[dayData.dayOfWeek] = {
              ...formattedData[dayData.dayOfWeek],
              ...dayData,
            };
          }
        });
      }

      console.log("TEST - Formatted availability data:", formattedData);
      setAvailability(formattedData);
    } catch (err) {
      const errorMessage = err.message || "Failed to load availability";
      console.error("TEST - Load Error:", err);
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?._id) {
      setError("User not found");
      return;
    }
    loadAvailability(user._id);
  }, [user?._id]);

  const handleDayToggle = (day) => {
    console.log("Toggling day:", day);
    setAvailability((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        isAvailable: !prev[day].isAvailable,
        timeSlots: !prev[day].isAvailable ? [] : prev[day].timeSlots,
      },
    }));
  };

  const handleMeetingTypeToggle = (day, timeSlot, meetingType) => {
    console.log("Toggling meeting type:", { day, timeSlot, meetingType });
    setAvailability((prev) => {
      const currentSlots = prev[day].timeSlots || [];
      const existingSlotIndex = currentSlots.findIndex(
        (slot) =>
          slot.startTime === timeSlot.startTime &&
          slot.endTime === timeSlot.endTime
      );

      if (existingSlotIndex === -1) {
        // If slot doesn't exist, create it with the selected meeting type
        return {
          ...prev,
          [day]: {
            ...prev[day],
            timeSlots: [
              ...currentSlots,
              {
                ...timeSlot,
                availableMeetingTypes: [meetingType],
                isBooked: false,
              },
            ].sort((a, b) => a.startTime.localeCompare(b.startTime)),
          },
        };
      }

      // If slot exists, toggle the meeting type
      const updatedSlots = [...currentSlots];
      const currentSlot = updatedSlots[existingSlotIndex];
      const hasType = currentSlot.availableMeetingTypes.includes(meetingType);

      if (hasType) {
        // Remove the meeting type if it's the last one, remove the whole slot
        if (currentSlot.availableMeetingTypes.length === 1) {
          updatedSlots.splice(existingSlotIndex, 1);
        } else {
          currentSlot.availableMeetingTypes =
            currentSlot.availableMeetingTypes.filter(
              (type) => type !== meetingType
            );
        }
      } else {
        // Add the meeting type
        currentSlot.availableMeetingTypes = [
          ...currentSlot.availableMeetingTypes,
          meetingType,
        ];
      }

      return {
        ...prev,
        [day]: {
          ...prev[day],
          timeSlots: updatedSlots.sort((a, b) =>
            a.startTime.localeCompare(b.startTime)
          ),
        },
      };
    });
  };

  const hasSelectedMeetingTypes = (day, timeSlot) => {
    const dayData = availability[day];
    if (!dayData?.timeSlots) return false;

    const slot = dayData.timeSlots.find(
      (slot) =>
        slot.startTime === timeSlot.startTime &&
        slot.endTime === timeSlot.endTime
    );

    return slot && slot.availableMeetingTypes.length > 0;
  };

  const isMeetingTypeSelected = (day, timeSlot, meetingType) => {
    const dayData = availability[day];
    if (!dayData?.timeSlots) return false;

    const slot = dayData.timeSlots.find(
      (slot) =>
        slot.startTime === timeSlot.startTime &&
        slot.endTime === timeSlot.endTime
    );

    return slot && slot.availableMeetingTypes.includes(meetingType);
  };

  const handleSave = async () => {
    try {
        setLoading(true);
        setError(null);

        const availabilityData = Object.values(availability)
            .filter(day => day.isAvailable)
            .map(day => ({
                dayOfWeek: day.dayOfWeek,
                isAvailable: true,
                timeSlots: day.timeSlots.map(slot => ({
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    isBooked: Boolean(slot.isBooked),
                    availableMeetingTypes: Array.isArray(slot.availableMeetingTypes) 
                        ? slot.availableMeetingTypes 
                        : []
                }))
            }));

        console.log('Sending availability data:', JSON.stringify(availabilityData, null, 2));
        
        // Validate data before sending
        if (!Array.isArray(availabilityData)) {
            throw new Error('Availability data must be an array');
        }

        availabilityData.forEach(day => {
            if (!day.dayOfWeek || !Array.isArray(day.timeSlots)) {
                throw new Error(`Invalid data format for day: ${day.dayOfWeek}`);
            }
        });

        await updateProviderAvailability(availabilityData);
        toast.success('Availability updated successfully');
        await loadAvailability();
    } catch (err) {
        console.error('Save Error:', {
            message: err.message,
            response: err.response?.data,
            data: err.response?.data
        });
        const errorMessage = err.response?.data?.message || err.message || 'Failed to update availability';
        setError(errorMessage);
        toast.error(errorMessage);
    } finally {
        setLoading(false);
    }
};




  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-celestial_blue-500" />
      </div>
    );
  }

  const renderTimeSlot = (day, timeSlot) => {
    const isBooked = availability[day]?.timeSlots.some(
      (slot) => slot.startTime === timeSlot.startTime && slot.isBooked
    );
    const hasTypes = hasSelectedMeetingTypes(day, timeSlot);
    const isSelected =
      selectedTimeSlot &&
      selectedTimeSlot.day === day &&
      selectedTimeSlot.time.startTime === timeSlot.startTime;

    return (
      <div className="relative" key={timeSlot.startTime}>
        <button
          onClick={() =>
            setSelectedTimeSlot(isSelected ? null : { day, time: timeSlot })
          }
          disabled={isBooked}
          className={`
                    w-full px-3 py-2 rounded-lg text-sm transition-colors
                    ${
                      isBooked
                        ? `${theme.button.disabled} cursor-not-allowed`
                        : hasTypes
                        ? "bg-celestial_blue-500 text-white"
                        : "bg-alice_blue-100 text-prussian_blue-500 hover:bg-alice_blue-200"
                    }
                `}
        >
          <div className="flex flex-col items-center">
            <span>{timeSlot.displayTime}</span>
            {hasTypes && (
              <div className="flex gap-1 mt-1">
                {meetingTypes.map(
                  (type) =>
                    isMeetingTypeSelected(day, timeSlot, type.value) && (
                      <span key={type.value} className="text-xs">
                        {type.icon}
                      </span>
                    )
                )}
              </div>
            )}
            {isBooked && <span className="text-xs mt-1">(Booked)</span>}
          </div>
        </button>

        {isSelected && !isBooked && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setSelectedTimeSlot(null)}
            />
            <MeetingTypePopup
              day={day}
              timeSlot={timeSlot}
              onSelect={(day, timeSlot, meetingType) => {
                handleMeetingTypeToggle(day, timeSlot, meetingType);
              }}
              onClose={() => setSelectedTimeSlot(null)}
            />
          </>
        )}
      </div>
    );
  };
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl border border-alice_blue-200 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold text-prussian_blue-500">
              Manage Your Availability
            </h2>
            <div className="p-2 rounded-lg bg-alice_blue-50">
              <svg
                className="w-5 h-5 text-celestial_blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-celestial_blue-500 text-white rounded-lg hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Save Changes
              </>
            )}
          </button>
        </div>

        {error && (
          <div className={`${theme.status.error} p-4 mb-6 rounded-lg`}>
            {error}
          </div>
        )}

        {/* Guidelines Section */}
        <div className="mb-6">
          <div className="bg-alice_blue-50 rounded-xl p-5 border border-alice_blue-200">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-white">
                <svg
                  className="w-5 h-5 text-celestial_blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-prussian_blue-500 mb-3">
                  Guidelines
                </h3>
                <ul className="space-y-2">
                  {[
                    "Select at least one day of availability",
                    "For each available day, select one or more time slots",
                    "Choose meeting types (Video, Phone, In-Person) for each time slot",
                    "Time slots are in one-hour increments",
                    "Booked time slots cannot be modified",
                  ].map((guideline, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm text-prussian_blue-400"
                    >
                      <svg
                        className="w-4 h-4 text-celestial_blue-500 flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      {guideline}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Time Slots Section */}
        <div className="space-y-6">
          {daysOfWeek.map((day) => (
            <div
              key={day}
              className="border border-alice_blue-200 rounded-xl p-6 transition-all duration-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDayToggle(day)}
                      className={`
                px-4 py-2 rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md
                flex items-center gap-2
                ${
                  availability[day]?.isAvailable
                    ? "bg-celestial_blue-500 text-white"
                    : "bg-white border border-alice_blue-200 text-prussian_blue-500"
                }
              `}
                    >
                      {/* Calendar Icon */}
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {day}
                    </button>
                    <span
                      className={`
              px-3 py-1 rounded-full text-sm font-medium
              ${
                availability[day]?.isAvailable
                  ? "bg-celadon-100 text-celadon-700"
                  : "bg-alice_blue-100 text-alice_blue-700"
              }
            `}
                    >
                      {availability[day]?.isAvailable
                        ? "Available"
                        : "Unavailable"}
                    </span>
                  </div>
                </div>

                {availability[day]?.isAvailable && (
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-alice_blue-50">
                      <svg
                        className="w-4 h-4 text-celestial_blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-prussian_blue-400">
                      {availability[day]?.timeSlots.length} time slots selected
                    </span>
                  </div>
                )}
              </div>

              {/* Time Slots Grid */}
              {availability[day]?.isAvailable && (
                <div className="mt-4 bg-alice_blue-50 rounded-xl p-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {timeSlots.map((timeSlot) => {
                      const isBooked = availability[day]?.timeSlots.some(
                        (slot) =>
                          slot.startTime === timeSlot.startTime && slot.isBooked
                      );
                      const hasTypes = hasSelectedMeetingTypes(day, timeSlot);
                      const isSelected =
                        selectedTimeSlot &&
                        selectedTimeSlot.day === day &&
                        selectedTimeSlot.time.startTime === timeSlot.startTime;

                      return (
                        <div className="relative" key={timeSlot.startTime}>
                          <button
                            onClick={() =>
                              !isBooked &&
                              setSelectedTimeSlot(
                                isSelected ? null : { day, time: timeSlot }
                              )
                            }
                            disabled={isBooked}
                            className={`
                w-full p-3 rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md
                ${
                  isBooked
                    ? "bg-alice_blue-100 cursor-not-allowed"
                    : hasTypes
                    ? "bg-white border-2 border-celestial_blue-500 text-celestial_blue-500"
                    : "bg-white border border-alice_blue-200 text-prussian_blue-500 hover:border-celestial_blue-300"
                }
              `}
                          >
                            <div className="flex flex-col items-center">
                              {/* Time Display */}
                              <div className="flex items-center gap-2 mb-1">
                                <svg
                                  className="w-4 h-4 text-celestial_blue-500"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span className="font-medium">
                                  {timeSlot.displayTime}
                                </span>
                              </div>

                              {/* Meeting Type Icons */}
                              {hasTypes && (
                                <div className="flex gap-2 mt-2 p-1 bg-alice_blue-50 rounded-lg">
                                  {meetingTypes.map(
                                    (type) =>
                                      isMeetingTypeSelected(
                                        day,
                                        timeSlot,
                                        type.value
                                      ) && (
                                        <div
                                          key={type.value}
                                          className="text-celestial_blue-500 tooltip"
                                          title={type.label}
                                        >
                                          {type.icon}
                                        </div>
                                      )
                                  )}
                                </div>
                              )}

                              {/* Booked Status */}
                              {isBooked && (
                                <div className="mt-2 flex items-center gap-1 text-xs text-prussian_blue-400">
                                  <svg
                                    className="w-3 h-3"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                    />
                                  </svg>
                                  Booked
                                </div>
                              )}
                            </div>
                          </button>

                          {/* Meeting Type Selection Popup */}
                          {isSelected && !isBooked && (
                            <>
                              <div
                                className="fixed inset-0 z-40 bg-prussian_blue-500/20 backdrop-blur-sm"
                                onClick={() => setSelectedTimeSlot(null)}
                              />
                              <div className="absolute z-50 mt-2 right-0 bg-white rounded-xl shadow-lg border border-alice_blue-200 p-3 w-56">
                                <div className="mb-2 pb-2 border-b border-alice_blue-200">
                                  <div className="text-sm font-medium text-prussian_blue-500">
                                    Select Meeting Types
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  {meetingTypes.map((type) => (
                                    <button
                                      key={type.value}
                                      onClick={() =>
                                        handleMeetingTypeToggle(
                                          day,
                                          timeSlot,
                                          type.value
                                        )
                                      }
                                      className={`
                          w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-300
                          ${
                            isMeetingTypeSelected(day, timeSlot, type.value)
                              ? "bg-celestial_blue-500 text-white"
                              : "text-prussian_blue-500 hover:bg-alice_blue-50"
                          }
                        `}
                                    >
                                      {type.icon}
                                      <span>{type.label}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
