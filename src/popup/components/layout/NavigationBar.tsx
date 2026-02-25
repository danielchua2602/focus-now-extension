import clsx from 'clsx';
import { ScheduleTab } from '../../../types';

interface NavigationBarProps {
  activeTab: ScheduleTab;
  setActiveTab: (tab: ScheduleTab) => void;
  onAddSchedule: () => void;
}

export default function NavigationBar({
  activeTab,
  setActiveTab,
  onAddSchedule,
}: NavigationBarProps) {
  return (
    <nav className="flex items-center bg-background">
      <button
        className={clsx('px-8 py-3 font-medium transition-colors', {
          'border-b-2 border-primary bg-surface text-primary-dark':
            activeTab === 'Active',
          'text-text-muted/60 hover:text-text-secondary':
            activeTab !== 'Active',
        })}
        role="tab"
        aria-selected={activeTab === 'Active'}
        onClick={() => setActiveTab('Active')}
      >
        Active
      </button>
      <button
        className={clsx('px-8 py-3 font-medium transition-colors', {
          'border-b-2 border-primary bg-surface text-primary-dark':
            activeTab === 'Upcoming',
          'text-text-muted/60 hover:text-text-secondary':
            activeTab !== 'Upcoming',
        })}
        role="tab"
        aria-selected={activeTab === 'Upcoming'}
        onClick={() => setActiveTab('Upcoming')}
      >
        Upcoming
      </button>
      <div className="ml-auto mr-4 self-end">
        <button
          className="flex items-center gap-1 rounded-sm bg-accent px-3 py-2 text-sm text-white transition-colors hover:bg-accent-dark"
          onClick={onAddSchedule}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-5"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
              clipRule="evenodd"
            />
          </svg>
          Add Schedule
        </button>
      </div>
    </nav>
  );
}
