import { useState, useEffect } from 'react';
import { Schedule, ExtensionMessage } from '../../types';
import { storage } from '../../lib/storage';

export function useSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

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

  const addSchedule = async (schedule: Omit<Schedule, 'id'>) => {
    const newSchedule: Schedule = {
      ...schedule,
      id: Date.now(),
    };

    const newSchedules = [...schedules, newSchedule];
    await storage.set({ schedules: newSchedules });
    setSchedules(newSchedules);
    chrome.runtime.sendMessage<ExtensionMessage>({ action: 'updateRules' });
  };

  const deleteSchedule = async (id: number) => {
    const newSchedules = schedules.filter((s) => s.id !== id);
    await storage.set({ schedules: newSchedules });
    setSchedules(newSchedules);
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

  return { schedules, addSchedule, deleteSchedule, updateSchedule };
}
