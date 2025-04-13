import React from 'react';
import { motion } from 'framer-motion';
import {
  X,
  CheckCircle2,
  Award,
  TrendingUp,
  Star,
  BarChart2,
} from 'lucide-react';

interface StatsPanelProps {
  stats: {
    completedTasks: number;
    totalPoints: number;
    currentStreak: number;
    longestStreak: number;
  };
  onClose: () => void;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats, onClose }) => {
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
          <h3 className="text-lg font-semibold dark:text-white">Statistics</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 size={20} className="text-blue-500" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Completed
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                {stats.completedTasks}
              </div>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Star size={20} className="text-purple-500" />
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Points
                </span>
              </div>
              <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                {stats.totalPoints}
              </div>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={20} className="text-green-500" />
                <span className="text-sm font-medium text-green-700 dark:text-green-300">
                  Streak
                </span>
              </div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {stats.currentStreak}
              </div>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <Award size={20} className="text-yellow-500" />
                <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                  Best Streak
                </span>
              </div>
              <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                {stats.longestStreak}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Achievements
            </h4>
            <div className="space-y-3">
              {[
                {
                  title: 'Task Master',
                  description: 'Complete 100 tasks',
                  progress: Math.min((stats.completedTasks / 100) * 100, 100),
                },
                {
                  title: 'Point Collector',
                  description: 'Earn 1000 points',
                  progress: Math.min((stats.totalPoints / 1000) * 100, 100),
                },
                {
                  title: 'Streak Champion',
                  description: 'Maintain a 7-day streak',
                  progress: Math.min((stats.currentStreak / 7) * 100, 100),
                },
              ].map((achievement) => (
                <div key={achievement.title} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium dark:text-white">
                        {achievement.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {achievement.description}
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {achievement.progress.toFixed(0)}%
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${achievement.progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
