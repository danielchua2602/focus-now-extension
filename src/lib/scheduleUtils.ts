import { Schedule } from '../types';

export function getCurrentDateTime() {
  const now = new Date();
  return {
    now,
    currentDate: now.toLocaleDateString('en-CA'), // YYYY-MM-DD format in local timezone
    currentTime: now.toTimeString().slice(0, 5), // HH:MM format
  };
}

export function isScheduleActive(schedule: Schedule): boolean {
  const { currentDate, currentTime } = getCurrentDateTime();

  // Check if current date is within schedule date range
  if (currentDate < schedule.startDate || currentDate > schedule.endDate) {
    return false;
  }

  // If all-day schedule, it's active
  if (schedule.allDay) {
    return true;
  }

  // For time-specific schedules, check if current time is within range
  return currentTime >= schedule.startTime && currentTime <= schedule.endTime;
}

export function isScheduleCompleted(schedule: Schedule): boolean {
  const { currentDate, currentTime } = getCurrentDateTime();

  if (schedule.repeat !== 'none') {
    return false;
  }

  // All-day schedules: remove when current date > end date
  if (schedule.allDay) {
    return currentDate > schedule.endDate;
  }

  // Time-specific schedules: remove when past end date/time
  if (currentDate > schedule.endDate) return true;
  // On the same day, resolve with time
  if (currentDate === schedule.endDate && currentTime > schedule.endTime)
    return true;

  return false;
}
