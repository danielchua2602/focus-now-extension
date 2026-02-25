import { useState } from 'react';
import { Schedule } from '../../../types';
import ScheduleForm from './ScheduleForm';
import ModalBase from '../ui/ModalBase';

interface EditScheduleModalProps {
  open: boolean;
  schedule: Schedule | null;
  onEdit: (id: number, schedule: Omit<Schedule, 'id'>) => void;
  onCancel: () => void;
  schedules: Schedule[];
}

export default function EditScheduleModal({
  open,
  schedule,
  onEdit,
  onCancel,
  schedules,
}: EditScheduleModalProps) {
  const [error, setError] = useState<string | null>(null);

  if (!schedule) return null;

  const handleSave = (updatedSchedule: Omit<Schedule, 'id'>) => {
    onEdit(schedule.id, updatedSchedule);
  };

  return (
    <ModalBase
      open={open}
      title="Edit Schedule"
      onClose={onCancel}
      error={error}
      onErrorClose={() => setError(null)}
    >
      <ScheduleForm
        onSaveSchedule={handleSave}
        schedules={schedules}
        setError={setError}
        initialSchedule={schedule}
      />
    </ModalBase>
  );
}
