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

  return (
    <div
      role="tablist"
      aria-label="Sudut tampilan"
      className={`inline-flex items-center justify-center gap-1.5 md:gap-2 p-1 bg-surface border border-line rounded-full shadow-sm ${className}`}
    >
      {tabs.map((tab) => {
        const isActive =
          currentAngle === tab.angle || (tab.angle === 'side-left' && currentAngle.startsWith('side'));

        return (
          <button
            key={tab.angle}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => {
              onPlaySound?.('flip');
              onSelectAngle(tab.angle);
            }}
            className={`min-w-[78px] md:min-w-[96px] min-h-[44px] h-11 px-3.5 md:px-4 rounded-full text-[12.5px] md:text-[13px] font-semibold transition-all press-active cursor-pointer ${
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
