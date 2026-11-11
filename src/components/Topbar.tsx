'use client';

import React, { useState } from 'react';
import { ShoppingCart, Volume2, VolumeX, Edit3, MoreVertical } from 'lucide-react';
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
}: TopbarProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  return (
    <>
      <header className="sticky top-0 w-full h-[64px] md:h-[68px] z-50 bg-surface border-b border-line flex items-center px-4 md:px-7">
        <div className="w-full max-w-[1340px] mx-auto flex items-center justify-between gap-3">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 cursor-pointer">
            <img src="/logo.svg" alt="MIG Logo" className="w-[30px] h-[30px] md:w-[34px] md:h-[34px] object-contain" />
            <span className="font-bold text-[17px] md:text-[19px] tracking-tight text-ink">MIG Apparel</span>
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
            {/* Desktop: Atur Katalog */}
            <button
              type="button"
              onClick={onOpenCustomModal}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-semibold bg-surface text-ink border border-line hover:bg-page transition-colors press-active"
            >
              <Edit3 className="w-4 h-4 text-ink" />
              <span>Atur katalog</span>
            </button>

            {/* Desktop: Suara */}
            <button
              type="button"
              onClick={onToggleSound}
              title={soundEnabled ? 'Matikan suara' : 'Aktifkan suara'}
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full bg-surface text-ink border border-line hover:bg-page transition-colors press-active"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-brand" /> : <VolumeX className="w-4 h-4 text-ink/40" />}
            </button>

            {/* Tombol Keranjang Belanja */}
            <button
              type="button"
              onClick={onOpenCart}
              className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-surface text-ink border border-line hover:bg-page transition-colors press-active relative"
            >
              <ShoppingCart className="w-4 h-4 text-ink" />
              <span className="hidden sm:inline text-[13px] font-semibold">Keranjang</span>
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[11px] font-bold rounded-full bg-brand text-surface">
                {cartCount}
              </span>
            </button>

            {/* Tombol Menu Lainnya di HP */}
            <div className="relative md:hidden">
              <button
                type="button"
                onClick={() => setShowMoreMenu((prev) => !prev)}
                className="flex items-center justify-center w-9 h-9 rounded-full bg-surface text-ink border border-line hover:bg-page press-active"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {showMoreMenu && (
                <div className="absolute right-0 top-11 w-48 bg-surface border border-line rounded-2xl shadow-float p-1.5 z-50 flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowMoreMenu(false);
                      onOpenCustomModal();
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-ink hover:bg-page rounded-xl text-left"
                  >
                    <Edit3 className="w-4 h-4 text-brand" />
                    <span>Atur katalog</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onToggleSound();
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 text-[13px] font-medium text-ink hover:bg-page rounded-xl text-left"
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

      {/* Bar Kategori Khusus di HP (Menempel rapi di bawah Topbar) */}
      <div className="md:hidden sticky top-[64px] z-40 w-full bg-page/95 backdrop-blur-sm border-b border-line px-3.5 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold whitespace-nowrap transition-all press-active ${
              currentCategory === cat.id
                ? 'bg-ink text-surface shadow-sm'
                : 'bg-surface text-ink border border-line'
            }`}
          >
            {cat.tabLabel}
          </button>
        ))}
      </div>
    </>
  );
}
