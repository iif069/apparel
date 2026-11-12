'use client';

import React, { useState } from 'react';
import { ArrowLeft, Trash2, ShoppingBag, Plus, Minus, Store, Truck, Clock } from 'lucide-react';
import { CartItem } from '@/types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemoveItem: (cartId: string) => void;
  onUpdateQty?: (cartId: string, delta: number) => void;
  onClearCart: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  cart,
  onRemoveItem,
  onUpdateQty,
  onClearCart,
}: CartDrawerProps) {
  const [fulfillment, setFulfillment] = useState<'Ambil di toko' | 'Kirim via ekspedisi'>('Ambil di toko');
  const [customerName, setCustomerName] = useState('');
  const [customerNote, setCustomerNote] = useState('');

  if (!isOpen) return null;

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
    if (customerName.trim()) {
      text += `*Nama Pemesan:* ${customerName.trim()}\n\n`;
    }

    text += `*DAFTAR PESANAN:*\n`;
    cart.forEach((item, idx) => {
      text += `${idx + 1}. *${item.name}* (${item.colorName})\n`;
      const sizeBreakdown = Object.entries(item.sizes)
        .map(([sz, qty]) => `${sz}: ${qty} pcs`)
        .join(', ');
      text += `   - Rincian Ukuran: ${sizeBreakdown} (Total ${item.totalQty} pcs)\n`;
      if (item.addons.sablon) text += `   - Tambahan: Cetak logo / nama dada\n`;
      if (item.addons.giftbox) text += `   - Tambahan: Kemasan kotak kado\n`;
      text += `   - Subtotal: Rp ${item.totalPrice.toLocaleString('id-ID')}\n\n`;
    });

    text += `*Total Keseluruhan:* Rp ${totalAmount.toLocaleString('id-ID')} (${totalItems} pcs)\n`;
    text += `*Metode Pengambilan:* ${fulfillment}\n`;
    if (customerNote.trim()) {
      text += `*Catatan Tambahan:* ${customerNote.trim()}\n`;
    }
    text += `\nMohon informasi ketersediaan bahan dan instruksi pembayaran/pengambilan ya. Terima kasih!`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/6281222400922?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-center">
      {/* Bingkai ala Aplikasi HP (Max-width 520px di desktop, 100% di HP) */}
      <div className="w-full max-w-[520px] h-full bg-[#faf9f6] flex flex-col shadow-2xl relative overflow-hidden">
        
        {/* 1. HEADER HALAMAN KERANJANG (Sesuai Standar Web Pembeli MIG) */}
        <header className="sticky top-0 z-40 bg-white border-b border-line px-4 py-3 flex items-center justify-between flex-shrink-0 shadow-xs">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-2.5 text-ink hover:text-brand transition-colors group press-active py-1"
            aria-label="Kembali ke katalog"
          >
            <div className="w-9 h-9 rounded-full bg-[#f1efe9] group-hover:bg-brand-soft border border-line flex items-center justify-center transition-colors">
              <ArrowLeft className="w-5 h-5 text-ink group-hover:text-brand" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[16px] md:text-[17px] font-bold text-ink leading-tight">Keranjang Saya</span>
              <span className="text-[11px] text-ink/60">MIG Digital Printing</span>
            </div>
          </button>

          {/* Ikon Keranjang + Badge Mini di Kanan */}
          <div className="w-9 h-9 rounded-full bg-[#f1efe9] border border-line flex items-center justify-center relative">
            <ShoppingBag className="w-4 h-4 text-ink" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand text-surface text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-xs">
                {totalItems}
              </span>
            )}
          </div>
        </header>

        {/* 2. SUBHEADER & TOMBOL KOSONGKAN */}
        <div className="px-4 py-2.5 bg-[#f3f1ec] border-b border-line/80 flex items-center justify-between flex-shrink-0">
          <p className="text-[13px] text-ink/75 font-semibold">
            {cart.length > 0 ? `${totalItems} item terpilih siap diproses` : 'Belum ada barang dipilih.'}
          </p>

          {cart.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Kosongkan semua barang dari keranjang?')) {
                  onClearCart();
                }
              }}
              className="flex items-center gap-1.5 text-[12px] font-bold text-ink/65 hover:text-red-600 bg-white border border-line/80 hover:border-red-300 px-3 py-1 rounded-full transition-all press-active shadow-2xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Kosongkan</span>
            </button>
          )}
        </div>

        {/* 3. AREA DAFTAR ITEM KERANJANG (Scrollable Area) */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
          {cart.length === 0 ? (
            /* Tampilan Keranjang Kosong */
            <div className="h-full flex flex-col items-center justify-center text-center py-16 px-4">
              <div className="w-20 h-20 rounded-full bg-[#f1efe9] border border-line flex items-center justify-center text-ink/40 mb-4 shadow-inner">
                <ShoppingBag className="w-9 h-9 stroke-[1.5]" />
              </div>
              <h3 className="text-[17px] font-bold text-ink">Keranjang Anda Kosong</h3>
              <p className="text-[13px] text-ink/60 mt-1 max-w-[260px] leading-relaxed">
                Pilih pakaian dari rak katalog dan tambahkan ukuran yang Anda inginkan.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 px-6 py-2.5 rounded-full bg-brand hover:bg-brand-hover text-surface text-[14px] font-bold shadow-md press-active"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            <>
              {/* Kartu per Item Keranjang */}
              {cart.map((item) => (
                <div
                  key={item.cartId}
                  className="bg-white rounded-2xl border border-line p-3.5 sm:p-4 shadow-xs flex flex-col gap-2.5 transition-all"
                >
                  {/* Baris 1: Foto/Swatch + Nama + Tombol Hapus */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Swatch Warna / Thumbnail */}
                      <div className="w-11 h-11 rounded-xl bg-page border border-line flex items-center justify-center flex-shrink-0 relative overflow-hidden shadow-2xs">
                        {item.frontPhoto ? (
                          <img
                            src={item.frontPhoto}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span
                            className="w-5 h-5 rounded-full border-2 border-white shadow-xs"
                            style={{ backgroundColor: item.hex }}
                          />
                        )}
                      </div>

                      <div className="flex flex-col min-w-0">
                        <h4 className="text-[15px] font-bold text-ink truncate leading-tight">
                          {item.name}
                        </h4>
                        <span className="text-[12px] text-ink/65 font-medium mt-0.5">
                          Warna: {item.colorName}
                        </span>
                      </div>
                    </div>

                    {/* Tombol Hapus Item */}
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.cartId)}
                      className="w-8 h-8 rounded-full border border-transparent hover:border-red-200 text-ink/40 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-all press-active flex-shrink-0"
                      aria-label="Hapus item"
                      title="Hapus barang ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Baris Varian & Rincian Ukuran */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-line/60">
                    <span className="text-[11.5px] font-semibold text-ink/60">Ukuran:</span>
                    {Object.entries(item.sizes).map(([sz, qty]) => (
                      <span
                        key={sz}
                        className="px-2 py-0.5 rounded-md bg-[#f1efe9] text-ink text-[11px] font-bold border border-line"
                      >
                        {sz} ({qty} pcs)
                      </span>
                    ))}

                    {/* Badge Addons Tambahan */}
                    {item.addons.sablon && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 text-brand text-[11px] font-semibold border border-purple-200">
                        + Sablon Dada
                      </span>
                    )}
                    {item.addons.giftbox && (
                      <span className="px-2 py-0.5 rounded-md bg-purple-50 text-brand text-[11px] font-semibold border border-purple-200">
                        + Kotak Kado
                      </span>
                    )}
                  </div>

                  {/* Baris Harga & Pengatur Kuantitas */}
                  <div className="flex items-center justify-between pt-2 border-t border-line/60">
                    <div className="flex flex-col">
                      <span className="text-[11px] text-ink/60 font-medium">
                        Harga: Rp {Math.round(item.totalPrice / Math.max(1, item.totalQty)).toLocaleString('id-ID')} /pcs
                      </span>
                      <strong className="text-[15px] font-extrabold text-ink tabular-nums">
                        Rp {item.totalPrice.toLocaleString('id-ID')}
                      </strong>
                    </div>

                    {/* Kontrol Kuantitas (+ / -) */}
                    <div className="flex items-center gap-1.5 bg-[#f6f5f1] border border-line rounded-lg p-1">
                      <button
                        type="button"
                        onClick={() => {
                          if (onUpdateQty) {
                            onUpdateQty(item.cartId, -1);
                          } else if (item.totalQty <= 1) {
                            onRemoveItem(item.cartId);
                          }
                        }}
                        className="w-7 h-7 rounded-md bg-white border border-line/80 flex items-center justify-center text-ink text-sm font-bold hover:bg-page press-active"
                        aria-label="Kurangi kuantitas"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="min-w-[28px] text-center font-bold text-[13.5px] text-ink tabular-nums">
                        {item.totalQty}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          if (onUpdateQty) {
                            onUpdateQty(item.cartId, 1);
                          }
                        }}
                        className="w-7 h-7 rounded-md bg-white border border-line/80 flex items-center justify-center text-ink text-sm font-bold hover:bg-page press-active"
                        aria-label="Tambah kuantitas"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* 4. INFORMASI PENGAMBILAN & FORM PEMESAN (Ala Web Pembeli MIG) */}
              <div className="mt-4 bg-white rounded-2xl border border-line p-4 space-y-3.5 shadow-xs">
                {/* Info Jadwal Pengambilan */}
                <div className="flex items-start gap-3 bg-purple-50/70 border border-purple-200/80 p-3 rounded-xl">
                  <div className="w-7 h-7 rounded-full bg-brand/10 text-brand flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div className="text-[12.5px] text-ink leading-relaxed">
                    <span className="font-bold text-brand block mb-0.5">Estimasi Pengambilan: Jam 15.00</span>
                    Pesanan dapat diambil di toko <b>MIG Digital Printing</b> atau dikirim via kurir ekspedisi.
                  </div>
                </div>

                {/* Pilihan Metode Pengambilan */}
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-ink block">Metode Pengambilan:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setFulfillment('Ambil di toko')}
                      className={`h-10 px-3 rounded-xl text-[12.5px] font-bold border flex items-center justify-center gap-1.5 transition-all press-active ${
                        fulfillment === 'Ambil di toko'
                          ? 'bg-brand text-white border-brand shadow-xs'
                          : 'bg-page text-ink border-line hover:border-ink/40'
                      }`}
                    >
                      <Store className="w-4 h-4" />
                      <span>Ambil di Toko</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFulfillment('Kirim via ekspedisi')}
                      className={`h-10 px-3 rounded-xl text-[12.5px] font-bold border flex items-center justify-center gap-1.5 transition-all press-active ${
                        fulfillment === 'Kirim via ekspedisi'
                          ? 'bg-brand text-white border-brand shadow-xs'
                          : 'bg-page text-ink border-line hover:border-ink/40'
                      }`}
                    >
                      <Truck className="w-4 h-4" />
                      <span>Kirim Ekspedisi</span>
                    </button>
                  </div>
                </div>

                {/* Form Nama Pemesan */}
                <div className="space-y-1">
                  <label htmlFor="customerName" className="text-[12px] font-bold text-ink block">
                    Nama Pemesan (opsional)
                  </label>
                  <input
                    id="customerName"
                    type="text"
                    placeholder="mis. Budi Santoso"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full h-11 px-3.5 bg-page border border-line rounded-xl text-[13px] text-ink focus:outline-none focus:border-brand transition-colors"
                  />
                </div>

                {/* Catatan Tambahan */}
                <div className="space-y-1">
                  <label htmlFor="customerNote" className="text-[12px] font-bold text-ink block">
                    Catatan Pesanan (opsional)
                  </label>
                  <input
                    id="customerNote"
                    type="text"
                    placeholder="mis. Tambah tulisan di dada kiri..."
                    value={customerNote}
                    onChange={(e) => setCustomerNote(e.target.value)}
                    className="w-full h-11 px-3.5 bg-page border border-line rounded-xl text-[13px] text-ink focus:outline-none focus:border-brand transition-colors"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        {/* 5. FOOTER CHECKOUT (Sticky Bottom Bar Sesuai Web Pembeli) */}
        {cart.length > 0 && (
          <footer className="sticky bottom-0 z-30 bg-white border-t border-line px-4 pt-3 pb-[max(18px,calc(14px+env(safe-area-inset-bottom)))] shadow-[0_-6px_24px_rgba(0,0,0,0.06)] flex-shrink-0">
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] text-ink/60 uppercase font-bold tracking-wider">Total Pembayaran</span>
                <strong className="text-[18px] sm:text-[20px] font-black text-ink tabular-nums leading-tight">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </strong>
                <span className="text-[11px] text-ink/60">{totalItems} pcs barang</span>
              </div>

              {/* Tombol Hijau WhatsApp ala Web Pembeli MIG */}
              <button
                type="button"
                onClick={handleCheckoutWA}
                className="h-12 px-5 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all whitespace-nowrap flex-shrink-0"
              >
                <span>{WhatsAppIcon}</span>
                <span>Checkout via WhatsApp</span>
              </button>
            </div>
          </footer>
        )}

      </div>
    </div>
  );
}
