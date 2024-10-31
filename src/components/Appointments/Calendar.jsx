import React, { useEffect } from "react";
import { theme } from "../../styles/theme";
const Calendar = ({ selectedDate, onDateSelect, availableDates = [] }) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  useEffect(() => {
    console.log("Calendar component received props:", {
      selectedDate,
      availableDates: availableDates?.map((d) => d.toISOString()),
      availableDatesCount: availableDates?.length,
    });
  }, [selectedDate, availableDates]);

  // Debug logs
  console.log("Calendar Props:", {
    selectedDate: selectedDate?.toISOString(),
    availableDates: availableDates.map((d) => d.toISOString()),
    currentMonth: currentMonth.toISOString(),
  });

  const formatDateForComparison = (date) => {
    return date.toISOString().split("T")[0];
  };

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const generateDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null); // empty cells before first day
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i)
      );
    }
    return days;
  };

  const isDateAvailable = (date) => {
    // First check if it's not a past date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      console.log("Date is in past:", date.toISOString());
      return false;
    }

    // Check if it's a Monday
    if (date.getDay() !== 1) {
      // 1 represents Monday
      console.log("Not a Monday:", date.toISOString());
      return false;
    }

    // Check if it's in the next 4 weeks
    const fourWeeksFromNow = new Date(today);
    fourWeeksFromNow.setDate(today.getDate() + 28);

    if (date > fourWeeksFromNow) {
      console.log("Date too far in future:", date.toISOString());
      return false;
    }

    console.log("Date is available:", date.toISOString());
    return true;
  };

  // In the render section of Calendar component:
  console.log("Calendar render state:", {
    selectedDate,
    availableDates,
    currentMonth,
  });

  const isSelected = (date) => {
    return date?.toDateString() === selectedDate?.toDateString();
  };

  const isToday = (date) => {
    return date?.toDateString() === new Date().toDateString();
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const changeMonth = (increment) => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + increment);
      return newDate;
    });
  };
  console.log("Calendar render state:", {
    currentMonth: currentMonth.toISOString(),
    availableDates: availableDates.map((d) => ({
      date: d.toISOString(),
      day: d.getDay(),
      dayName: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ][d.getDay()],
    })),
  });
  return (
    <div className={`${theme.card.default} p-4`}>
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeMonth(-1)} className={theme.button.ghost}>
          ←
        </button>
        <h3 className={theme.text.heading}>
          {currentMonth.toLocaleString("default", {
            month: "long",
            year: "numeric",
          })}
        </h3>
        <button onClick={() => changeMonth(1)} className={theme.button.ghost}>
          →
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-sm text-prussian_blue-400 font-medium py-2"
          >
            {day}
          </div>
        ))}

        {generateDays().map((date, index) => (
          <div key={index} className="aspect-square">
            {date && (
              <button
                onClick={() => {
                  console.log("Clicked date:", date.toISOString());
                  console.log("Is available:", isDateAvailable(date));
                  if (isDateAvailable(date)) {
                    onDateSelect(date);
                  }
                }}
                disabled={!isDateAvailable(date)}
                className={`
                                    w-full h-full flex items-center justify-center rounded-lg text-sm
                                    transition-colors
                                    ${
                                      isSelected(date)
                                        ? "bg-celestial_blue-500 text-white"
                                        : ""
                                    }
                                    ${
                                      isToday(date)
                                        ? "ring-2 ring-celestial_blue-500"
                                        : ""
                                    }
                                    ${
                                      !isDateAvailable(date)
                                        ? "text-prussian_blue-300 cursor-not-allowed"
                                        : "hover:bg-celestial_blue-50 text-prussian_blue-500 cursor-pointer"
                                    }
                                `}
              >
                {date.getDate()}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
