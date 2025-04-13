import React from 'react';
import { useStore } from '../store/useStore';

export const DynamicIsland: React.FC = () => {
  const theme = useStore((state) => state.theme);

  return (
    <div className="absolute top-[8px] left-1/2 -translate-x-1/2 z-20">
      <div className="flex gap-[2px]">
        {/* Left Pill - Camera */}
        <div className="w-[8px] h-[4px] bg-black rounded-[4px] flex items-center justify-center">
          <div className="w-[2px] h-[2px] bg-[#3C3C3C] rounded-full" />
        </div>
        {/* Center Pill - Dynamic Island */}
        <div className="w-[40px] h-[4px] bg-black rounded-[4px]" />
        {/* Right Pill - Face ID */}
        <div className="w-[8px] h-[4px] bg-black rounded-[4px] flex items-center justify-center">
          <div className="w-[2px] h-[2px] bg-[#3C3C3C] rounded-full" />
        </div>
      </div>
    </div>
  );
};