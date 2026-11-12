'use client';

import React from 'react';
import { ArrowLeft, Trash2, ShoppingBag, Clock } from 'lucide-react';
import { CartItem } from '@/types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemoveItem: (cartId: string) => void;
  onUpdateQty?: (cartId: string, delta: number) => void;
  onClearCart: () => void;
  onOpenItemDetail?: (itemId: string) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  cart,
  onRemoveItem,
  onClearCart,
  onOpenItemDetail,
}: CartDrawerProps) {
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
    text += `Mohon konfirmasi pesanan dan nomor rekening ya. Terima kasih!`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/6281222400922?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-[#f8f7fb] flex justify-center">
      {/* Bingkai Shell Aplikasi Mobile-First (Persis sesuai referensi web pembeli MIG) */}
      <div className="w-full max-w-[480px] h-full bg-[#f8f7fb] flex flex-col relative overflow-hidden">
        
        {/* 1. HEADER KERANJANG (Tombol Back Panah Kiri + Judul "Keranjang") */}
        <header className="sticky top-0 z-40 bg-[#f8f7fb]/95 backdrop-blur-md px-4 py-3.5 flex items-center gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 -ml-1 rounded-full flex items-center justify-center hover:bg-slate-200/60 text-slate-900 transition-colors press-active"
            aria-label="Kembali ke katalog"
          >
            <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
          </button>
          <h1 className="text-[21px] font-bold text-slate-900 tracking-tight">Keranjang</h1>
        </header>

        {/* 2. SUBHEADER (Tombol Hapus Semua Merah di Kanan Atas) */}
        {cart.length > 0 && (
          <div className="flex justify-end px-5 pt-1 pb-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Hapus semua barang dari keranjang?')) {
                  onClearCart();
                }
              }}
              className="flex items-center gap-1.5 text-red-600 hover:text-red-700 text-[14px] font-semibold transition-colors press-active"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus semua</span>
            </button>
          </div>
        )}

        {/* 3. AREA KARTU PRODUK (Scrollable Area) */}
        <div className="flex-1 overflow-y-auto px-4 pb-28 space-y-4 no-scrollbar">
          {cart.length === 0 ? (
            /* Tampilan Keranjang Kosong */
            <div className="h-full flex flex-col items-center justify-center text-center py-20 px-6">
              <div className="w-20 h-20 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-400 mb-4 shadow-xs">
                <ShoppingBag className="w-9 h-9 stroke-[1.5]" />
              </div>
              <h3 className="text-[18px] font-bold text-slate-900">Keranjang masih kosong</h3>
              <p className="text-[13.5px] text-slate-500 mt-1 max-w-[260px] leading-relaxed">
                Pilih pakaian dari rak katalog dan tentukan ukuran yang ingin dipesan.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-6 px-7 py-3 rounded-full bg-[#7B29BA] hover:bg-[#6A21A3] text-white text-[14.5px] font-bold shadow-md press-active"
              >
                Mulai Belanja
              </button>
            </div>
          ) : (
            <>
              {/* Kartu per Item Keranjang (Rounded 28px Putih Bersih) */}
              {cart.map((item) => {
                const sizeSummary = Object.entries(item.sizes)
                  .map(([sz, qty]) => `${sz}: ${qty} pcs`)
                  .join(', ');
                const addonsList: string[] = [];
                if (item.addons.sablon) addonsList.push('Sablon Logo/Nama');
                if (item.addons.giftbox) addonsList.push('Kemasan Kado');
                const specText = addonsList.length > 0 
                  ? `${sizeSummary} · ${addonsList.join(' · ')}` 
                  : `${sizeSummary} · 100% Cotton Distro`;

                return (
                  <div
                    key={item.cartId}
                    className="bg-white rounded-[28px] border border-slate-100 shadow-sm p-5 flex flex-col gap-3.5 transition-all"
                  >
                    {/* Header Item: Foto Thumbnail + Nama + Badge + Tombol Trash */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3.5 min-w-0">
                        {/* Thumbnail Squircle */}
                        <div className="w-14 h-14 rounded-2xl bg-[#f5f4f8] border border-slate-200/70 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                          {item.frontPhoto ? (
                            <img
                              src={item.frontPhoto}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span
                              className="w-7 h-7 rounded-xl border-2 border-white shadow-xs"
                              style={{ backgroundColor: item.hex }}
                            />
                          )}
                        </div>

                        {/* Nama Produk & Badge */}
                        <div className="flex flex-col min-w-0">
                          <h4 className="text-[17px] font-bold text-slate-900 leading-snug truncate">
                            {item.name}
                          </h4>
                          <span className="text-[13.5px] text-slate-500 font-normal">
                            {item.totalQty} pcs ({item.colorName})
                          </span>

                          {/* Pill Badge Ungu */}
                          <div className="mt-1.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#7B29BA] text-[11.5px] font-semibold w-fit">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#7B29BA]" />
                            <span>Kualitas Sablon Distro & Jahitan Rapi</span>
                          </div>
                        </div>
                      </div>

                      {/* Tombol Hapus (Trash Icon Outline di Kanan Atas) */}
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.cartId)}
                        className="text-slate-400 hover:text-red-600 transition-colors p-1 -mr-1"
                        aria-label="Hapus produk ini"
                        title="Hapus produk ini"
                      >
                        <Trash2 className="w-5 h-5 stroke-[1.8]" />
                      </button>
                    </div>

                    {/* Kotak Varian & Rincian Ukuran (Latar Abu-abu Keunguan Halus #f5f4f8) */}
                    <div className="bg-[#f5f4f8] rounded-2xl p-4 flex flex-col gap-2">
                      <p className="text-[14px] font-bold text-slate-900 leading-snug">
                        {specText}
                      </p>
                      <div className="flex items-center justify-between text-[13.5px] pt-1">
                        <span className="text-slate-500">{item.totalQty} pcs</span>
                        <strong className="text-[15px] font-bold text-slate-900 tabular-nums">
                          Rp {item.totalPrice.toLocaleString('id-ID')}
                        </strong>
                      </div>
                    </div>

                    {/* Link + Tambah Ukuran Lain */}
                    <button
                      type="button"
                      onClick={() => {
                        if (onOpenItemDetail) {
                          onOpenItemDetail(item.itemId);
                        } else {
                          onClose();
                        }
                      }}
                      className="text-[#7B29BA] hover:text-[#6A21A3] font-bold text-[14px] flex items-center gap-1.5 w-fit active:scale-95 transition-all pt-0.5"
                    >
                      <span className="text-base leading-none">+</span>
                      <span>Tambah ukuran lain</span>
                    </button>

                    {/* Card Pemberitahuan Desain WhatsApp */}
                    <div className="bg-[#f5f4f8] rounded-2xl p-3.5 flex items-center gap-3 mt-1">
                      <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#25D366] shadow-xs flex-shrink-0">
                        {WhatsAppIcon}
                      </div>
                      <p className="text-[13px] text-slate-700 font-medium leading-snug">
                        Desain dikirim lewat WhatsApp setelah pesanan dibuat.
                      </p>
                    </div>
                  </div>
                );
              })}

              {/* Perkiraan Waktu Pengerjaan */}
              <div className="flex items-center gap-2 text-[13px] text-slate-500 font-normal px-2 pt-1 pb-4">
                <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>Perkiraan jadi 1-2 hari setelah desain disetujui</span>
              </div>
            </>
          )}
        </div>

        {/* 4. FLOATING CHECKOUT BAR (Pill Melayang Putih Sesuai Referensi Gambar) */}
        {cart.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-[max(18px,calc(14px+env(safe-area-inset-bottom)))] pointer-events-none flex justify-center">
            <div className="w-full max-w-[480px] bg-white rounded-full p-2.5 pl-6 pr-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.14)] border border-slate-100 flex items-center justify-between pointer-events-auto">
              <div className="flex flex-col min-w-0">
                <span className="text-[12px] text-slate-500 font-medium">
                  Total · {totalItems} pcs
                </span>
                <strong className="text-[20px] font-black text-slate-900 tracking-tight leading-none mt-0.5 tabular-nums">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </strong>
              </div>

              {/* Tombol Ungu Solid "Checkout" Sesuai Referensi */}
              <button
                type="button"
                onClick={handleCheckoutWA}
                className="bg-[#7B29BA] hover:bg-[#6A21A3] active:scale-95 text-white font-bold text-[15px] px-8 py-3.5 rounded-full shadow-sm hover:shadow-md transition-all whitespace-nowrap"
              >
                Checkout
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
