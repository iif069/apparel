'use client';

import React, { useState } from 'react';
import { ShoppingCart, Volume2, VolumeX, Edit3, MoreVertical, Lock, Unlock } from 'lucide-react';
import { CategoryId } from '@/types';

interface TopbarProps {
  currentCategory: CategoryId;
  categories: { id: CategoryId; tabLabel: string }[];
  onSelectCategory: (id: CategoryId) => void;
  cartCount: number;
  onOpenCart: () => void;
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
  cartCount,
  onOpenCart,
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
      <header className="sticky top-0 w-full h-[72px] md:h-[76px] z-50 bg-surface border-b border-line flex items-center px-4 md:px-7">
        <div className="w-full max-w-[1340px] mx-auto flex items-center justify-between gap-3">
          {/* Logo & Brand (Secret click area) */}
          <div
            onClick={handleLogoSecretClick}
            className="flex items-center gap-3 cursor-pointer select-none group"
            title={isAdmin ? "Mode Admin Aktif (Klik 5x untuk keluar)" : "MIG Apparel"}
          >
            <img
              src="/logo.svg"
              alt="MIG Logo"
              className="w-[38px] h-[38px] md:w-[42px] md:h-[42px] rounded-full object-cover overflow-hidden transition-transform group-active:scale-95 shadow-xs border border-line/60"
            />
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[18px] md:text-[20px] tracking-tight text-ink leading-tight">
                  MIG Apparel
                </span>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand text-surface shadow-xs animate-pulse">
                    <Unlock className="w-2.5 h-2.5" />
                    ADMIN
                  </span>
                )}
              </div>
              <span className="text-[11.5px] md:text-[12px] text-ink/55 font-medium leading-none mt-0.5">
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
                className={`px-4 py-2 rounded-full text-[13.5px] font-semibold transition-all press-active ${
                  currentCategory === cat.id
                    ? 'bg-ink text-surface shadow-sm'
                    : 'bg-surface text-ink border border-line hover:border-ink/30'
                }`}
              >
                {cat.tabLabel}
              </button>
            ))}
          </nav>

          {/* Sisi Kanan: Atur Katalog, Suara, Keranjang */}
          <div className="flex items-center gap-2">
            {/* Desktop: Atur Katalog (HANYA MUNCUL DI MODE ADMIN) */}
            {isAdmin && (
              <div className="hidden md:flex items-center gap-1.5 bg-brand-soft border border-brand/20 rounded-full pl-3 pr-1 py-1">
                <button
                  type="button"
                  onClick={onOpenCustomModal}
                  className="flex items-center gap-1.5 text-[12.5px] font-semibold text-brand hover:text-brand-hover press-active"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Atur katalog</span>
                </button>
                <button
                  type="button"
                  onClick={onToggleAdmin}
                  title="Kunci & Keluar Mode Admin"
                  className="p-1 rounded-full text-muted hover:text-red-600 hover:bg-white/80 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Desktop: Suara */}
            <button
              type="button"
              onClick={onToggleSound}
              title={soundEnabled ? 'Matikan suara' : 'Aktifkan suara'}
              className="hidden md:flex items-center justify-center w-11 h-11 rounded-full bg-surface text-ink border border-line shadow-xs hover:bg-page transition-colors press-active"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-brand" /> : <VolumeX className="w-4 h-4 text-ink/40" />}
            </button>

            {/* Tombol Keranjang Belanja */}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative flex items-center justify-center w-11 h-11 md:w-auto md:h-11 md:px-4 md:gap-2.5 rounded-full bg-surface text-ink border border-line shadow-xs hover:bg-page transition-colors press-active"
              aria-label={`Keranjang belanja (${cartCount} barang)`}
            >
              <ShoppingCart className="w-5 h-5 text-ink" />
              <span className="hidden md:inline text-[13.5px] font-bold">Keranjang</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 md:static md:top-auto md:right-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold rounded-full bg-brand text-surface shadow-xs">
                  {cartCount}
                </span>
              )}
              {cartCount === 0 && (
                <span className="hidden md:inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold rounded-full bg-line text-ink/60">
                  0
                </span>
              )}
            </button>

            {/* Tombol Menu Lainnya di HP */}
            <div className="relative md:hidden">
              <button
                type="button"
                onClick={() => setShowMoreMenu((prev) => !prev)}
                className="flex items-center justify-center w-11 h-11 rounded-full bg-surface text-ink border border-line shadow-xs hover:bg-page press-active"
                aria-label="Menu lainnya"
              >
                <MoreVertical className="w-5 h-5 text-ink" />
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 top-13 w-52 bg-surface border border-line rounded-2xl shadow-float p-1.5 z-50 flex flex-col gap-1">
                  {isAdmin && (
                    <>
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
                    </>
                  )}
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
          </div>
        </div>
      </header>
    </>
  );
}
