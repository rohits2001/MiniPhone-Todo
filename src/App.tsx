import React, { useState, useMemo, useCallback } from 'react';
import { useStore } from './store/useStore';
import TodoList from './components/TodoList';
import { FlappyBird } from './components/FlappyBird';
import { WeatherWidget } from './components/widgets/WeatherWidget';
import { NewsWidget } from "./components/widgets/NewsWidget";
import { StockWidget } from "./components/widgets/StockWidget";
import { TodoWidget } from "./components/widgets/TodoWidget";
import { WallpaperPicker } from './components/WallpaperPicker';
import { StatusBar } from './components/StatusBar';
import { Controls } from './components/Controls';
import { SwipeableView } from './components/SwipeableView';

const WidgetsView: React.FC = () => (
  <div className="h-full p-2.5 overflow-y-auto custom-scrollbar-light">
    <div className="flex flex-col gap-2">
      {/* Weather Section */}
      <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white/90 text-black border border-white/40">
        <WeatherWidget />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-2 gap-3 p-3">
        <div className="col-span-2">
          <TodoWidget />
        </div>
        <div className="relative rounded-2xl shadow-lg bg-white/90 text-black overflow-y-auto hide-scrollbar border border-white/40">
          <NewsWidget />
        </div>
        <div className="relative rounded-2xl shadow-lg bg-white/90 text-black overflow-y-auto hide-scrollbar border border-white/40">
          <StockWidget />
        </div>
      </div>
    </div>
  </div>
);

const TodoView: React.FC = () => (
  <div className="h-[calc(100vh-180px)] p-2.5 min-h-[420px]">
    <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white/90 text-black h-full border border-white/40 flex flex-col">
      <TodoList />
    </div>
  </div>
);

const GameView: React.FC = () => (
  <div className="h-full p-2.5">
    <div className="relative overflow-hidden rounded-2xl shadow-lg bg-white/90 text-black h-full border border-white/40 flex items-center justify-center">
      <div className="w-full h-full">
        <FlappyBird />
      </div>
    </div>
  </div>
);

function App() {
  const { theme, setTheme, isExpanded, toggleExpanded, wallpaper } = useStore();
  const [showWallpaperPicker, setShowWallpaperPicker] = useState(false);

  const handleThemeToggle = useCallback(() => {
    setTheme({ ...theme, isDark: !theme.isDark });
  }, [theme, setTheme]);

  const containerClassName = useMemo(() => 
    `phone-container fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${
      isExpanded ? 'w-[300px] h-[600px]' : 'w-[250px] h-[500px]'
    } transition-all duration-300 ease-in-out`,
    [isExpanded]
  );

  const mainClassName = useMemo(() => 
    `relative rounded-[40px] overflow-hidden backdrop-blur-xl ${
      theme.isDark ? 'bg-black/70' : 'bg-white/70'
    } shadow-2xl border-[4px] border-[#1C1C1E] h-full w-full flex flex-col transition-all duration-300`,
    [theme.isDark]
  );

  return (
    <div className={containerClassName}>
      <div
        className="absolute inset-0 -z-10 transition-all duration-300"
        style={{
          background: wallpaper.url,
          filter: `blur(${wallpaper.blur}px)`,
          opacity: wallpaper.opacity
        }}
      />
      <div className={mainClassName}>
        <StatusBar className="flex-shrink-0" />
        <SwipeableView>
          <WidgetsView />
          <TodoView />
          <GameView />
        </SwipeableView>
        <Controls
          theme={theme}
          isExpanded={isExpanded}
          onThemeToggle={handleThemeToggle}
          onExpandToggle={toggleExpanded}
          onWallpaperClick={() => setShowWallpaperPicker(!showWallpaperPicker)}
        />
        {showWallpaperPicker && (
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-xs bg-black/80 rounded-2xl p-4">
              <WallpaperPicker onClose={() => setShowWallpaperPicker(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;