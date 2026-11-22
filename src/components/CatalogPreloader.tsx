'use client';

import React, { useEffect, useState } from 'react';

interface CatalogPreloaderProps {
  loaded: number;
  total: number;
  isReady: boolean;
}

export function CatalogPreloader({ loaded, total, isReady }: CatalogPreloaderProps) {
  const [isExiting, setIsExiting] = useState(false);
  const [isUnmounted, setIsUnmounted] = useState(false);

  useEffect(() => {
    if (!isReady) return;

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 180);

    const unmountTimer = setTimeout(() => {
      setIsUnmounted(true);
    }, 560);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
    };
  }, [isReady]);

  if (isUnmounted) return null;

  const percentage = total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : isReady ? 100 : 0;

  let statusText = 'Menyiapkan katalog pakaian…';
  if (isReady) {
    statusText = 'Katalog siap ditampilkan!';
  } else if (percentage >= 92) {
    statusText = 'Menyiapkan tampilan rak…';
  } else if (total > 0) {
    statusText = `Mengunduh produk (${loaded}/${total})`;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Memuat katalog produk ${percentage}%`}
      className={`fixed inset-0 z-[120] bg-page flex flex-col items-center justify-center px-6 select-none transition-all duration-[350ms] ease-out motion-reduce:transition-none ${
        isExiting ? 'opacity-0 scale-[1.015] pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Cahaya latar lembut */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute w-[320px] h-[320px] rounded-full bg-brand-soft/80 blur-3xl opacity-75"
      />

      <div className="relative z-10 w-full max-w-[320px] flex flex-col items-center text-center">
        {/* Emblem Logo dengan Ring Animasi */}
        <div className="relative p-[3px] rounded-full overflow-hidden shadow-[0_10px_32px_rgba(123,41,186,0.18)] mb-5">
          <span aria-hidden="true" className="cta-loop-ring pointer-events-none" />
          <div className="relative z-10 w-20 h-20 rounded-full bg-surface flex items-center justify-center p-1.5">
            <img
              src="/logo.svg"
              alt="MIG Apparel"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>

        <h1 className="text-[22px] font-bold tracking-tight text-ink leading-tight">
          MIG Apparel
        </h1>
        <p className="text-[12.5px] font-medium text-muted mt-1">
          MIG Digital Printing · Rajadesa
        </p>

        {/* Progress Bar */}
        <div className="w-full mt-6 flex flex-col gap-2.5">
          <div className="w-full h-2 rounded-full bg-line overflow-hidden p-[1px]">
            <div
              className="h-full rounded-full bg-brand transition-[width] duration-200 ease-out motion-reduce:transition-none"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-[12px] font-semibold">
            <span className="text-muted truncate pr-2">{statusText}</span>
            <span className="text-brand font-bold tabular-nums shrink-0">{percentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
