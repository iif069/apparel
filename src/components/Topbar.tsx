'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, Edit3, MoreVertical, Lock, Unlock } from 'lucide-react';
import { CategoryId } from '@/types';

interface TopbarProps {
  currentCategory: CategoryId;
  categories: { id: CategoryId; tabLabel: string }[];
  onSelectCategory: (id: CategoryId) => void;
  onOpenCustomModal: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
}

export function Topbar({
  currentCategory,
  categories,
  onSelectCategory,
  onOpenCustomModal,
  soundEnabled,
  onToggleSound,
  isAdmin,
  onToggleAdmin,
}: TopbarProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [lastClickTime, setLastClickTime] = useState(0);

  // Sentuhan rahasia pada logo (klik 5x cepat untuk mengaktifkan/menonaktifkan Mode Admin)
  const handleLogoSecretClick = () => {
    const now = Date.now();
    if (now - lastClickTime < 900) {
      const nextCount = clickCount + 1;
      if (nextCount >= 5) {
        onToggleAdmin();
        setClickCount(0);
      } else {
        setClickCount(nextCount);
      }
    } else {
      setClickCount(1);
    }
    setLastClickTime(now);
  };

  return (
    <>
      <header className="sticky top-0 w-full h-[64px] md:h-[72px] z-50 glass border-b border-line/60 flex items-center px-3 sm:px-4 md:px-7 transition-colors">
        <div className="w-full max-w-[1340px] mx-auto flex items-center justify-between gap-2.5 sm:gap-3">
          {/* Logo & Brand (Secret click area) */}
          <div
            onClick={handleLogoSecretClick}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group press min-w-0"
            title={isAdmin ? "Mode Admin Aktif (Klik 5x untuk keluar)" : "MIG Apparel"}
          >
            <img
              src="/logo.svg"
              alt="MIG Logo"
              className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 rounded-full object-cover overflow-hidden transition-transform group-active:scale-95 shadow-xs border border-line/80 shrink-0"
            />
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-bold text-[16px] sm:text-[18px] md:text-[20px] tracking-tight text-ink leading-tight truncate">
                  MIG Apparel
                </span>
                {isAdmin && (
                  <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand text-white shadow-xs animate-pulse shrink-0">
                    <Unlock className="w-2.5 h-2.5" />
                    ADMIN
                  </span>
                )}
              </div>
              <span className="text-[10.5px] sm:text-[11px] md:text-[12px] text-muted font-medium leading-none mt-0.5 truncate hidden xs:block">
                MIG Digital Printing · Rajadesa
              </span>
            </div>
          </div>

          {/* Kategori Desktop (1 baris di header) */}
          <nav className="hidden md:flex items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectCategory(cat.id)}
                className={`press px-4 py-2 rounded-full text-[13px] font-semibold transition-all ${
                  currentCategory === cat.id
                    ? 'bg-ink text-surface shadow-xs'
                    : 'bg-surface text-ink border border-line hover:border-ink/30'
                }`}
              >
                {cat.tabLabel}
              </button>
            ))}
          </nav>

          {/* Sisi Kanan: Atur Katalog, Suara, Keranjang */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Desktop: Atur Katalog (HANYA MUNCUL DI MODE ADMIN) */}
            {isAdmin && (
              <div className="hidden md:flex items-center gap-1.5 bg-brand-soft border border-brand/20 rounded-full pl-3 pr-1 py-1">
                <button
                  type="button"
                  onClick={onOpenCustomModal}
                  className="flex items-center gap-1.5 text-[12.5px] font-semibold text-brand hover:text-brand-hover press"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Atur katalog</span>
                </button>
                <button
                  type="button"
                  onClick={onToggleAdmin}
                  title="Kunci & Keluar Mode Admin"
                  className="p-1 rounded-full text-muted hover:text-danger-fg hover:bg-white/80 transition-colors press"
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Desktop: Suara (HANYA MUNCUL DI MODE ADMIN) */}
            {isAdmin && (
              <button
                type="button"
                onClick={onToggleSound}
                title={soundEnabled ? 'Matikan suara (Mode Admin)' : 'Aktifkan suara (Mode Admin)'}
                className="hidden md:flex items-center justify-center w-11 h-11 rounded-full bg-surface text-ink border border-line shadow-xs hover:bg-page transition-colors press"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-brand" /> : <VolumeX className="w-4 h-4 text-ink/40" />}
              </button>
            )}

            {/* Tombol Chat WhatsApp CS */}
            <a
              href="https://wa.me/6281222400922?text=Halo%20MIG%20Digital%20Printing%2C%20saya%20mau%20tanya%20dan%20pesan%20apparel%20dari%20katalog"
              target="_blank"
              rel="noopener noreferrer"
              className="press shrink-0 whitespace-nowrap flex items-center justify-center gap-1.5 sm:gap-2 h-10 md:h-11 px-3 sm:px-4 rounded-full bg-surface text-ink border border-line hover:border-brand/40 shadow-xs transition-colors cursor-pointer"
              aria-label="Hubungi WhatsApp CS"
            >
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.81 8.1 19.14L7.54 18.82L4.43 19.64L5.26 16.6L4.91 16.03C4.18 14.77 3.8 13.35 3.8 11.91C3.8 7.37 7.5 3.67 12.04 3.67ZM8.73 7.34C8.54 7.34 8.35 7.35 8.17 7.73C7.99 8.12 7.45 8.63 7.45 9.69C7.45 10.74 8.22 11.75 8.33 11.9C8.44 12.05 9.8 14.23 11.94 15.07C13.72 15.77 14.08 15.63 14.47 15.59C14.85 15.55 15.71 15.08 15.89 14.57C16.07 14.06 16.07 13.63 16.01 13.54C15.96 13.45 15.81 13.4 15.58 13.28C15.35 13.17 14.23 12.62 14.02 12.54C13.81 12.47 13.66 12.43 13.51 12.66C13.36 12.89 12.93 13.4 12.8 13.55C12.67 13.71 12.54 13.73 12.31 13.61C12.08 13.5 11.35 13.26 10.47 12.48C9.79 11.87 9.33 11.12 9.2 10.89C9.07 10.66 9.18 10.54 9.3 10.42C9.4 10.32 9.53 10.15 9.65 10.01C9.76 9.87 9.8 9.77 9.88 9.62C9.96 9.46 9.92 9.33 9.86 9.22C9.8 9.11 9.35 7.99 9.16 7.54C8.98 7.1 8.79 7.16 8.73 7.34Z" />
              </svg>
              <span className="text-xs sm:text-[13px] font-bold text-ink">Chat WA</span>
            </a>

            {/* Tombol Menu Mode Admin di HP (Hanya muncul jika Mode Admin aktif) */}
            {isAdmin && (
              <div className="relative md:hidden shrink-0">
                <button
                  type="button"
                  onClick={() => setShowMoreMenu((prev) => !prev)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-soft text-brand border border-brand/30 shadow-xs hover:bg-brand/10 press-active"
                  aria-label="Menu Admin"
                >
                  <MoreVertical className="w-4 h-4 text-brand" />
                </button>

                {showMoreMenu && (
                  <div className="absolute right-0 top-13 w-52 bg-surface border border-line rounded-2xl shadow-float p-1.5 z-50 flex flex-col gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setShowMoreMenu(false);
                        onOpenCustomModal();
                      }}
                      className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-semibold text-brand hover:bg-brand-soft rounded-xl text-left"
                    >
                      <Edit3 className="w-4 h-4 text-brand" />
                      <span>Atur katalog</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMoreMenu(false);
                        onToggleAdmin();
                      }}
                      className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-red-600 hover:bg-red-50 rounded-xl text-left"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Kunci / Keluar Admin</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onToggleSound();
                      }}
                      className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-ink hover:bg-page rounded-xl text-left"
                    >
                      {soundEnabled ? <Volume2 className="w-4 h-4 text-brand" /> : <VolumeX className="w-4 h-4 text-ink/40" />}
                      <span>Suara: {soundEnabled ? 'Aktif' : 'Mati'}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
