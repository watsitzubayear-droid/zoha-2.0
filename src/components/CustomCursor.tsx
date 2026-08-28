import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';

export const CustomCursor: React.FC = () => {
  const { data, zohaMode } = useData();
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [dotPos, setDotPos] = useState({ x: -100, y: -100 });
  const [cursorText, setCursorText] = useState<string>('');
  const [isHovering, setIsHovering] = useState(false);
  const [isPointer, setIsPointer] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch / mobile
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
      setIsTouchDevice(true);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setVisible(true);
      setPosition({ x: e.clientX, y: e.clientY });

      // Check element under cursor for custom cursor badges
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('button, a, input, textarea, select, [role="button"]');
      setIsPointer(!!interactive);

      const customBadge = target.closest('[data-cursor]') as HTMLElement | null;
      if (customBadge) {
        setCursorText(customBadge.getAttribute('data-cursor') || '');
        setIsHovering(true);
      } else {
        setCursorText('');
        setIsHovering(false);
      }
    };

    const handleMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // Smooth lag for outer ring
  useEffect(() => {
    if (isTouchDevice) return;
    let animationFrame: number;

    const follow = () => {
      setDotPos((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.2,
        y: prev.y + (position.y - prev.y) * 0.2,
      }));
      animationFrame = requestAnimationFrame(follow);
    };

    animationFrame = requestAnimationFrame(follow);
    return () => cancelAnimationFrame(animationFrame);
  }, [position, isTouchDevice]);

  if (isTouchDevice || !visible || data?.settings?.customCursorEnabled === false) {
    return null;
  }

  const ringSize = cursorText ? 'w-16 h-16' : isPointer ? 'w-10 h-10' : 'w-7 h-7';
  const ringColor = zohaMode
    ? 'border-purple-400 bg-purple-500/10'
    : 'border-amber-400/80 bg-amber-500/10';

  return (
    <>
      {/* Tiny immediate center dot */}
      <div
        className="fixed pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-200"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          opacity: visible ? 1 : 0,
        }}
      >
        <div
          className={`w-1.5 h-1.5 rounded-full ${
            zohaMode ? 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]' : 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
          }`}
        />
      </div>

      {/* Smooth trailing glass ring */}
      <div
        className={`fixed pointer-events-none z-50 rounded-full border backdrop-blur-[2px] transform -translate-x-1/2 -translate-y-1/2 transition-all duration-150 flex items-center justify-center ${ringSize} ${ringColor}`}
        style={{
          left: `${dotPos.x}px`,
          top: `${dotPos.y}px`,
          opacity: visible ? 1 : 0,
        }}
      >
        {cursorText && (
          <span className="text-[9px] font-bold tracking-widest text-amber-300 uppercase px-1">
            {cursorText}
          </span>
        )}
      </div>
    </>
  );
};
