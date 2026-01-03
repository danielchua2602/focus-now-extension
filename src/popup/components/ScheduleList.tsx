import { Schedule } from "../../types";

interface ScheduleListProps {
  schedules: Schedule[];
  onDeleteSchedule: (id: number) => void;
}

export default function ScheduleList({ schedules, onDeleteSchedule }: ScheduleListProps) {
  const activeSechedules = [];
  return (
    <div className="min-h-[300px] p-2 shadow-sm">
      <div className="overflow-y-auto">
        {activeSechedules.length === 0 ? (
          <div className="text-center text-gray-400 py-5 text-sm">No active schedules.</div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
