import { Schedule } from '../../../types';
import { ReactNode } from 'react';

interface ScheduleListBaseProps {
  title: string;
  emptyMessage: string;
  schedules: Schedule[];
  renderItem: (schedule: Schedule, isLast: boolean) => ReactNode;
}

export default function ScheduleListBase({
  title,
  emptyMessage,
  schedules,
  renderItem,
}: ScheduleListBaseProps) {
  return (
    <div className="min-h-[300px]">
      <h2 className="mb-3 text-sm font-semibold text-text-primary">{title}</h2>

      <div className="overflow-hidden rounded-sm border">
        <div className="max-h-[300px] overflow-y-auto">
          {schedules.length === 0 ? (
            <div className="py-8 text-center text-sm text-text-muted/60">
              {emptyMessage}
            </div>
          ) : (
            schedules.map((schedule, index) =>
              renderItem(schedule, index === schedules.length - 1)
            )
          )}
        </div>
      </div>
    </div>
  );
}
