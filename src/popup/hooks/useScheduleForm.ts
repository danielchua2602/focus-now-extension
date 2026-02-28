import React, { useState } from 'react';
import { Schedule } from '../../types';
import { getCurrentDateTime } from '../../lib/scheduleUtils';

interface UseScheduleFormReturn {
  formState: {
    website: string;
    allDay: boolean;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    repeat: Schedule['repeat'];
  };
  handlers: {
    setWebsite: (value: string) => void;
    setAllDay: (value: boolean) => void;
    setStartDate: (value: string) => void;
    setStartTime: (value: string) => void;
    setEndDate: (value: string) => void;
    setEndTime: (value: string) => void;
    setRepeat: (value: Schedule['repeat']) => void;
    handleSubmit: (e: React.FormEvent) => void;
  };
  today: string;
}

export function useScheduleForm(
  schedules: Schedule[],
  onSaveSchedule: (schedule: Omit<Schedule, 'id'>) => void,
  setError: (error: string | null) => void,
  initialSchedule?: Schedule
): UseScheduleFormReturn {
  const { currentDate: today, currentTime } = getCurrentDateTime();

  const [website, setWebsite] = useState(initialSchedule?.website ?? '');
  const [allDay, setAllDay] = useState(initialSchedule?.allDay ?? false);
  const [startDate, setStartDate] = useState(
    initialSchedule?.startDate ?? today
  );
  const [startTime, setStartTime] = useState(
    initialSchedule?.startTime ?? currentTime
  );
  const [endDate, setEndDate] = useState(initialSchedule?.endDate ?? today);
  const [endTime, setEndTime] = useState(
    initialSchedule?.endTime ?? currentTime
  );
  const [repeat, setRepeat] = useState<Schedule['repeat']>(
    initialSchedule?.repeat ?? 'none'
  );

  const cleanWebsite = (url: string): string => {
    // Remove protocol (http://, https://), www, and any path
    return url.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  };

  const validateWebsite = (url: string): boolean => {
    if (!url.trim()) {
      return false;
    }

    // Basic domain validation regex
    // Allows domains like: example.com, sub.example.com, example.co.uk
    const domainRegex =
      /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)*[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z]{2,})$/;

    // Allow localhost and IP addresses
    const localhostRegex = /^localhost(:\d+)?$/;
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}(:\d+)?$/;

    return (
      domainRegex.test(url) || localhostRegex.test(url) || ipRegex.test(url)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Clear previous errors

    if (!website) {
      setError('Please enter a website');
      return;
    }

    const cleanedWebsite = cleanWebsite(website).toLowerCase();

    if (!validateWebsite(cleanedWebsite)) {
      setError(
        'Please enter a valid website (e.g., example.com, sub.example.com)'
      );
      return;
    }

    // Check for duplicate (exclude current schedule when editing)
    const duplicate = schedules.some(
      (s) =>
        s.id !== initialSchedule?.id &&
        s.website.toLowerCase() === cleanedWebsite
    );
    if (duplicate) {
      setError('This website already has a schedule');
      return;
    }

    if (!allDay) {
      const startDateTime = new Date(`${startDate}T${startTime}`);
      const endDateTime = new Date(`${endDate}T${endTime}`);

      if (endDateTime <= startDateTime) {
        setError('End date/time must be after start date/time');
        return;
      }
    }

    onSaveSchedule({
      website: cleanedWebsite,
      allDay,
      startDate,
      startTime: allDay ? '00:00' : startTime,
      endDate: allDay ? startDate : endDate,
      endTime: allDay ? '23:59' : endTime,
      repeat,
    });

    // Reset form only when adding (not editing)
    if (!initialSchedule) {
      setWebsite('');
      setAllDay(false);
      setStartDate(today);
      setStartTime(currentTime);
      setEndDate(today);
      setEndTime(currentTime);
      setRepeat('none');
    }
    setError(null); // Clear error on success
  };

  return {
    formState: {
      website,
      allDay,
      startDate,
      startTime,
      endDate,
      endTime,
      repeat,
    },
    handlers: {
      setWebsite,
      setAllDay,
      setStartDate,
      setStartTime,
      setEndDate,
      setEndTime,
      setRepeat,
      handleSubmit,
    },
    today,
  };
}
