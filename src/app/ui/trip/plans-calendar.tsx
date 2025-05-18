'use client'

import { Trip, Destination, Activity } from '@/src/app/lib/types';
import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PlansCalendarProps {
  trip: Trip;
  destinations: Destination[];
  activities: Activity[];
}

export function PlansCalendar({ trip, destinations, activities }: PlansCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date(trip.start_date));

  // Get all months that the trip spans
  const getTripMonths = () => {
    const months = [];
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    let current = new Date(start.getFullYear(), start.getMonth(), 1);

    while (current <= end) {
      months.push(new Date(current));
      current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    }

    return months;
  };

  const tripMonths = getTripMonths();
  const currentMonthIndex = tripMonths.findIndex(
    month => month.getMonth() === currentMonth.getMonth() && month.getFullYear() === currentMonth.getFullYear()
  );

  const goToPreviousMonth = () => {
    if (currentMonthIndex > 0) {
      setCurrentMonth(tripMonths[currentMonthIndex - 1]);
    }
  };

  const goToNextMonth = () => {
    if (currentMonthIndex < tripMonths.length - 1) {
      setCurrentMonth(tripMonths[currentMonthIndex + 1]);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    return { daysInMonth, startingDay };
  };

  const isDateInRange = (date: Date, start: Date, end: Date) => {
    return date >= start && date <= end;
  };

  const getDestinationForDate = (date: Date) => {
    return destinations.find(dest => 
      isDateInRange(date, new Date(dest.start_date), new Date(dest.end_date))
    );
  };

  const getActivitiesForDate = (date: Date) => {
    return activities.filter(activity => {
      const activityDate = new Date(activity.activity_date);
      return activityDate.toDateString() === date.toDateString();
    });
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const { daysInMonth, startingDay } = getDaysInMonth(currentMonth);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={goToPreviousMonth}
          disabled={currentMonthIndex === 0}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-semibold">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          onClick={goToNextMonth}
          disabled={currentMonthIndex === tripMonths.length - 1}
          className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
        {Array.from({ length: startingDay }).map((_, i) => (
          <div key={`empty-${i}`} className="h-16" />
        ))}
        {days.map(day => {
          const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
          const destination = getDestinationForDate(date);
          const isInTripRange = isDateInRange(date, new Date(trip.start_date), new Date(trip.end_date));
          const isSelected = selectedDate?.toDateString() === date.toDateString();
          const hasActivities = getActivitiesForDate(date).length > 0;

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(date)}
              className={`
                h-16 p-2 border rounded-lg text-left relative
                ${isInTripRange ? 'hover:bg-gray-50' : 'opacity-50'}
                ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                ${destination ? 'bg-blue-50' : ''}
              `}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <div className="font-medium">{day}</div>
                {hasActivities && (
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Activities Table */}
      {selectedDate && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">
            Activities for {selectedDate.toLocaleDateString()}
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getActivitiesForDate(selectedDate).map(activity => (
                  <tr key={activity.activity_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(activity.activity_date).toLocaleTimeString('en-US', {
                        timeZone: 'UTC',
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {activity.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.category}
                    </td>
                  </tr>
                ))}
                {getActivitiesForDate(selectedDate).length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-center text-sm text-gray-500">
                      No activities planned for this day
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 