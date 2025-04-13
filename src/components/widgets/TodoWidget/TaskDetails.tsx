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
  Edit2,
  Trash2,
  Share2,
  MessageSquare,
} from 'lucide-react';
import { useTodoStore } from '../../../store/todoStore';

interface TaskDetailsProps {
  taskId: string;
  onClose: () => void;
}

export const TaskDetails: React.FC<TaskDetailsProps> = ({ taskId, onClose }) => {
  const { tasks, updateTask, deleteTask, addSubtask, updateSubtask, deleteSubtask } =
    useTodoStore();
  const task = tasks.find((t) => t.id === taskId);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task?.text || '');
  const [newSubtask, setNewSubtask] = useState('');
  const [newNote, setNewNote] = useState('');

  if (!task) return null;

  const handleSave = () => {
    if (editedText.trim()) {
      updateTask(taskId, { text: editedText.trim() });
      setIsEditing(false);
    }
  };

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      addSubtask(taskId, newSubtask.trim());
      setNewSubtask('');
    }
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      updateTask(taskId, {
        notes: task.notes ? `${task.notes}\n${newNote.trim()}` : newNote.trim(),
      });
      setNewNote('');
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(taskId);
      onClose();
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b dark:border-gray-700">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full p-2 text-lg font-semibold rounded-lg border dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                  onBlur={handleSave}
                />
              ) : (
                <h3 className="text-lg font-semibold dark:text-white">{task.text}</h3>
              )}
              <div className="mt-2 flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                {task.dueDate && (
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{formatDate(task.dueDate)}</span>
                  </div>
                )}
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    task.priority === 'high'
                      ? 'bg-red-100 text-red-700'
                      : task.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {task.priority}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Edit2 size={16} className="text-gray-500" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Trash2 size={16} className="text-gray-500" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Categories */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Tag size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Categories
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {task.category?.map((category) => (
                <span
                  key={category}
                  className="px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>

          {/* Subtasks */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckSquare size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Subtasks
              </span>
            </div>
            <div className="space-y-2">
              {task.subtasks?.map((subtask) => (
                <div key={subtask.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={(e) =>
                      updateSubtask(taskId, subtask.id, {
                        completed: e.target.checked,
                      })
                    }
                    className="rounded border-gray-300 dark:border-gray-600"
                  />
                  <span
                    className={`flex-1 text-sm dark:text-white ${
                      subtask.completed ? 'line-through text-gray-400' : ''
                    }`}
                  >
                    {subtask.text}
                  </span>
                  <button
                    onClick={() => deleteSubtask(taskId, subtask.id)}
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
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSubtask()}
                />
                <button
                  onClick={handleAddSubtask}
                  className="px-3 py-2 rounded-lg bg-blue-500 text-white text-sm"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <MessageSquare size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Notes
              </span>
            </div>
            <div className="space-y-2">
              {task.notes && (
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                  <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {task.notes}
                  </pre>
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Add note"
                  className="flex-1 p-2 text-sm rounded-lg border dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                />
                <button
                  onClick={handleAddNote}
                  className="px-3 py-2 rounded-lg bg-blue-500 text-white text-sm"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Share2 size={16} className="text-gray-500" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Activity
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                <div className="text-sm text-gray-500 dark:text-gray-400">Created</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {formatDate(task.createdAt)}
                </div>
              </div>
              <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900">
                <div className="text-sm text-gray-500 dark:text-gray-400">Points</div>
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {task.points}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
