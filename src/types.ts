export interface Schedule {
  id: number;
  website: string;
  allDay: boolean;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  repeat: 'none' | 'daily' | 'weekly' | 'weekdays' | 'monthly' | 'yearly';
  repeatEndDate?: string;
}

export interface StorageData {
  blockedWebsites?: string[];
  schedules?: Schedule[];
}

export type ScheduleTab = 'Active' | 'Upcoming';

export type ExtensionMessage = { action: 'updateRules' };
