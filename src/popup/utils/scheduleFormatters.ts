import { Schedule } from '../../types';

export const repeatLabels: Record<Schedule['repeat'], string> = {
  none: '',
  daily: 'Repeats daily',
  weekdays: 'Repeats every weekday',
  weekly: 'Repeats weekly',
  monthly: 'Repeats monthly',
  yearly: 'Repeats yearly',
};

export const getFaviconUrl = (website: string): string => {
  const domain = website.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
};

export const formatDateDisplay = (dateStr: string): string => {
  const date = new Date(dateStr);
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
};

export const formatTime24 = (time: string): string => {
  return time.replace(':', '');
};

export const formatRepeatEndDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatScheduleDateTime = (schedule: Schedule): string => {
  if (schedule.allDay) {
    return `${formatDateDisplay(schedule.startDate)} · All day`;
  }

  if (schedule.startDate === schedule.endDate) {
    return `Today · ${schedule.startTime} - ${schedule.endTime}`;
  }

  return `${formatDateDisplay(schedule.startDate)}, ${schedule.startTime} - ${formatDateDisplay(schedule.endDate)}, ${
    schedule.endTime
  }`;
};

export const formatRelativeStartTime = (schedule: Schedule): string => {
  const now = new Date();
  const startDateTime = new Date(`${schedule.startDate}T${schedule.startTime}`);
  const diffMs = startDateTime.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const timeStr = schedule.allDay ? 'all day' : schedule.startTime;

  // Same day - show relative time
  if (diffMinutes < 60 && diffMinutes > 0) {
    return `Starts in ${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''}`;
  }

  if (diffHours < 24 && diffHours > 0) {
    return `Starts in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
  }

  // Tomorrow
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toLocaleDateString('en-CA');
  if (schedule.startDate === tomorrowStr) {
    return `Starts tomorrow at ${timeStr}`;
  }

  // Within a week - show day name
  if (diffDays <= 7) {
    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const dayName = days[startDateTime.getDay()];
    return `Starts on ${dayName} at ${timeStr}`;
  }

  // Beyond a week - show full date
  return `Starts on ${formatDateDisplay(schedule.startDate)} at ${timeStr}`;
};
