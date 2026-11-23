'use client';

import React from 'react';
import { WhatsAppIcon } from './WhatsAppIcon';

interface OrderBottomBarProps {
  onOrderViaWhatsApp: () => void;
  isMobileFloating?: boolean;
  variant?: 'inline' | 'floating' | 'dock';
  helperText?: string;
  className?: string;
}

export function OrderBottomBar({
  onOrderViaWhatsApp,
  isMobileFloating = false,
  variant,
  helperText = 'Konsultasi desain & estimasi gratis via WA',
  className = '',
}: OrderBottomBarProps) {
  const resolvedVariant = variant ?? (isMobileFloating ? 'floating' : 'inline');

  const ctaButton = (
    <button
      type="button"
      onClick={onOrderViaWhatsApp}
      className="press w-full flex items-center justify-center gap-2.5 h-12 px-5 rounded-full bg-brand hover:bg-brand-hover text-white text-[14px] font-bold shadow-sm transition-colors cursor-pointer whitespace-nowrap"
    >
      <WhatsAppIcon className="w-5 h-5 flex-shrink-0" />
      <span>Order &amp; Konsultasi via WA</span>
    </button>
  );

  const glassCard = (extraClassName = '') => (
    <div
      className={`pointer-events-auto w-full flex flex-col gap-2 px-3.5 pt-2.5 pb-3 lg:px-4 lg:py-3 rounded-[28px] ${
        resolvedVariant === 'floating'
          ? 'liquid-glass !shadow-[inset_0_1.5px_1px_rgba(255,255,255,0.96),inset_0_-1px_1px_rgba(255,255,255,0.5),0_0_0_1px_rgba(28,27,26,0.06),0_12px_32px_rgba(40,14,62,0.14)]'
          : 'bg-surface/95 backdrop-blur-2xl backdrop-saturate-150 border border-line/90 shadow-[0_10px_28px_rgba(28,27,26,0.14)]'
      } ${extraClassName}`}
    >
      {helperText && (
        <p className="text-[12px] font-semibold text-center leading-snug text-ink/90">
          {helperText}
        </p>
      )}
      {ctaButton}
    </div>
  );

  if (resolvedVariant === 'dock') {
    return glassCard(className);
  }

  if (resolvedVariant === 'floating') {
    return (
      <div
        className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 px-3 md:px-7 pb-[max(12px,env(safe-area-inset-bottom))] ${className}`}
      >
        <div className="w-full max-w-[720px] mx-auto flex justify-center">
          {glassCard()}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 pt-3 border-t border-line ${className}`}>
      {helperText && (
        <p className="text-[12px] font-semibold text-center leading-snug text-muted">
          {helperText}
        </p>
      )}
      {ctaButton}
    </div>
  );
}
