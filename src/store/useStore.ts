import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TodoCategory } from '../types';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category: TodoCategory;
}

interface Theme {
  isDark: boolean;
  primaryColor: string;
  fontSize: string;
}

interface Wallpaper {
  url: string;
  blur: number;
  opacity: number;
}

interface State {
  todos: Todo[];
  theme: Theme;
  isExpanded: boolean;
  wallpaper: Wallpaper;
  addTodo: (text: string, category: TodoCategory) => void;
  toggleTodo: (id: string) => void;
  removeTodo: (id: string) => void;
  updateTodoCategory: (id: string, category: TodoCategory) => void;
  updateTodoOrder: (sourceIndex: number, destinationIndex: number) => void;
  setTheme: (theme: Theme) => void;
  toggleExpanded: () => void;
  setWallpaper: (wallpaper: Wallpaper) => void;
}

export const useStore = create<State>()(
  persist(
    (set) => ({
      todos: [],
      theme: { isDark: false, primaryColor: '#3b82f6', fontSize: 'base' },
      isExpanded: true,
      wallpaper: {
        url: 'linear-gradient(to bottom right, #2193b0, #6dd5ed)',
        blur: 0,
        opacity: 1
      },
      addTodo: (text, category) =>
        set((state) => ({
          todos: [...state.todos, { id: Date.now().toString(), text, completed: false, category }],
        })),
      toggleTodo: (id) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          ),
        })),
      removeTodo: (id) =>
        set((state) => ({
          todos: state.todos.filter((todo) => todo.id !== id),
        })),
      updateTodoCategory: (id, category) =>
        set((state) => ({
          todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, category } : todo
          ),
        })),
      updateTodoOrder: (sourceIndex, destinationIndex) =>
        set((state) => {
          const newTodos = [...state.todos];
          const [removed] = newTodos.splice(sourceIndex, 1);
          newTodos.splice(destinationIndex, 0, removed);
          return { todos: newTodos };
        }),
      setTheme: (theme) => set({ theme }),
      toggleExpanded: () => set((state) => ({ isExpanded: !state.isExpanded })),
      setWallpaper: (wallpaper) => set({ wallpaper })
    }),
    {
      name: 'miniphone-storage'
    }
  )
);