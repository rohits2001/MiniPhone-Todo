import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string[];
  dueDate?: Date;
  startTime?: Date;
  endTime?: Date;
  subtasks: Subtask[];
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    endDate?: Date;
  };
  assignedTo?: string[];
  progress: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  points: number;
  streak: number;
  notifications: {
    type: 'push' | 'email';
    time: 'onDue' | 'custom';
    customTime?: Date;
  }[];
}

interface TodoState {
  tasks: Task[];
  categories: string[];
  collaborators: string[];
  view: 'list' | 'kanban' | 'calendar';
  filter: {
    search: string;
    categories: string[];
    priority: ('low' | 'medium' | 'high')[];
    status: ('todo' | 'inProgress' | 'done')[];
  };
  sort: {
    by: 'dueDate' | 'priority' | 'createdAt' | 'points';
    order: 'asc' | 'desc';
  };
  theme: 'light' | 'dark' | 'custom';
  stats: {
    completedTasks: number;
    totalPoints: number;
    currentStreak: number;
    longestStreak: number;
  };
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'progress' | 'points' | 'streak'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  addSubtask: (taskId: string, text: string) => void;
  updateSubtask: (taskId: string, subtaskId: string, updates: Partial<Subtask>) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  updateFilter: (updates: Partial<TodoState['filter']>) => void;
  updateSort: (updates: Partial<TodoState['sort']>) => void;
  updateView: (view: TodoState['view']) => void;
  updateTheme: (theme: TodoState['theme']) => void;
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
  addCollaborator: (email: string) => void;
  removeCollaborator: (email: string) => void;
  exportData: () => string;
  importData: (data: string) => void;
}

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      tasks: [],
      categories: ['work', 'personal', 'shopping', 'health'],
      collaborators: [],
      view: 'list',
      filter: {
        search: '',
        categories: [],
        priority: [],
        status: [],
      },
      sort: {
        by: 'dueDate',
        order: 'asc',
      },
      theme: 'light',
      stats: {
        completedTasks: 0,
        totalPoints: 0,
        currentStreak: 0,
        longestStreak: 0,
      },

      addTask: (task) => {
        const newTask: Task = {
          ...task,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
          progress: 0,
          points: task.priority === 'high' ? 10 : task.priority === 'medium' ? 5 : 3,
          streak: 0,
        };
        set((state) => ({ tasks: [newTask, ...state.tasks] }));
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? { ...task, ...updates, updatedAt: new Date() }
              : task
          ),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },

      toggleTaskComplete: (id) => {
        const state = get();
        const task = state.tasks.find((t) => t.id === id);
        if (!task) return;

        const completed = !task.completed;
        const completedAt = completed ? new Date() : undefined;
        const points = completed ? task.points : -task.points;

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id
              ? {
                  ...t,
                  completed,
                  completedAt,
                  updatedAt: new Date(),
                  streak: completed ? t.streak + 1 : 0,
                }
              : t
          ),
          stats: {
            ...state.stats,
            completedTasks: state.stats.completedTasks + (completed ? 1 : -1),
            totalPoints: state.stats.totalPoints + points,
            currentStreak: completed
              ? state.stats.currentStreak + 1
              : 0,
            longestStreak: completed
              ? Math.max(state.stats.longestStreak, state.stats.currentStreak + 1)
              : state.stats.longestStreak,
          },
        }));
      },

      addSubtask: (taskId, text) => {
        const subtask: Subtask = {
          id: Date.now().toString(),
          text,
          completed: false,
        };
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subtasks: [...task.subtasks, subtask],
                  updatedAt: new Date(),
                }
              : task
          ),
        }));
      },

      updateSubtask: (taskId, subtaskId, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subtasks: task.subtasks.map((subtask) =>
                    subtask.id === subtaskId
                      ? { ...subtask, ...updates }
                      : subtask
                  ),
                  updatedAt: new Date(),
                }
              : task
          ),
        }));
      },

      deleteSubtask: (taskId, subtaskId) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subtasks: task.subtasks.filter((s) => s.id !== subtaskId),
                  updatedAt: new Date(),
                }
              : task
          ),
        }));
      },

      updateFilter: (updates) => {
        set((state) => ({
          filter: { ...state.filter, ...updates },
        }));
      },

      updateSort: (updates) => {
        set((state) => ({
          sort: { ...state.sort, ...updates },
        }));
      },

      updateView: (view) => {
        set({ view });
      },

      updateTheme: (theme) => {
        set({ theme });
      },

      addCategory: (category) => {
        set((state) => ({
          categories: [...state.categories, category],
        }));
      },

      deleteCategory: (category) => {
        set((state) => ({
          categories: state.categories.filter((c) => c !== category),
        }));
      },

      addCollaborator: (email) => {
        set((state) => ({
          collaborators: [...state.collaborators, email],
        }));
      },

      removeCollaborator: (email) => {
        set((state) => ({
          collaborators: state.collaborators.filter((c) => c !== email),
        }));
      },

      exportData: () => {
        const state = get();
        return JSON.stringify({
          tasks: state.tasks,
          categories: state.categories,
          collaborators: state.collaborators,
          stats: state.stats,
        });
      },

      importData: (data) => {
        try {
          const parsed = JSON.parse(data);
          set({
            tasks: parsed.tasks || [],
            categories: parsed.categories || [],
            collaborators: parsed.collaborators || [],
            stats: parsed.stats || {
              completedTasks: 0,
              totalPoints: 0,
              currentStreak: 0,
              longestStreak: 0,
            },
          });
        } catch (error) {
          console.error('Failed to import data:', error);
        }
      },
    }),
    {
      name: 'todo-storage',
    }
  )
);
