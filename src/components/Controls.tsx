import React from 'react';
import { Moon, Sun, Minimize2, Maximize2, Image } from 'lucide-react';

interface ControlsProps {
  theme: { isDark: boolean };
  isExpanded: boolean;
  onThemeToggle: () => void;
  onExpandToggle: () => void;
  onWallpaperClick: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  theme,
  isExpanded,
  onThemeToggle,
  onExpandToggle,
  onWallpaperClick
}) => (
  <div className="flex justify-between items-center p-4">
    <div className="flex gap-2">
      <button
        onClick={onThemeToggle}
        className="p-2 rounded-full bg-white/80 text-black hover:scale-105 transition-all"
      >
        {theme.isDark ? <Sun size={14} /> : <Moon size={14} />}
      </button>
      <button
        onClick={onWallpaperClick}
        className="p-2 rounded-full bg-white/80 text-black hover:scale-105 transition-all"
      >
        <Image size={14} />
      </button>
    </div>
    <button
      onClick={onExpandToggle}
      className="p-2 rounded-full bg-white/80 text-black hover:scale-105 transition-all"
    >
      {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
    </button>
  </div>
);
