import { useState } from "react";
import { Schedule } from "../../types";

interface ScheduleFormProps {
  onSaveSchedule: (schedule: Omit<Schedule, "id">) => void;
}

export default function ScheduleForm({ onSaveSchedule }: ScheduleFormProps) {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [allDay, setAllDay] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!date) {
      alert("Please select a date");
      return;
    }

    if (!allDay && startTime >= endTime) {
      alert("End time must be after start time");
      return;
    }

    onSaveSchedule({
      date,
      allDay,
      startTime: allDay ? "00:00" : startTime,
      endTime: allDay ? "23:59" : endTime,
    });

    // Reset form
    setAllDay(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg mb-4 shadow-sm">
      <h2 className="text-base font-semibold mb-3 text-gray-700">Schedule</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            // value={input}
            // onChange={(e) => setInput(e.target.value)}
            placeholder="example.com"
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-600"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 active:bg-blue-800"
          >
            Add
          </button>
        </div>
        <div className="mb-3">
          <label htmlFor="dateInput" className="block mb-1.5 text-sm font-medium text-gray-700">
            Select Date:
          </label>
          <input
            type="date"
            id="dateInput"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={today}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-600"
          />
        </div>
        <div className="mb-3">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={allDay}
              onChange={(e) => setAllDay(e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-12 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-600 transition-colors">
              <div className="absolute w-5 h-5 bg-white rounded-full top-0.5 left-0.5 peer-checked:translate-x-6 transition-transform"></div>
            </div>
            <span className="ml-2.5 text-sm font-medium">Block All Day</span>
          </label>
        </div>

        <div className={`grid grid-cols-2 gap-3 ${allDay ? "hidden" : ""}`}>
          <div className="mb-3">
            <label htmlFor="startTime" className="block mb-1.5 text-sm font-medium text-gray-700">
              Start Time:
            </label>
            <input
              type="time"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-600"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="endTime" className="block mb-1.5 text-sm font-medium text-gray-700">
              End Time:
            </label>
            <input
              type="time"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-blue-600"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2.5 mt-3 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 active:bg-blue-800"
        >
          Save Schedule
        </button>
      </form>
    </div>
  );
}
