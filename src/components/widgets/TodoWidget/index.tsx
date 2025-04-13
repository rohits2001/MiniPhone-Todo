import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Plus,
  CheckCircle2,
  Circle,
  X,
  Calendar,
  Clock,
  Tag,
  Bell,
  Users,
  BarChart2,
  Search,
  Filter,
  Moon,
  Sun,
  Mic,
  Download,
  Upload,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { useTodoStore } from '../../../store/todoStore';
import { TaskList } from './TaskList';
import { KanbanBoard } from './KanbanBoard';
import { CalendarView } from './CalendarView';
import { AddTaskForm } from './AddTaskForm';
import { TaskDetails } from './TaskDetails';
import { FilterPanel } from './FilterPanel';
import { StatsPanel } from './StatsPanel';
import { SettingsPanel } from './SettingsPanel';
import { SearchBar } from './SearchBar';
import { ViewSelector } from './ViewSelector';

export const TodoWidget: React.FC = () => {
  const {
    tasks,
    view,
    theme,
    stats,
    filter,
    updateView,
    updateTheme,
    updateFilter,
    exportData,
    importData,
  } = useTodoStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  // Voice input handling
  const startVoiceRecording = async () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    setIsRecording(true);
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setShowAddForm(true);
      // Pass the transcribed text to AddTaskForm
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  // Handle file import
  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        importData(content);
      };
      reader.readAsText(file);
    }
  };

  // Handle data export
  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'todo-backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={`h-full flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden transition-colors ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b dark:border-gray-700">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold dark:text-white">Tasks</h2>
          <ViewSelector currentView={view} onViewChange={updateView} />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowStats(!showStats)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <BarChart2 size={18} className="text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={() => updateTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            {theme === 'dark' ? (
              <Sun size={18} className="text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon size={18} className="text-gray-600 dark:text-gray-300" />
            )}
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Settings size={18} className="text-gray-600 dark:text-gray-300" />
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="p-4 border-b dark:border-gray-700">
        <div className="flex items-center gap-2">
          <SearchBar
            value={filter.search}
            onChange={(search) => updateFilter({ search })}
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-3 py-2 flex items-center gap-1 rounded-lg border dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Filter size={16} className="text-gray-600 dark:text-gray-300" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Filter</span>
          </button>
          <button
            onClick={startVoiceRecording}
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
              isRecording ? 'bg-red-500' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            } transition-colors`}
          >
            <Mic
              size={18}
              className={isRecording ? 'text-white' : 'text-gray-600 dark:text-gray-300'}
            />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {view === 'list' && <TaskList onTaskClick={setSelectedTaskId} />}
          {view === 'kanban' && <KanbanBoard onTaskClick={setSelectedTaskId} />}
          {view === 'calendar' && <CalendarView onTaskClick={setSelectedTaskId} />}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddForm && (
          <AddTaskForm onClose={() => setShowAddForm(false)} />
        )}
        {showFilters && (
          <FilterPanel onClose={() => setShowFilters(false)} />
        )}
        {showStats && (
          <StatsPanel stats={stats} onClose={() => setShowStats(false)} />
        )}
        {showSettings && (
          <SettingsPanel
            onClose={() => setShowSettings(false)}
            onExport={handleExport}
            onImport={() => document.getElementById('file-import')?.click()}
          />
        )}
        {selectedTaskId && (
          <TaskDetails
            taskId={selectedTaskId}
            onClose={() => setSelectedTaskId(null)}
          />
        )}
      </AnimatePresence>

      {/* Hidden file input for import */}
      <input
        type="file"
        id="file-import"
        className="hidden"
        accept=".json"
        onChange={handleFileImport}
      />
    </div>
  );
};
