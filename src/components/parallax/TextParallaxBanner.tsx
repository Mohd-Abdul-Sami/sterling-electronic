import React from 'react';

interface TextParallaxBannerProps {
  words?: string[];
  direction?: 'left' | 'right';
  className?: string;
}

export const TextParallaxBanner: React.FC<TextParallaxBannerProps> = ({
  words = ['TECH', 'POWER', 'CONNECT', 'PLAY', 'CREATE', 'DISCOVER'],
  direction = 'left',
  className = '',
}) => {
  return (
    <div
      className={`relative w-full overflow-hidden py-6 border-y border-white/[0.04] bg-[#07080b] select-none ${className}`}
    >
      <div className="flex w-max items-center whitespace-nowrap animate-marquee">
        {/* Repeat list 3 times for seamless infinite drift */}
        {[...Array(3)].map((_, listIdx) => (
          <div key={listIdx} className="flex items-center gap-12 sm:gap-16 px-6">
            {words.map((word, wIdx) => (
              <React.Fragment key={`${listIdx}-${wIdx}`}>
                <span className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white/10 via-white/20 to-white/10 font-display uppercase hover:text-white/40 transition-colors">
                  {word}
                </span>
                <span className="w-2 h-2 rounded-full bg-cyan-500/40" />
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
