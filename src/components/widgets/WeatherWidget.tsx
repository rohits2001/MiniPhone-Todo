import React from 'react';
import { Cloud } from 'lucide-react';

export const WeatherWidget: React.FC = () => {
  const weather = {
    temp: 28,
    condition: 'Partly Cloudy',
    location: 'Greater Noida',
    high: 30,
    low: 24
  };

  return (
    <div className="h-full p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-1">
          <span className="text-xl font-semibold">{weather.temp}°</span>
          <span className="text-[10px] opacity-60 ml-1">{weather.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <Cloud size={16} className="opacity-60" />
          <div className="text-right">
            <div className="text-[10px]">{weather.condition}</div>
            <div className="text-[10px] opacity-60">H:{weather.high}° L:{weather.low}°</div>
          </div>
        </div>
      </div>
    </div>
  );
};
