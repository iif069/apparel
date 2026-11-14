'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, Edit3, MoreVertical, Lock, Unlock, Moon, Sun } from 'lucide-react';
import { CategoryId } from '@/types';
import { BackgroundMusic } from '@/components/BackgroundMusic';

interface TopbarProps {
  currentCategory: CategoryId;
  categories: { id: CategoryId; tabLabel: string }[];
  onSelectCategory: (id: CategoryId) => void;
  onOpenCustomModal: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isAdmin: boolean;
  onToggleAdmin: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
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
  isDarkMode,
  onToggleDarkMode,
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

            {/* Tombol Musik Latar (BGM) */}
            <BackgroundMusic soundEnabled={soundEnabled} />

            {/* Tombol Mode Gelap / Uji Spotlight & Flash Reflektif */}
            <button
              type="button"
              onClick={onToggleDarkMode}
              title={isDarkMode ? 'Aktifkan Mode Terang' : 'Aktifkan Mode Gelap (Spotlight & Flash Reflektif)'}
              aria-label={isDarkMode ? 'Aktifkan Mode Terang' : 'Aktifkan Mode Gelap'}
              aria-pressed={isDarkMode}
              className={`press shrink-0 flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full border transition-all cursor-pointer shadow-xs ${
                isDarkMode
                  ? 'bg-brand text-white border-brand-hover shadow-glow'
                  : 'bg-surface text-ink border-line hover:border-brand/40'
              }`}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

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
