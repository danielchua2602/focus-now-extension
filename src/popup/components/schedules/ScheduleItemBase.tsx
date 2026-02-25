import { ReactNode } from 'react';
import { Schedule } from '../../../types';
import { getFaviconUrl } from '../../utils/scheduleFormatters';

interface ScheduleItemBaseProps {
  schedule: Schedule;
  onDelete: (id: number) => void;
  onEdit: (schedule: Schedule) => void;
  isLast: boolean;
  children: ReactNode;
}

export default function ScheduleItemBase({
  schedule,
  onDelete,
  onEdit,
  isLast,
  children,
}: ScheduleItemBaseProps) {
  return (
    <div className={`p-3 ${!isLast ? 'border-b border-gray-100' : ''}`}>
      <div className="flex flex-col gap-2">
        {/* Website icon and name */}
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <img
              src={getFaviconUrl(schedule.website)}
              alt={`Favicon of ${schedule.website}`}
              className="h-8 w-8 rounded"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239CA3AF'%3E%3Cpath d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z'/%3E%3C/svg%3E";
              }}
            />
          </div>
          <p className="ml-3 flex-1 truncate text-gray-600">
            {schedule.website}
          </p>
          <button
            onClick={() => onEdit(schedule)}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600"
            title="Edit schedule"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5"
            >
              <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
              <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(schedule.id)}
            className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600"
            title="Delete schedule"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>
        {/* Schedule date and time - passed as children */}
        {children}
      </div>
    </div>
  );
}
