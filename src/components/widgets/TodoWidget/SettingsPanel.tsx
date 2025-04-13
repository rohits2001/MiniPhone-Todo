import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Moon,
  Bell,
  Download,
  Upload,
  Users,
  Palette,
  Mail,
} from 'lucide-react';
import { useTodoStore } from '../../../store/todoStore';

interface SettingsPanelProps {
  onClose: () => void;
  onExport: () => void;
  onImport: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  onClose,
  onExport,
  onImport,
}) => {
  const { theme, updateTheme, collaborators, addCollaborator, removeCollaborator } =
    useTodoStore();
  const [newEmail, setNewEmail] = useState('');
  const [notificationSettings, setNotificationSettings] = useState({
    pushEnabled: true,
    emailEnabled: false,
    dueDateReminder: true,
    dailyDigest: false,
  });

  const handleAddCollaborator = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmail && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      addCollaborator(newEmail);
      setNewEmail('');
    }
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
          <h3 className="text-lg font-semibold dark:text-white">Settings</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* Theme */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Palette size={16} />
              Theme
            </h4>
            <div className="flex gap-2">
              {(['light', 'dark', 'custom'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => updateTheme(t)}
                  className={`px-3 py-1 rounded-lg text-sm capitalize ${
                    theme === t
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Bell size={16} />
              Notifications
            </h4>
            <div className="space-y-3">
              {[
                {
                  id: 'pushEnabled',
                  label: 'Push Notifications',
                  icon: Bell,
                },
                {
                  id: 'emailEnabled',
                  label: 'Email Notifications',
                  icon: Mail,
                },
                {
                  id: 'dueDateReminder',
                  label: 'Due Date Reminders',
                  icon: Bell,
                },
                {
                  id: 'dailyDigest',
                  label: 'Daily Digest',
                  icon: Mail,
                },
              ].map(({ id, label, icon: Icon }) => (
                <label
                  key={id}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Icon size={16} className="text-gray-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {label}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={notificationSettings[id as keyof typeof notificationSettings]}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          [id]: e.target.checked,
                        })
                      }
                      className="sr-only"
                    />
                    <div
                      className={`w-10 h-6 rounded-full transition-colors ${
                        notificationSettings[id as keyof typeof notificationSettings]
                          ? 'bg-blue-500'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                          notificationSettings[id as keyof typeof notificationSettings]
                            ? 'translate-x-5'
                            : 'translate-x-1'
                        }`}
                        style={{ marginTop: '0.25rem' }}
                      />
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Collaborators */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Users size={16} />
              Collaborators
            </h4>
            <form onSubmit={handleAddCollaborator} className="flex gap-2 mb-3">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Add by email"
                className="flex-1 px-3 py-1 text-sm rounded-lg border dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
              <button
                type="submit"
                className="px-3 py-1 rounded-lg bg-blue-500 text-white text-sm"
              >
                Add
              </button>
            </form>
            <div className="space-y-2">
              {collaborators.map((email) => (
                <div
                  key={email}
                  className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-900"
                >
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {email}
                  </span>
                  <button
                    onClick={() => removeCollaborator(email)}
                    className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <X size={14} className="text-gray-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Data Management */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Data Management
            </h4>
            <div className="flex gap-2">
              <button
                onClick={onExport}
                className="flex-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm flex items-center justify-center gap-2"
              >
                <Download size={16} />
                Export
              </button>
              <button
                onClick={onImport}
                className="flex-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm flex items-center justify-center gap-2"
              >
                <Upload size={16} />
                Import
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
