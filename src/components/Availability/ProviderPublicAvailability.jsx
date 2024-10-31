import React from 'react';
import { theme } from "../../styles/theme";

export const ProviderPublicAvailability = ({ 
  availableSlots, 
  selectedTime,
  onTimeSelect,
  meetingTypes 
}) => {
    console.log('ProviderPublicAvailability - Props:', {
        availableSlots,
        selectedTime,
        meetingTypes
      });
  const groupedSlots = availableSlots.reduce((acc, slot) => {
    const hour = new Date(slot).getHours();
    if (!acc[hour]) {
      acc[hour] = [];
    }
    acc[hour].push(slot);
    return acc;
  }, {});

  console.log('ProviderPublicAvailability - Grouped slots:', groupedSlots);

  // Helper function to get meeting type icon
  const getMeetingTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        );
      case 'phone':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        );
      case 'inPerson':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {Object.entries(groupedSlots).map(([hour, slots]) => (
          <div key={hour} className="space-y-2">
            {slots.map((slot) => {
              const slotTime = new Date(slot);
              const isSelected = selectedTime && 
                selectedTime.getTime() === slotTime.getTime();

              // Get available meeting types for this slot
              const availableTypes = slot.availableMeetingTypes || meetingTypes.map(type => type.value);

              return (
                <button
                  key={slot}
                  onClick={() => onTimeSelect(slotTime)}
                  className={`
                    w-full p-3 rounded-lg transition-all duration-300 
                    hover:-translate-y-0.5 hover:shadow-md
                    ${
                      isSelected
                        ? "bg-celestial_blue-500 text-white"
                        : "bg-white border border-alice_blue-200 text-prussian_blue-500"
                    }
                  `}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="font-medium">
                      {slotTime.toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                    {/* Meeting type icons */}
                    <div className="flex gap-2">
                      {availableTypes.map(type => (
                        <div 
                          key={type}
                          className={`${
                            isSelected ? 'text-white' : 'text-celestial_blue-500'
                          }`}
                          title={meetingTypes.find(t => t.value === type)?.label}
                        >
                          {getMeetingTypeIcon(type)}
                        </div>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {availableSlots.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-alice_blue-50 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-celestial_blue-500"
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
          <p className="text-prussian_blue-400 mb-2">No available time slots</p>
          <p className="text-sm text-prussian_blue-300">
            Please try selecting a different date
          </p>
        </div>
      )}
    </div>
  );
};
