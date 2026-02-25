import { Schedule } from '../../../types';
import ScheduleListBase from './ScheduleListBase';
import UpcomingScheduleItem from './UpcomingScheduleItem';

interface UpcomingScheduleListProps {
  schedules: Schedule[];
  onDeleteSchedule: (id: number) => void;
  onEditSchedule: (schedule: Schedule) => void;
}

export default function UpcomingScheduleList({
  schedules,
  onDeleteSchedule,
  onEditSchedule,
}: UpcomingScheduleListProps) {
  return (
    <ScheduleListBase
      title="Upcoming Schedules"
      emptyMessage="No upcoming schedules."
      schedules={schedules}
      renderItem={(schedule, isLast) => (
        <UpcomingScheduleItem
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
