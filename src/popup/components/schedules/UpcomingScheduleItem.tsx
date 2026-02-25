import { Schedule } from '../../../types';
import {
  formatRelativeStartTime,
  repeatLabels,
} from '../../utils/scheduleFormatters';
import ScheduleItemBase from './ScheduleItemBase';

interface UpcomingScheduleItemProps {
  schedule: Schedule;
  onDelete: (id: number) => void;
  onEdit: (schedule: Schedule) => void;
  isLast: boolean;
}

export default function UpcomingScheduleItem({
  schedule,
  onDelete,
  onEdit,
  isLast,
}: UpcomingScheduleItemProps) {
  return (
    <ScheduleItemBase
      schedule={schedule}
      onDelete={onDelete}
      onEdit={onEdit}
      isLast={isLast}
    >
      <div className="flex min-w-0 flex-col">
        <p className="text-sm font-semibold text-gray-900">
          {formatRelativeStartTime(schedule)}
        </p>
        {schedule.repeat !== 'none' && (
          <p className="mt-0.5 text-sm text-gray-700">
            {repeatLabels[schedule.repeat]}
          </p>
        )}
      </div>
    </ScheduleItemBase>
  );
}
