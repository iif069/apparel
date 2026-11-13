'use client';

import React, { useEffect } from 'react';
import { X, MapPin, Clock, MessageCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface StoreInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StoreInfoModal({ isOpen, onClose }: StoreInfoModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="store-info-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-xs animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md bg-surface border border-line rounded-card shadow-float p-6 max-h-[90vh] overflow-y-auto flex flex-col gap-4 animate-scaleUp">
        {/* Header Toko */}
        <div className="flex items-start justify-between gap-3 border-b border-line pb-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo.svg"
              alt="MIG Logo"
              className="w-12 h-12 rounded-full object-cover border border-line shadow-xs shrink-0"
            />
            <div className="flex flex-col">
              <h2 id="store-info-title" className="text-xl font-bold text-ink leading-tight">
                MIG Digital Printing
              </h2>
              <span className="text-xs text-muted font-medium mt-0.5">
                Pusat Apparel & Percetakan Digital Rajadesa
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="press p-2 rounded-full text-muted hover:text-ink hover:bg-page transition-colors cursor-pointer"
            aria-label="Tutup jendela info"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Jam Buka */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-page border border-line">
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-brand" />
            <div className="flex flex-col">
              <span className="text-xs font-bold text-ink">Senin – Sabtu: 08.00 – 17.00 WIB</span>
              <span className="text-[11px] text-muted">Minggu / Hari Libur: Pesanan Online Tetap Diproses</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-success-bg text-success-fg">
            <span className="w-2 h-2 rounded-full bg-success-fg animate-pulse" />
            Buka
          </span>
        </div>

        {/* Layanan Apparel & Percetakan */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted px-1">
            Layanan Kami
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-3 rounded-2xl bg-page border border-line/70 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
              <span className="font-semibold text-ink">Kaos Sablon DTF</span>
            </div>
            <div className="p-3 rounded-2xl bg-page border border-line/70 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
              <span className="font-semibold text-ink">Jersey Printing</span>
            </div>
            <div className="p-3 rounded-2xl bg-page border border-line/70 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
              <span className="font-semibold text-ink">Kemeja & PDH Bordir</span>
            </div>
            <div className="p-3 rounded-2xl bg-page border border-line/70 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-brand shrink-0" />
              <span className="font-semibold text-ink">Banner & Digital</span>
            </div>
          </div>
        </div>

        {/* Lokasi Workshop */}
        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-page border border-line text-xs">
          <MapPin className="w-4 h-4 text-brand shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-ink">Workshop MIG Digital Printing</span>
            <span className="text-muted leading-relaxed">
              Jl. Raya Rajadesa (Dekat Alun-alun Rajadesa), Kec. Rajadesa, Kabupaten Ciamis, Jawa Barat.
            </span>
          </div>
        </div>

        {/* Aksi Kontak CS */}
        <div className="flex flex-col gap-2 pt-2">
          <a
            href="https://wa.me/6281222400922?text=Halo%20MIG%20Digital%20Printing%2C%20saya%20mau%20konsultasi%20bikin%20desain%20custom%20apparel%2Fjersey"
            target="_blank"
            rel="noopener noreferrer"
            className="press flex items-center justify-center gap-2 w-full h-11 px-5 rounded-full bg-brand hover:bg-brand-hover text-white text-sm font-bold shadow-xs transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Desain Custom? Chat via WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={onClose}
            className="press flex items-center justify-center w-full h-11 px-5 rounded-full bg-surface border border-line text-ink text-sm font-semibold hover:bg-page transition-colors cursor-pointer"
          >
            <span>Tutup</span>
          </button>
        </div>
      </div>
    </div>
  );
}
