'use client';

import React from 'react';
import { ShoppingCart } from 'lucide-react';

interface OrderBottomBarProps {
  totalQty: number;
  totalPrice: number;
  onAddToCart: () => void;
  onOrderViaWhatsApp: () => void;
  isMobileFloating?: boolean;
  className?: string;
}

export function OrderBottomBar({
  totalQty,
  totalPrice,
  onAddToCart,
  onOrderViaWhatsApp,
  isMobileFloating = false,
  className = '',
}: OrderBottomBarProps) {
  // SVG Resmi WhatsApp
  const WhatsAppIcon = (
    <svg className="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.81 8.1 19.14L7.54 18.82L4.43 19.64L5.26 16.6L4.91 16.03C4.18 14.77 3.8 13.35 3.8 11.91C3.8 7.37 7.5 3.67 12.04 3.67ZM8.73 7.34C8.54 7.34 8.35 7.35 8.17 7.73C7.99 8.12 7.45 8.63 7.45 9.69C7.45 10.74 8.22 11.75 8.33 11.9C8.44 12.05 9.8 14.23 11.94 15.07C13.72 15.77 14.08 15.63 14.47 15.59C14.85 15.55 15.71 15.08 15.89 14.57C16.07 14.06 16.07 13.63 16.01 13.54C15.96 13.45 15.81 13.4 15.58 13.28C15.35 13.17 14.23 12.62 14.02 12.54C13.81 12.47 13.66 12.43 13.51 12.66C13.36 12.89 12.93 13.4 12.8 13.55C12.67 13.71 12.54 13.73 12.31 13.61C12.08 13.5 11.35 13.26 10.47 12.48C9.79 11.87 9.33 11.12 9.2 10.89C9.07 10.66 9.18 10.54 9.3 10.42C9.4 10.32 9.53 10.15 9.65 10.01C9.76 9.87 9.8 9.77 9.88 9.62C9.96 9.46 9.92 9.33 9.86 9.22C9.8 9.11 9.35 7.99 9.16 7.54C8.98 7.1 8.79 7.16 8.73 7.34Z" />
    </svg>
  );

  return (
    <div
      className={`flex flex-col gap-3 p-4 md:p-5 bg-surface border border-line rounded-3xl shadow-float ${
        isMobileFloating
          ? 'fixed left-3 right-3 bottom-[calc(12px+env(safe-area-inset-bottom))] z-40 md:static md:bottom-auto md:left-auto md:right-auto md:shadow-soft'
          : ''
      } ${className}`}
    >
      {/* 1. Baris Pertama: Total di Kiri, Harga di Kanan */}
      <div className="flex items-center justify-between w-full">
        <span className="text-[13px] md:text-[14px] font-semibold text-ink/75">
          Total · {totalQty} pcs
        </span>
        <strong className="text-[18px] md:text-[20px] font-black text-ink tracking-tight">
          Rp {totalPrice.toLocaleString('id-ID')}
        </strong>
      </div>

      {/* 2. Tombol Masukkan Keranjang (Full Width - Pill rounded-full sesuai Desain Sistem) */}
      <button
        type="button"
        onClick={onAddToCart}
        className="w-full flex items-center justify-center gap-2 h-11 md:h-12 px-6 rounded-full bg-brand hover:bg-brand-hover text-surface text-[14px] md:text-[15px] font-bold shadow-md hover:shadow-lg transition-all press-active"
      >
        <ShoppingCart className="w-4 h-4" />
        <span>Masukkan keranjang</span>
      </button>

      {/* 3. Tombol Pesan Langsung lewat WhatsApp (Full Width - Pill rounded-full sesuai Desain Sistem) */}
      <button
        type="button"
        onClick={onOrderViaWhatsApp}
        className="w-full flex items-center justify-center gap-2 h-11 md:h-12 px-6 rounded-full bg-surface hover:bg-page text-ink border border-line hover:border-ink/30 text-[13.5px] md:text-[14px] font-semibold transition-all press-active"
      >
        <span className="text-[#25D366]">{WhatsAppIcon}</span>
        <span>Pesan langsung lewat WhatsApp</span>
      </button>
    </div>
  );
}
