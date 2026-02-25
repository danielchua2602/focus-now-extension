import { useState, useEffect } from 'react';
import { Schedule, ScheduleTab, ExtensionMessage } from '../types';
import { storage } from '../lib/storage';
import { isScheduleActive } from '../lib/scheduleUtils';
import ActiveScheduleList from './components/schedules/ActiveScheduleList';
import UpcomingScheduleList from './components/schedules/UpcomingScheduleList';
import './App.css';
import NavigationBar from './components/layout/NavigationBar';
import { Header } from './components/layout/Header';
import AddScheduleModal from './components/schedules/AddScheduleModal';
import EditScheduleModal from './components/schedules/EditScheduleModal';
import Toast from './components/ui/Toast';
import clsx from 'clsx';

function App() {
  const [activeTab, setActiveTab] = useState<ScheduleTab>('Active');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    const loadData = async () => {
      const data = await storage.get(['blockedWebsites', 'schedules']);
      setSchedules(data.schedules || []);
    };

    loadData();

    // Listen for storage changes (e.g., when background removes completed schedules)
    const handleStorageChange = (
      changes: { [key: string]: chrome.storage.StorageChange },
      areaName: string
    ) => {
      if (areaName === 'sync' && changes.schedules) {
        setSchedules(changes.schedules.newValue || []);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);
    return () => chrome.storage.onChanged.removeListener(handleStorageChange);
  }, []);

  // Persist dark mode preference
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const addSchedule = async (schedule: Omit<Schedule, 'id'>) => {
    const newSchedule: Schedule = {
      ...schedule,
      id: Date.now(),
    };

    const newSchedules = [...schedules, newSchedule];
    await storage.set({ schedules: newSchedules });
    setSchedules(newSchedules);
    // showStatus("Schedule saved", "success");
    chrome.runtime.sendMessage<ExtensionMessage>({ action: 'updateRules' });
  };

  const deleteSchedule = async (id: number) => {
    const newSchedules = schedules.filter((s) => s.id !== id);
    await storage.set({ schedules: newSchedules });
    setSchedules(newSchedules);
    // showStatus("Schedule deleted", "success");
    chrome.runtime.sendMessage<ExtensionMessage>({ action: 'updateRules' });
  };

  const updateSchedule = async (
    id: number,
    updatedSchedule: Omit<Schedule, 'id'>
  ) => {
    const newSchedules = schedules.map((schedule) =>
      schedule.id === id ? { ...updatedSchedule, id } : schedule
    );
    await storage.set({ schedules: newSchedules });
    setSchedules(newSchedules);
    chrome.runtime.sendMessage<ExtensionMessage>({ action: 'updateRules' });
  };

  const handleAddScheduleClick = (schedule: Omit<Schedule, 'id'>) => {
    addSchedule(schedule);
    setIsModalOpen(false);
    setSuccessMessage('Schedule added successfully!');

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
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
    setSuccessMessage('Schedule updated successfully!');

    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingSchedule(null);
  };

  const now = new Date();
  const currentDate = now.toLocaleDateString('en-CA');
  const currentTime = now.toTimeString().slice(0, 5);

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
        <Toast
          message={successMessage}
          type="success"
          onClose={() => setSuccessMessage(null)}
        />
        <Header
          isDarkMode={isDarkMode}
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
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
