import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

interface SwipeableViewProps {
  children: [React.ReactNode, React.ReactNode, React.ReactNode]; // Exactly two views
}

export const SwipeableView: React.FC<SwipeableViewProps> = ({ children }) => {
  const [currentView, setCurrentView] = useState(0);
  const [dragStart, setDragStart] = useState(0);

  const handleDragStart = (_: any, info: PanInfo) => {
    setDragStart(info.point.x);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const diff = dragStart - info.point.x;
    const threshold = 50; // minimum distance to trigger view change
    const velocity = info.velocity.x;
    const isFlick = Math.abs(velocity) > 500; // Consider it a flick if velocity is high

    if (isFlick || Math.abs(diff) > threshold) {
      const direction = isFlick ? (velocity > 0 ? -1 : 1) : (diff > 0 ? 1 : -1);
      const newView = currentView + direction;
      
      if (newView >= 0 && newView <= 2) {
        // Add haptic feedback if supported
        if (window.navigator.vibrate) {
          window.navigator.vibrate(50);
        }
        setCurrentView(newView);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && currentView > 0) {
      setCurrentView(prev => prev - 1);
    } else if (e.key === 'ArrowRight' && currentView < 2) {
      setCurrentView(prev => prev + 1);
    }
  };

  return (
    <div className="relative flex-1 overflow-hidden">
      <div className="relative w-full h-full" style={{ perspective: '1500px' }}>
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={currentView}
            initial={{
              rotateY: currentView === 0 ? -90 : 90,
              x: currentView === 0 ? -50 : 50,
              opacity: 0,
              scale: 0.9,
              z: -200
            }}
            animate={{
              rotateY: 0,
              x: 0,
              opacity: 1,
              scale: 1,
              z: 0
            }}
            exit={{
              rotateY: currentView === 2 ? 90 : -90,
              x: currentView === 2 ? 50 : -50,
              opacity: 0,
              scale: 0.9,
              z: -200
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              mass: 0.8,
              opacity: { duration: 0.3 },
              z: { duration: 0.3 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            className="absolute inset-0 w-full h-full overflow-hidden focus:outline-none will-change-transform"
            style={{
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              transformOrigin: 'center center'
            }}
          >
          {children[currentView]}
          </motion.div>
        </AnimatePresence>
        
        {/* Swipe Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          <div className={`w-1.5 h-1.5 rounded-full transition-colors ${currentView === 0 ? 'bg-black' : 'bg-black/30'}`} />
          <div className={`w-1.5 h-1.5 rounded-full transition-colors ${currentView === 1 ? 'bg-black' : 'bg-black/30'}`} />
          <div className={`w-1.5 h-1.5 rounded-full transition-colors ${currentView === 2 ? 'bg-black' : 'bg-black/30'}`} />
        </div>
      </div>
    </div>
  );
};
