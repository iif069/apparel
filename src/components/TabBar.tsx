'use client';

import React from 'react';
import { LayoutGrid, ShoppingCart, Info } from 'lucide-react';

export type TabKey = 'katalog' | 'keranjang' | 'info';

interface TabBarProps {
  activeTab: TabKey;
  onSelectTab: (key: TabKey) => void;
  cartCount: number;
  className?: string;
}

const TABS = [
  { key: 'katalog' as TabKey, label: 'Katalog', icon: LayoutGrid },
  { key: 'keranjang' as TabKey, label: 'Keranjang', icon: ShoppingCart },
  { key: 'info' as TabKey, label: 'Info Toko', icon: Info },
];

/**
 * TabBar Melayang (Float) khas Web Pembeli MIG Digital Printing
 * Sesuai aturan DESIGN-SYSTEM.md v1.10:
 * - Pill kaca melayang 12px dari bawah layar (glass shadow-glass ring-1 ring-surface/70)
 * - Tab aktif: pill ungu tipis bg-brand/10 text-brand tanpa garis bawah
 * - Ikon 24-26px garis 1.8, label 11px font-medium
 */
export function TabBar({ activeTab, onSelectTab, cartCount, className = '' }: TabBarProps) {
  return (
    <nav
      aria-label="Menu navigasi utama"
      className={`fixed z-40 inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] mx-auto max-w-sm rounded-full p-1 glass shadow-glass ring-1 ring-surface/70 ring-inset grid grid-cols-3 gap-0.5 ${className}`}
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onSelectTab(tab.key)}
            className={`press flex min-h-[52px] flex-col items-center justify-center gap-0.5 rounded-full px-2 text-[11px] transition-colors cursor-pointer select-none ${
              isActive
                ? 'bg-brand/10 font-semibold text-brand'
                : 'font-normal text-ink hover:text-brand'
            }`}
          >
            <span className="relative">
              <Icon size={24} strokeWidth={1.8} aria-hidden="true" />
              {tab.key === 'keranjang' && cartCount > 0 && (
                <span className="animate-bump absolute -top-1 -right-2.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white ring-2 ring-surface tabular-nums">
                  {cartCount}
                </span>
              )}
            </span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
