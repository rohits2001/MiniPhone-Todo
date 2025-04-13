import React from 'react';
import { Battery, Signal, Wifi } from 'lucide-react';
import { Clock } from './Clock';

interface StatusBarProps {
  className?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ className = '' }) => (
  <div className={`relative ${className}`}>
    <div className="absolute top-0 left-0 right-0 z-10">
      <div className="mx-auto w-[120px] h-[25px] bg-black rounded-b-[16px]" />
    </div>
    <div className="pt-7 px-4 flex justify-between items-center text-[12px] text-black">
      <div>
        <Clock compact />
      </div>
      <div className="flex items-center gap-1">
        <Signal size={12} />
        <Wifi size={12} />
        <Battery size={12} />
      </div>
    </div>
  </div>
);
