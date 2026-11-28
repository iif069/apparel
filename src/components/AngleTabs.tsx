'use client';

import React from 'react';
import { ViewAngle } from '@/types';

interface AngleTabsProps {
  currentAngle: ViewAngle;
  onSelectAngle: (angle: ViewAngle) => void;
  onPlaySound?: (type: 'slide' | 'open' | 'click' | 'flip') => void;
  className?: string;
}

export function AngleTabs({
  currentAngle,
  onSelectAngle,
  onPlaySound,
  className = '',
}: AngleTabsProps) {
  const tabs: { angle: ViewAngle; label: string }[] = [
    { angle: 'side-left', label: 'Samping' },
    { angle: 'front', label: 'Depan' },
    { angle: 'back', label: 'Belakang' },
  ];

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const nextIdx =
        e.key === 'ArrowRight'
          ? (idx + 1) % tabs.length
          : (idx - 1 + tabs.length) % tabs.length;
      onPlaySound?.('flip');
      onSelectAngle(tabs[nextIdx].angle);
    }
  };

  return (
    <div
      role="group"
      aria-label="Sudut tampilan"
      className={`inline-flex items-center justify-center gap-1 md:gap-1.5 xl:gap-2 p-1 bg-surface border border-line rounded-full shadow-sm ${className}`}
    >
      {tabs.map((tab, idx) => {
        const isActive =
          currentAngle === tab.angle || (tab.angle === 'side-left' && currentAngle.startsWith('side'));

        return (
          <button
            key={tab.angle}
            type="button"
            aria-pressed={isActive}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            onClick={() => {
              onPlaySound?.('flip');
              onSelectAngle(tab.angle);
            }}
            className={`min-w-[76px] md:min-w-[88px] lg:min-w-[80px] xl:min-w-[96px] min-h-[44px] h-11 px-3 md:px-3.5 xl:px-4 rounded-full text-[12.5px] md:text-[13px] font-semibold transition-colors press-active cursor-pointer ${
              isActive
                ? 'bg-ink text-surface shadow-sm'
                : 'text-ink/70 hover:text-ink hover:bg-page'
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
