import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Tag,
  Bell,
  CheckSquare,
  Repeat,
  X,
} from 'lucide-react';
import { useTodoStore } from '../../../store/todoStore';

interface AddTaskFormProps {
  onClose: () => void;
}

export const AddTaskForm: React.FC<AddTaskFormProps> = ({ onClose }) => {
  const { addTask, categories } = useTodoStore();
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState<Date>();
  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<Date>();
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [subtasks, setSubtasks] = useState<string[]>([]);
  const [newSubtask, setNewSubtask] = useState('');
  const [recurring, setRecurring] = useState<{
    enabled: boolean;
    frequency: 'daily' | 'weekly' | 'monthly';
    endDate?: Date;
  }>({
    enabled: false,
    frequency: 'daily',
  });
  const [notifications, setNotifications] = useState<{
    enabled: boolean;
    type: 'push' | 'email';
    time: 'onDue' | 'custom';
    customTime?: Date;
  }>({
    enabled: false,
    type: 'push',
    time: 'onDue',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    addTask({
      text: text.trim(),
      completed: false,
      priority,
      category: selectedCategories,
      dueDate,
      startTime,
      endTime,
      subtasks: subtasks.map((text) => ({
        id: Date.now().toString(),
        text,
        completed: false,
      })),
      recurring: recurring.enabled
        ? {
            frequency: recurring.frequency,
            endDate: recurring.endDate,
          }
        : undefined,
      notifications: notifications.enabled
        ? [
            {
              type: notifications.type,
              time: notifications.time,
              customTime: notifications.customTime,
            },
          ]
        : [],
    });
    onClose();
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, newSubtask.trim()]);
      setNewSubtask('');
    }
  };

  const removeSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.form
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">Add Task</h3>

          {/* Task Text */}
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full p-3 rounded-lg border dark:border-gray-700 dark:bg-gray-900 dark:text-white mb-4"
            autoFocus
          />

          {/* Priority */}
          <div className="flex gap-2 mb-4">
            {(['low', 'medium', 'high'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`px-4 py-2 rounded-lg capitalize ${
                  priority === p
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Categories */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Tag size={16} className="text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Categories</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategories.includes(category)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Due Date and Time */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Calendar size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Due Date</span>
              </div>
              <input
                type="date"
                value={dueDate?.toISOString().split('T')[0] || ''}
                onChange={(e) => setDueDate(new Date(e.target.value))}
                className="w-full p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-gray-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Due Time</span>
              </div>
              <input
                type="time"
                value={endTime?.toLocaleTimeString() || ''}
                onChange={(e) => {
                  const [hours, minutes] = e.target.value.split(':');
                  const date = new Date();
                  date.setHours(parseInt(hours), parseInt(minutes));
                  setEndTime(date);
                }}
                className="w-full p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Subtasks */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckSquare size={16} className="text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Subtasks</span>
            </div>
            <div className="space-y-2">
              {subtasks.map((subtask, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex-1 text-sm dark:text-white">{subtask}</span>
                  <button
                    type="button"
                    onClick={() => removeSubtask(index)}
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X size={14} className="text-gray-500" />
                  </button>
                </div>
              ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  placeholder="Add subtask"
                  className="flex-1 p-2 text-sm rounded-lg border dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  onKeyPress={(e) => e.key === 'Enter' && addSubtask()}
                />
                <button
                  type="button"
                  onClick={addSubtask}
                  className="px-3 py-2 rounded-lg bg-blue-500 text-white text-sm"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Recurring */}
          <div className="mb-4">
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={recurring.enabled}
                onChange={(e) => setRecurring({ ...recurring, enabled: e.target.checked })}
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <Repeat size={16} className="text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">Recurring Task</span>
            </label>
            {recurring.enabled && (
              <div className="grid grid-cols-2 gap-4 mt-2">
                <select
                  value={recurring.frequency}
                  onChange={(e) =>
                    setRecurring({
                      ...recurring,
                      frequency: e.target.value as typeof recurring.frequency,
                    })
                  }
                  className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
                <input
                  type="date"
                  value={recurring.endDate?.toISOString().split('T')[0] || ''}
                  onChange={(e) =>
                    setRecurring({
                      ...recurring,
                      endDate: e.target.value ? new Date(e.target.value) : undefined,
                    })
                  }
                  placeholder="End date (optional)"
                  className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                />
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="mb-4">
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={notifications.enabled}
                onChange={(e) =>
                  setNotifications({ ...notifications, enabled: e.target.checked })
                }
                className="rounded border-gray-300 dark:border-gray-600"
              />
              <Bell size={16} className="text-gray-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Enable Notifications
              </span>
            </label>
            {notifications.enabled && (
              <div className="grid grid-cols-2 gap-4 mt-2">
                <select
                  value={notifications.type}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      type: e.target.value as typeof notifications.type,
                    })
                  }
                  className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  <option value="push">Push Notification</option>
                  <option value="email">Email</option>
                </select>
                <select
                  value={notifications.time}
                  onChange={(e) =>
                    setNotifications({
                      ...notifications,
                      time: e.target.value as typeof notifications.time,
                    })
                  }
                  className="p-2 rounded-lg border dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                >
                  <option value="onDue">On Due Date</option>
                  <option value="custom">Custom Time</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="p-4 bg-gray-50 dark:bg-gray-900 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-blue-500 text-white"
          >
            Add Task
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
};
