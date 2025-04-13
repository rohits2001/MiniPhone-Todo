import { LucideIcon, Briefcase, ShoppingBag, Heart, User, Circle } from 'lucide-react';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  category: TodoCategory;
}

export type TodoCategory = 'personal' | 'work' | 'shopping' | 'health' | 'none';

export interface Theme {
  isDark: boolean;
  primaryColor: string;
  fontSize: string;
}

interface CategoryConfig {
  icon: typeof Briefcase;
  colors: {
    light: string;
    dark: string;
  };
}

export const CATEGORY_CONFIGS: Record<TodoCategory, CategoryConfig> = {
  personal: {
    icon: User,
    colors: {
      light: '#3b82f6',
      dark: '#60a5fa'
    }
  },
  work: {
    icon: Briefcase,
    colors: {
      light: '#f59e0b',
      dark: '#fbbf24'
    }
  },
  shopping: {
    icon: ShoppingBag,
    colors: {
      light: '#10b981',
      dark: '#34d399'
    }
  },
  health: {
    icon: Heart,
    colors: {
      light: '#ef4444',
      dark: '#f87171'
    }
  },
  none: {
    icon: Circle,
    colors: {
      light: '#6b7280',
      dark: '#9ca3af'
    }
  }
};

// Helper function to get just the colors
export const CATEGORY_COLORS = Object.entries(CATEGORY_CONFIGS).reduce(
  (acc, [category, config]) => ({
    ...acc,
    [category]: config.colors
  }),
  {} as { [K in TodoCategory]: { light: string; dark: string } }
);

export interface Wallpaper {
  type: 'image' | 'video';
  url: string;
  opacity: number;
  blur: number;
}