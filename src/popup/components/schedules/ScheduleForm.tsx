import { Schedule } from '../../../types';
import { useScheduleForm } from '../../hooks/useScheduleForm';

interface ScheduleFormProps {
  onSaveSchedule: (schedule: Omit<Schedule, 'id'>) => void;
  schedules: Schedule[];
  setError: (error: string | null) => void;
  initialSchedule?: Schedule;
}

export default function ScheduleForm({
  onSaveSchedule,
  schedules,
  setError,
  initialSchedule,
}: ScheduleFormProps) {
  const { formState, handlers, today } = useScheduleForm(
    schedules,
    onSaveSchedule,
    setError,
    initialSchedule
  );
  const { website, allDay, startDate, startTime, endDate, endTime, repeat } =
    formState;
  const {
    setWebsite,
    setAllDay,
    setStartDate,
    setStartTime,
    setEndDate,
    setEndTime,
    setRepeat,
    handleSubmit,
  } = handlers;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-text-secondary">
          Website to Block
        </label>
        <input
          type="text"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          placeholder="example.com"
          className="w-full border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
        />
      </div>

      <div>
        <label className="group flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={allDay}
            onChange={(e) => setAllDay(e.target.checked)}
            className="sr-only"
          />
          <span className="mr-2.5 text-sm font-medium text-text-secondary">
            All-day
          </span>
          <div
            className={`relative h-6 w-12 rounded-full border-2 border-transparent transition-colors group-focus-within:border-primary ${allDay ? 'bg-primary' : 'bg-border'}`}
          >
            {/* The ball */}
            <div
              className={`absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform ${
                allDay && 'translate-x-6'
              }`}
            ></div>
          </div>
        </label>
      </div>

      {!allDay && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={today}
                className="w-full border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                Start Time
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="w-full border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                End Time
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
              />
            </div>
          </div>
        </>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-text-secondary">
          Repeat
        </label>
        <select
          value={repeat}
          onChange={(e) => setRepeat(e.target.value as typeof repeat)}
          className="w-full border border-border bg-background px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
        >
          <option value="none">Does not repeat</option>
          <option value="daily">Daily</option>
          <option value="weekdays">Weekdays (Mon-Fri)</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full rounded bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
      >
        Save Schedule
      </button>
    </form>
  );
}
