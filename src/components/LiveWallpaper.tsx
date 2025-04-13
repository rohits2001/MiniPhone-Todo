import React from 'react';
import { useStore } from '../store/useStore';

export const LiveWallpaper: React.FC = () => {
  const wallpaper = useStore((state) => state.wallpaper);

  return (
    <div className="fixed inset-0 -z-10">
      {wallpaper.type === 'image' ? (
        <img
          src={wallpaper.url}
          alt="Wallpaper"
          className="w-full h-full object-cover"
          style={{
            opacity: wallpaper.opacity,
            filter: `blur(${wallpaper.blur}px)`,
          }}
        />
      ) : (
        <video
          src={wallpaper.url}
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
          style={{
            opacity: wallpaper.opacity,
            filter: `blur(${wallpaper.blur}px)`,
          }}
        />
      )}
    </div>
  );
};