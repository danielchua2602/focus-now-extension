import { useState } from 'react';
import { Schedule } from '../../../types';
import ScheduleForm from './ScheduleForm';
import ModalBase from '../ui/ModalBase';

interface AddScheduleModalProps {
  open: boolean;
  onAdd: (schedule: Omit<Schedule, 'id'>) => void;
  onCancel: () => void;
  schedules: Schedule[];
}

export default function AddScheduleModal({
  open,
  onAdd,
  onCancel,
  schedules,
}: AddScheduleModalProps) {
  const [error, setError] = useState<string | null>(null);

  return (
    <ModalBase
      open={open}
      title="Add Schedule"
      onClose={onCancel}
      error={error}
      onErrorClose={() => setError(null)}
    >
      <ScheduleForm
        onSaveSchedule={onAdd}
        schedules={schedules}
        setError={setError}
      />
    </ModalBase>
  );
}
