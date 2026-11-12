'use client';

import React from 'react';

interface HangerHookSVGProps {
  priceTagText?: string;
  showPriceTag?: boolean;
  isSideView?: boolean;
  hideHangerBody?: boolean;
  className?: string;
}

export function HangerHookSVG({
  priceTagText,
  showPriceTag = false,
  isSideView = false,
  hideHangerBody = false,
  className = '',
}: HangerHookSVGProps) {
  return (
    <div className={`relative pointer-events-none select-none ${className}`}>
      {/* 1. Hanger Assembly (Hook Logam & Bahu Melengkung) */}
      <svg
        className="w-full h-full block"
        viewBox="0 0 120 62"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          {/* Gradien Logam Krom Halus pada Kait Atas */}
          <linearGradient id="hangerChromeGrad" x1="56" y1="2" x2="68" y2="30" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#d8d6de" />
            <stop offset="45%" stopColor="#ffffff" />
            <stop offset="70%" stopColor="#4a4846" />
            <stop offset="100%" stopColor="#1a1918" />
          </linearGradient>

          {/* Gradien Material Gantungan (Hitam Pekat Elegan dengan Kilap Halus di Bahu) */}
          <linearGradient id="hangerBodyGrad" x1="12" y1="28" x2="108" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1c1b1a" />
            <stop offset="48%" stopColor="#3a3836" />
            <stop offset="52%" stopColor="#55524f" />
            <stop offset="56%" stopColor="#2c2a29" />
            <stop offset="100%" stopColor="#151413" />
          </linearGradient>
        </defs>

        {/* Leher & Kait Melengkung Masuk ke Pipa Wire */}
        <path
          d="M 60 28 C 60 18, 56 12, 59 7 C 61 3, 67 3, 68 7 C 69 11, 66 14, 63 15"
          stroke="url(#hangerChromeGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Bahu Gantungan Melengkung: Sesuai Sudut Pandang (Disembunyikan jika foto baju sudah memiliki gantungan sendiri) */}
        {!hideHangerBody && (
          <path
            d={isSideView ? "M 44 49 Q 60 32 76 49" : "M 12 55 Q 60 28 108 55"}
            stroke="url(#hangerBodyGrad)"
            strokeWidth="7.5"
            strokeLinecap="round"
            className="transition-all duration-300 ease-out"
          />
        )}
      </svg>

      {/* 2. Tali & Label Harga (Memudar halus saat baju aktif/di-hover) */}
      <div
        className={`absolute top-[20px] left-[52px] pointer-events-none z-10 transition-opacity duration-300 ${
          showPriceTag && priceTagText ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Tali Benang Tag Miring */}
        <svg className="w-[14px] h-[16px] block overflow-visible" viewBox="0 0 14 16" fill="none">
          <path
            d="M 1 1 Q 5 7 10 14"
            stroke="#8a30d1"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeDasharray="2 1.5"
            opacity="0.85"
          />
        </svg>

        {/* Label Harga Miring (-8°) Warna Ungu Brand Lembut */}
        <span
          className="absolute -top-[2px] left-[10px] inline-flex items-center gap-1 font-semibold text-[9.5px] leading-tight text-brand bg-brand-soft border border-brand/40 px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap transform -rotate-[8deg] origin-top-left"
        >
          <span className="w-1.5 h-1.5 rounded-full border border-brand/50 bg-white" />
          {priceTagText}
        </span>
      </div>
    </div>
  );
}
