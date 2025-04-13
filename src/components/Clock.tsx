import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface ClockProps {
  compact?: boolean;
}

export const Clock: React.FC<ClockProps> = ({ compact = false }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (compact) {
    return <span className="text-black">{format(time, 'HH:mm')}</span>;
  }

  return (
    <div className="text-center text-black">
      <div className="text-xl font-light tracking-tight mb-0.5">
        {format(time, 'HH:mm')}
      </div>
      <div className="text-[10px] font-medium opacity-80">
        {format(time, 'EEEE, MMM d')}
      </div>
    </div>
  );
};