import React from 'react';
import { X } from 'lucide-react';
import { useStore } from '../store/useStore';

interface WallpaperPickerProps {
  onClose: () => void;
}

const wallpapers = [
  { 
    url: 'linear-gradient(to bottom right, #2193b0, #6dd5ed)',
    name: 'Ocean',
    preview: 'linear-gradient(to bottom right, #2193b0, #6dd5ed)'
  },
  { 
    url: 'linear-gradient(to bottom right, #ee0979, #ff6a00)',
    name: 'Sunset',
    preview: 'linear-gradient(to bottom right, #ee0979, #ff6a00)'
  },
  { 
    url: 'linear-gradient(to bottom right, #8e2de2, #4a00e0)',
    name: 'Purple',
    preview: 'linear-gradient(to bottom right, #8e2de2, #4a00e0)'
  },
  { 
    url: 'linear-gradient(to bottom right, #11998e, #38ef7d)',
    name: 'Forest',
    preview: 'linear-gradient(to bottom right, #11998e, #38ef7d)'
  },
  { 
    url: 'linear-gradient(to bottom right, #283c86, #45a247)',
    name: 'Deep',
    preview: 'linear-gradient(to bottom right, #283c86, #45a247)'
  },
  { 
    url: 'linear-gradient(45deg, #12c2e9, #c471ed, #f64f59)',
    name: 'Rainbow',
    preview: 'linear-gradient(45deg, #12c2e9, #c471ed, #f64f59)'
  }
];

export const WallpaperPicker: React.FC<WallpaperPickerProps> = ({ onClose }) => {
  const { wallpaper, setWallpaper } = useStore();

  const handleWallpaperChange = (url: string) => {
    setWallpaper({ ...wallpaper, url });
  };

  const handleBlurChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWallpaper({ ...wallpaper, blur: Number(event.target.value) });
  };

  const handleOpacityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWallpaper({ ...wallpaper, opacity: Number(event.target.value) });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Wallpaper Settings</h3>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X size={14} className="text-white" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {wallpapers.map((wp) => (
          <button
            key={wp.url}
            onClick={() => handleWallpaperChange(wp.url)}
            className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
              wallpaper.url === wp.url
                ? 'border-blue-500 scale-95'
                : 'border-transparent hover:border-white/20'
            }`}
            style={{ background: wp.preview }}
            title={wp.name}
          >
            <span className="sr-only">{wp.name}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs text-white/60 mb-1">Blur</label>
          <input
            type="range"
            min="0"
            max="20"
            value={wallpaper.blur}
            onChange={handleBlurChange}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-xs text-white/60 mb-1">Opacity</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={wallpaper.opacity}
            onChange={handleOpacityChange}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};
