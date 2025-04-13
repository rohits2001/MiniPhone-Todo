import React from 'react';
import { motion } from 'framer-motion';
import { X, Tag } from 'lucide-react';
import { useTodoStore } from '../../../store/todoStore';

interface FilterPanelProps {
  onClose: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ onClose }) => {
  const { filter, categories, updateFilter } = useTodoStore();

  const handleCategoryToggle = (category: string) => {
    const newCategories = filter.categories.includes(category)
      ? filter.categories.filter((c) => c !== category)
      : [...filter.categories, category];
    updateFilter({ categories: newCategories });
  };

  const handlePriorityToggle = (priority: 'low' | 'medium' | 'high') => {
    const newPriorities = filter.priority.includes(priority)
      ? filter.priority.filter((p) => p !== priority)
      : [...filter.priority, priority];
    updateFilter({ priority: newPriorities });
  };

  const handleStatusToggle = (status: 'todo' | 'inProgress' | 'done') => {
    const newStatus = filter.status.includes(status)
      ? filter.status.filter((s) => s !== status)
      : [...filter.status, status];
    updateFilter({ status: newStatus });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-start justify-end p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className="w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-lg font-semibold dark:text-white">Filters</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Categories */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Categories
            </h4>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filter.categories.includes(category)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priority
            </h4>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map((priority) => (
                <button
                  key={priority}
                  onClick={() => handlePriorityToggle(priority)}
                  className={`px-3 py-1 rounded-full text-sm capitalize ${
                    filter.priority.includes(priority)
                      ? priority === 'high'
                        ? 'bg-red-500 text-white'
                        : priority === 'medium'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {priority}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </h4>
            <div className="flex gap-2">
              {([
                { id: 'todo', label: 'To Do' },
                { id: 'inProgress', label: 'In Progress' },
                { id: 'done', label: 'Done' },
              ] as const).map((status) => (
                <button
                  key={status.id}
                  onClick={() => handleStatusToggle(status.id)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    filter.status.includes(status.id)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reset Button */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={() =>
              updateFilter({
                categories: [],
                priority: [],
                status: [],
              })
            }
            className="w-full px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
