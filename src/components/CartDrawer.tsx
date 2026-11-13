'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Trash2, ShoppingBag, Clock, X, Plus, Minus } from 'lucide-react';
import { CartItem } from '@/types';
import { getWhatsAppUrl } from '@/config/store';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemoveItem: (cartId: string) => void;
  onUpdateQty?: (cartId: string, delta: number) => void;
  onClearCart: () => void;
  onOpenItemDetail?: (itemId: string) => void;
  onPlaySound?: (type: 'slide' | 'open' | 'click' | 'flip' | 'sway') => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  cart,
  onRemoveItem,
  onUpdateQty,
  onClearCart,
  onOpenItemDetail,
  onPlaySound,
}: CartDrawerProps) {
  const [mounted, setMounted] = useState(isOpen);
  const [animatingIn, setAnimatingIn] = useState(false);

  // State modal konfirmasi hapus resmi gaya MIG UI
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    type: 'single' | 'all';
    cartId?: string;
    title: string;
    description: string;
  }>({
    isOpen: false,
    type: 'single',
    title: '',
    description: '',
  });

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      onPlaySound?.('open');
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimatingIn(true);
        });
      });
      document.body.style.overflow = 'hidden';
      return () => cancelAnimationFrame(frame);
    } else {
      setAnimatingIn(false);
      const timer = setTimeout(() => {
        setMounted(false);
        document.body.style.overflow = '';
      }, 250);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, onPlaySound]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onPlaySound?.('click');
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPlaySound]);

  if (!mounted) return null;

  const totalAmount = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.totalQty, 0);

  // SVG Resmi WhatsApp
  const WhatsAppIcon = (
    <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.04 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.81 8.1 19.14L7.54 18.82L4.43 19.64L5.26 16.6L4.91 16.03C4.18 14.77 3.8 13.35 3.8 11.91C3.8 7.37 7.5 3.67 12.04 3.67ZM8.73 7.34C8.54 7.34 8.35 7.35 8.17 7.73C7.99 8.12 7.45 8.63 7.45 9.69C7.45 10.74 8.22 11.75 8.33 11.9C8.44 12.05 9.8 14.23 11.94 15.07C13.72 15.77 14.08 15.63 14.47 15.59C14.85 15.55 15.71 15.08 15.89 14.57C16.07 14.06 16.07 13.63 16.01 13.54C15.96 13.45 15.81 13.4 15.58 13.28C15.35 13.17 14.23 12.62 14.02 12.54C13.81 12.47 13.66 12.43 13.51 12.66C13.36 12.89 12.93 13.4 12.8 13.55C12.67 13.71 12.54 13.73 12.31 13.61C12.08 13.5 11.35 13.26 10.47 12.48C9.79 11.87 9.33 11.12 9.2 10.89C9.07 10.66 9.18 10.54 9.3 10.42C9.4 10.32 9.53 10.15 9.65 10.01C9.76 9.87 9.8 9.77 9.88 9.62C9.96 9.46 9.92 9.33 9.86 9.22C9.8 9.11 9.35 7.99 9.16 7.54C8.98 7.1 8.79 7.16 8.73 7.34Z" />
    </svg>
  );

  const handleCheckoutWA = () => {
    if (cart.length === 0) return;

    let text = `Halo MIG Digital Printing, saya mau pesan apparel dari katalog:\n\n`;
    cart.forEach((item, idx) => {
      text += `*${idx + 1}. ${item.name}* (${item.colorName})\n`;
      const sizeBreakdown = Object.entries(item.sizes)
        .map(([sz, qty]) => `${sz}: ${qty} pcs`)
        .join(', ');
      text += `   - Rincian Ukuran: ${sizeBreakdown} (Total ${item.totalQty} pcs)\n`;
      if (item.addons.sablon) text += `   - Tambahan: Cetak logo / nama dada\n`;
      if (item.addons.giftbox) text += `   - Tambahan: Kemasan kotak kado\n`;
      text += `   - Subtotal: Rp ${item.totalPrice.toLocaleString('id-ID')}\n\n`;
    });

    text += `*Total Pembayaran:* Rp ${totalAmount.toLocaleString('id-ID')} (${totalItems} pcs)\n\n`;
    text += `Catatan: Desain dan logo akan saya kirimkan lewat WhatsApp ini setelah pesanan dibuat.\n`;
    text += `Mohon konfirmasi pesanan dan estimasi waktu jadi ya. Terima kasih!`;

    window.open(getWhatsAppUrl(text), '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* 1. Backdrop Overlay Gelap Redup */}
      <div
        onClick={() => {
          onPlaySound?.('click');
          onClose();
        }}
        className={`fixed inset-0 bg-ink/40 backdrop-blur-xs transition-opacity duration-200 ease-out ${
          animatingIn ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />

      {/* 2. Side Drawer Kanan (Sesuai Desain Sistem MIG UI) */}
      <aside
        role="dialog"
        aria-label="Keranjang Belanja"
        className={`relative z-10 w-full sm:max-w-[460px] md:max-w-[480px] h-full bg-page flex flex-col shadow-float border-l border-line transition-transform duration-250 ease-out transform ${
          animatingIn ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* HEADER KERANJANG (Tombol Kembali 44px, Judul, dan Tombol Hapus Semua) */}
        <header className="sticky top-0 z-40 glass px-4 py-3 flex items-center justify-between flex-shrink-0 border-b border-line">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => {
                onPlaySound?.('click');
                onClose();
              }}
              className="press w-11 h-11 rounded-full bg-surface border border-line shadow-xs flex items-center justify-center hover:bg-page text-ink transition-colors flex-shrink-0 cursor-pointer"
              aria-label="Kembali ke katalog"
              title="Tutup Keranjang"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2]" />
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <h1 className="text-xl font-bold text-ink tracking-tight truncate">
                Keranjang
              </h1>
              {totalItems > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-soft text-brand flex-shrink-0 tabular-nums">
                  {totalItems} pcs
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {cart.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  onPlaySound?.('click');
                  setConfirmDelete({
                    isOpen: true,
                    type: 'all',
                    title: 'Hapus semua barang?',
                    description: 'Semua produk yang ada di dalam keranjang akan dikosongkan.',
                  });
                }}
                className="press h-10 px-3.5 rounded-full bg-danger-bg text-danger-fg hover:opacity-90 flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer"
                title="Hapus semua barang"
                aria-label="Hapus semua barang dari keranjang"
              >
                <Trash2 className="w-3.5 h-3.5 stroke-[2]" />
                <span>Hapus semua</span>
              </button>
            )}

            {/* Tombol X Tutup Desktop */}
            <button
              type="button"
              onClick={() => {
                onPlaySound?.('click');
                onClose();
              }}
              className="press hidden md:flex w-10 h-10 rounded-full bg-surface border border-line items-center justify-center text-muted hover:text-ink hover:bg-page transition-colors cursor-pointer"
              aria-label="Tutup"
              title="Tutup (Esc)"
            >
              <X className="w-4 h-4 stroke-[2]" />
            </button>
          </div>
        </header>

        {/* AREA DAFTAR KARTU PRODUK (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-4 py-4 pb-36 space-y-3.5">
          {cart.length === 0 ? (
            /* Tampilan Keranjang Kosong Khas MIG UI */
            <div className="h-full min-h-[360px] flex flex-col items-center justify-center text-center py-16 px-6">
              <div className="w-20 h-20 rounded-full bg-surface border border-line flex items-center justify-center text-muted mb-4 shadow-xs">
                <ShoppingBag className="w-8 h-8 stroke-[1.8]" />
              </div>
              <h3 className="text-lg font-bold text-ink">Keranjang masih kosong</h3>
              <p className="text-xs text-muted mt-1.5 max-w-[260px] leading-relaxed">
                Pilih pakaian dari rak katalog dan tentukan ukuran yang ingin dipesan.
              </p>
              <button
                type="button"
                onClick={() => {
                  onPlaySound?.('click');
                  onClose();
                }}
                className="press mt-6 px-6 py-2.5 rounded-full bg-brand hover:bg-brand-hover text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            <>
              {/* Badge Promo / Gratis Ongkir khas Web Pembeli MIG */}
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-success-bg text-success-fg text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-success-fg animate-pulse shrink-0" />
                <span className="truncate">Gratis antar & bonus stiker untuk pesanan 12 pcs ke atas</span>
              </div>

              {/* Kartu per Item Keranjang (Radius 32px Sesuai DESIGN-SYSTEM.md) */}
              {cart.map((item) => {
                const sizeSummary = Object.entries(item.sizes)
                  .map(([sz, qty]) => `${sz}: ${qty} pcs`)
                  .join(', ');
                const addonsList: string[] = [];
                if (item.addons.sablon) addonsList.push('Sablon Logo/Nama');
                if (item.addons.giftbox) addonsList.push('Kemasan Kado');
                const specText = addonsList.length > 0 
                  ? `${sizeSummary} · ${addonsList.join(' · ')}` 
                  : `${sizeSummary} · Standar MIG`;

                return (
                  <div
                    key={item.cartId}
                    className="bg-surface rounded-card border border-line p-4 sm:p-5 flex flex-col gap-3.5 shadow-xs transition-all"
                  >
                    {/* Header Item: Thumbnail + Nama + Badge + Tombol Hapus */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Thumbnail Kotak Ikon 16px radius */}
                        <div className="w-14 h-14 rounded-2xl bg-page border border-line flex items-center justify-center shrink-0 relative overflow-hidden p-1 shadow-xs">
                          {item.frontPhoto ? (
                            <img
                              src={item.frontPhoto}
                              alt={item.name}
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span
                              className="w-7 h-7 rounded-xl border-2 border-surface shadow-xs"
                              style={{ backgroundColor: item.hex }}
                            />
                          )}
                        </div>

                        {/* Nama Produk & Badge */}
                        <div className="flex flex-col min-w-0">
                          <h4 className="text-[15px] sm:text-[16px] font-bold text-ink leading-tight truncate">
                            {item.name}
                          </h4>
                          <span className="text-xs text-muted mt-0.5">
                            {item.totalQty} pcs ({item.colorName})
                          </span>

                          {/* Badge Ungu Pill 24px */}
                          <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-brand-soft text-brand text-[11px] font-semibold w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                            <span>Sablon DTF Presisi</span>
                          </div>
                        </div>
                      </div>

                      {/* Tombol Hapus Item */}
                      <button
                        type="button"
                        onClick={() => {
                          onPlaySound?.('click');
                          setConfirmDelete({
                            isOpen: true,
                            type: 'single',
                            cartId: item.cartId,
                            title: `Hapus ${item.name}?`,
                            description: `Semua pilihan produk ${item.name} (${item.colorName}) akan dihapus dari keranjang.`,
                          });
                        }}
                        className="press text-muted hover:text-danger-fg transition-colors p-2 rounded-full hover:bg-danger-bg cursor-pointer"
                        aria-label="Hapus produk ini"
                        title="Hapus produk ini"
                      >
                        <Trash2 className="w-4 h-4 stroke-[1.8]" />
                      </button>
                    </div>

                    {/* Kotak Varian & Rincian Ukuran */}
                    <div className="bg-page rounded-2xl p-3.5 flex flex-col gap-2.5 border border-line/60">
                      <p className="text-xs font-semibold text-ink leading-relaxed">
                        {specText}
                      </p>
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-line/50">
                        {/* Stepper Jumlah 32px */}
                        <div className="flex items-center gap-2 bg-surface px-2 py-1 rounded-full border border-line shadow-xs">
                          <button
                            type="button"
                            onClick={() => {
                              onPlaySound?.('click');
                              onUpdateQty?.(item.cartId, -1);
                            }}
                            className="press w-6 h-6 rounded-full bg-page hover:bg-line text-ink flex items-center justify-center transition-colors cursor-pointer"
                            aria-label="Kurangi jumlah"
                            title="Kurangi 1 pcs"
                          >
                            <Minus className="w-3 h-3 stroke-[2]" />
                          </button>
                          <span className="text-xs font-bold text-ink min-w-[36px] text-center tabular-nums">
                            {item.totalQty} pcs
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              onPlaySound?.('click');
                              onUpdateQty?.(item.cartId, 1);
                            }}
                            className="press w-6 h-6 rounded-full bg-page hover:bg-line text-ink flex items-center justify-center transition-colors cursor-pointer"
                            aria-label="Tambah jumlah"
                            title="Tambah 1 pcs"
                          >
                            <Plus className="w-3 h-3 stroke-[2]" />
                          </button>
                        </div>

                        <strong className="text-[15px] font-bold text-brand tabular-nums">
                          Rp {item.totalPrice.toLocaleString('id-ID')}
                        </strong>
                      </div>
                    </div>

                    {/* Link Tambah Ukuran Lain */}
                    <button
                      type="button"
                      onClick={() => {
                        onPlaySound?.('slide');
                        if (onOpenItemDetail) {
                          onOpenItemDetail(item.itemId);
                        } else {
                          onClose();
                        }
                      }}
                      className="press text-brand hover:text-brand-hover font-semibold text-xs flex items-center gap-1.5 w-fit cursor-pointer"
                    >
                      <span className="text-sm font-bold">+</span>
                      <span>Ubah atau tambah ukuran lain</span>
                    </button>
                  </div>
                );
              })}

              {/* Kotak Pemberitahuan Desain WhatsApp (Sesuai Web Pembeli) */}
              <div className="bg-surface rounded-2xl p-3.5 flex items-start gap-3 border border-line shadow-xs">
                <div className="w-8 h-8 rounded-full bg-page flex items-center justify-center text-ink shrink-0">
                  {WhatsAppIcon}
                </div>
                <div className="flex flex-col text-xs">
                  <span className="font-semibold text-ink">Kirim Desain & Konsultasi CS</span>
                  <span className="text-muted leading-relaxed mt-0.5">
                    File sablon, logo, dan revisi desain dikirimkan langsung via WhatsApp setelah pesanan dibuat.
                  </span>
                </div>
              </div>

              {/* Perkiraan Waktu Pengerjaan */}
              <div className="flex items-center gap-2 text-xs text-muted px-2 pt-1 pb-2">
                <Clock className="w-4 h-4 text-muted shrink-0" />
                <span>Perkiraan jadi: 1-2 hari kerja setelah desain disetujui</span>
              </div>
            </>
          )}
        </div>

        {/* FLOATING ACTION FOOTER (Total & Tombol Pesan via WhatsApp) */}
        {cart.length > 0 && (
          <div className="sticky bottom-0 left-0 right-0 z-30 p-4 pb-[max(18px,calc(14px+env(safe-area-inset-bottom)))] glass border-t border-line flex flex-col gap-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs text-muted font-medium">
                Total Perkiraan ({totalItems} pcs)
              </span>
              <strong className="text-xl sm:text-2xl font-bold text-ink tracking-tight tabular-nums">
                Rp {totalAmount.toLocaleString('id-ID')}
              </strong>
            </div>

            {/* Tombol Utama WhatsApp 44px Pill Ungu Brand */}
            <button
              type="button"
              onClick={() => {
                onPlaySound?.('click');
                handleCheckoutWA();
              }}
              className="press w-full h-11 px-6 rounded-full bg-brand hover:bg-brand-hover text-white text-sm font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              {WhatsAppIcon}
              <span>Pesan via WhatsApp</span>
            </button>
          </div>
        )}

        {/* MODAL KONFIRMASI HAPUS RESMI GAYA MIG UI (Tombol Ditumpuk) */}
        {confirmDelete.isOpen && (
          <div
            className="fixed inset-0 z-[100] bg-ink/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setConfirmDelete((prev) => ({ ...prev, isOpen: false }))}
          >
            <div
              role="alertdialog"
              aria-modal="true"
              className="bg-surface rounded-card max-w-[340px] w-full p-6 shadow-float border border-line flex flex-col gap-4 text-center animate-scaleUp"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col gap-1.5">
                <h3 className="text-base font-bold text-ink">
                  {confirmDelete.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  {confirmDelete.description}
                </p>
              </div>

              {/* Footer Tombol Ditumpuk Sesuai Aturan MIG UI */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onPlaySound?.('click');
                    if (confirmDelete.type === 'all') {
                      onClearCart();
                    } else if (confirmDelete.cartId) {
                      onRemoveItem(confirmDelete.cartId);
                    }
                    setConfirmDelete((prev) => ({ ...prev, isOpen: false }));
                  }}
                  className="press w-full h-11 rounded-full bg-danger-fg text-white text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer flex items-center justify-center"
                >
                  Hapus
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onPlaySound?.('click');
                    setConfirmDelete((prev) => ({ ...prev, isOpen: false }));
                  }}
                  className="press w-full h-11 rounded-full bg-surface border border-line text-ink text-sm font-semibold hover:bg-page transition-colors cursor-pointer flex items-center justify-center"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
