import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [is3DZone, setIs3DZone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop with fine pointer
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest('button, a, input, select, textarea, [role="button"], .cursor-pointer');
      setIsPointer(!!interactive);

      const canvasZone = target.closest('canvas, [data-cursor="3d"], .cursor-grab');
      setIs3DZone(!!canvasZone);
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999] transition-transform duration-75 ease-out will-change-transform hidden lg:block"
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`,
      }}
    >
      {/* Outer ring */}
      <div
        className={`rounded-full border transition-all duration-200 flex items-center justify-center ${
          is3DZone
            ? 'w-16 h-16 bg-cyan-500/10 border-cyan-400 backdrop-blur-[2px]'
            : isPointer
            ? 'w-10 h-10 bg-cyan-400/15 border-cyan-400/80 scale-110'
            : 'w-6 h-6 border-white/40'
        }`}
      >
        {is3DZone ? (
          <span className="text-[9px] font-mono font-bold tracking-widest text-cyan-300 uppercase">
            ORBIT
          </span>
        ) : (
          /* Center dot */
          <div
            className={`rounded-full transition-all duration-150 ${
              isPointer ? 'w-1.5 h-1.5 bg-cyan-400' : 'w-1 h-1 bg-white'
            }`}
          />
        )}
      </div>
    </div>
  );
};
