import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ANNOUNCEMENTS = [
  { text: 'AUTUMN-ATIC SAVINGS: Starter Sets, Electrics, & More', href: '#starter-set' },
  { text: 'HAIRBERNATION IS HERE. SHOP TO SHAVE WHAT SHOWS.', href: '#starter-set' },
  { text: 'A full shave starting at $1.99', href: '#starter-set' },
  { text: 'Electrics Are 50% OFF | Shop Now', href: '#products' },
  { text: 'Free Shipping: Starter Sets & Orders $18+', href: '#starter-set' }
];

export const AnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + ANNOUNCEMENTS.length) % ANNOUNCEMENTS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
  };

  const current = ANNOUNCEMENTS[currentIndex];

  return (
    <div
      className="bg-[#121212] text-white text-xs sm:text-sm font-bold uppercase tracking-wider py-2.5 px-4 relative z-50 border-b border-stone-800"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button
          onClick={handlePrev}
          aria-label="Previous announcement"
          className="text-stone-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <a
          href={current.href}
          className="text-center truncate px-2 hover:text-amber-400 transition-colors flex items-center justify-center gap-2 group mx-auto"
        >
          <span>{current.text}</span>
          <span className="text-amber-500 font-black group-hover:translate-x-0.5 transition-transform">→</span>
        </a>

        <button
          onClick={handleNext}
          aria-label="Next announcement"
          className="text-stone-400 hover:text-white p-1 rounded transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
