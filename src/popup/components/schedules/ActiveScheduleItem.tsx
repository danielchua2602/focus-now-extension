import { Schedule } from '../../../types';
import {
  formatScheduleDateTime,
  repeatLabels,
} from '../../utils/scheduleFormatters';
import ScheduleItemBase from './ScheduleItemBase';

interface ActiveScheduleItemProps {
  schedule: Schedule;
  onDelete: (id: number) => void;
  onEdit: (schedule: Schedule) => void;
  isLast: boolean;
}

export default function ActiveScheduleItem({
  schedule,
  onDelete,
  onEdit,
  isLast,
}: ActiveScheduleItemProps) {
  return (
    <ScheduleItemBase
      schedule={schedule}
      onDelete={onDelete}
      onEdit={onEdit}
      isLast={isLast}
    >
      <div className="flex min-w-0 flex-col">
        <p className="text-sm font-semibold text-gray-900">
          {formatScheduleDateTime(schedule)}
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
