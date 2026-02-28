import { useState } from 'react';
import { Schedule, ScheduleTab } from '../types';
import { getCurrentDateTime, isScheduleActive } from '../lib/scheduleUtils';
import ActiveScheduleList from './components/schedules/ActiveScheduleList';
import UpcomingScheduleList from './components/schedules/UpcomingScheduleList';
import './App.css';
import NavigationBar from './components/layout/NavigationBar';
import { Header } from './components/layout/Header';
import AddScheduleModal from './components/schedules/AddScheduleModal';
import EditScheduleModal from './components/schedules/EditScheduleModal';
import Toast from './components/ui/Toast';
import clsx from 'clsx';
import { useSchedules } from './hooks/useSchedules';
import { useDarkMode } from './hooks/useDarkMode';
import { useToast } from './hooks/useToast';

function App() {
  const [activeTab, setActiveTab] = useState<ScheduleTab>('Active');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  const { schedules, addSchedule, deleteSchedule, updateSchedule } =
    useSchedules();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { message: successMessage, showToast, dismissToast } = useToast();

  const handleAddScheduleClick = (schedule: Omit<Schedule, 'id'>) => {
    addSchedule(schedule);
    setIsModalOpen(false);
    showToast('Schedule added successfully!');
  };

  const handleEditScheduleClick = (schedule: Schedule) => {
    setEditingSchedule(schedule);
    setIsEditModalOpen(true);
  };

  const handleUpdateSchedule = (
    id: number,
    updatedSchedule: Omit<Schedule, 'id'>
  ) => {
    updateSchedule(id, updatedSchedule);
    setIsEditModalOpen(false);
    setEditingSchedule(null);
    showToast('Schedule updated successfully!');
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingSchedule(null);
  };

  const { currentDate, currentTime } = getCurrentDateTime();

  const activeScheduleList = schedules.filter((schedule) =>
    isScheduleActive(schedule)
  );

  const upcomingScheduleList = schedules.filter((schedule) => {
    // Schedule starts in the future
    if (schedule.startDate > currentDate) {
      return true;
    }

    // Schedule starts today but hasn't started yet
    if (
      schedule.startDate === currentDate &&
      schedule.startTime > currentTime
    ) {
      return true;
    }

    return false;
  });

  return (
    <div className={clsx({ dark: isDarkMode })}>
      <div className="relative bg-background">
        <Toast message={successMessage} type="success" onClose={dismissToast} />
        <Header isDarkMode={isDarkMode} onToggleDarkMode={toggleDarkMode} />
        <NavigationBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onAddSchedule={() => setIsModalOpen(true)}
        />
        <main className="px-8 py-5">
          {activeTab === 'Active' && (
            <ActiveScheduleList
              schedules={activeScheduleList}
              onDeleteSchedule={deleteSchedule}
              onEditSchedule={handleEditScheduleClick}
            />
          )}
          {activeTab === 'Upcoming' && (
            <UpcomingScheduleList
              schedules={upcomingScheduleList}
              onDeleteSchedule={deleteSchedule}
              onEditSchedule={handleEditScheduleClick}
            />
          )}
        </main>
        <footer className="h-10 bg-primary" />
        <AddScheduleModal
          open={isModalOpen}
          onAdd={handleAddScheduleClick}
          onCancel={() => setIsModalOpen(false)}
          schedules={schedules}
        />
        <EditScheduleModal
          open={isEditModalOpen}
          schedule={editingSchedule}
          onEdit={handleUpdateSchedule}
          onCancel={handleCancelEdit}
          schedules={schedules}
        />
      </div>
    </div>
  );
}

export default App;
