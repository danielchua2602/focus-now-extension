import { Schedule } from '../../../types';
import ActiveScheduleItem from './ActiveScheduleItem';
import ScheduleListBase from './ScheduleListBase';

interface ActiveScheduleListProps {
  schedules: Schedule[];
  onDeleteSchedule: (id: number) => void;
  onEditSchedule: (schedule: Schedule) => void;
}

export default function ActiveScheduleList({
  schedules,
  onDeleteSchedule,
  onEditSchedule,
}: ActiveScheduleListProps) {
  return (
    <ScheduleListBase
      title="Active Schedules"
      emptyMessage="No active schedules."
      schedules={schedules}
      renderItem={(schedule, isLast) => (
        <ActiveScheduleItem
          key={schedule.id}
          schedule={schedule}
          onDelete={onDeleteSchedule}
          onEdit={onEditSchedule}
          isLast={isLast}
        />
      )}
    />
  );
}
