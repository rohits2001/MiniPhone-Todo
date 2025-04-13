import React from 'react';
import { List, Columns, Calendar } from 'lucide-react';

interface ViewSelectorProps {
  currentView: 'list' | 'kanban' | 'calendar';
  onViewChange: (view: 'list' | 'kanban' | 'calendar') => void;
}

export const ViewSelector: React.FC<ViewSelectorProps> = ({
  currentView,
  onViewChange,
}) => {
  const views = [
    { id: 'list', icon: List, label: 'List' },
    { id: 'kanban', icon: Columns, label: 'Board' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
  ] as const;

  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
      {views.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onViewChange(id)}
          className={`px-3 py-1.5 rounded-md flex items-center gap-2 text-sm transition-colors ${
            currentView === id
              ? 'bg-white dark:bg-gray-800 text-blue-500 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
          }`}
        >
          <Icon size={16} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};
