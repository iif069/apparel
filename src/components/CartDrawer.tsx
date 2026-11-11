'use client';

import React, { useState } from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { CartItem } from '@/types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemoveItem: (cartId: string) => void;
  onClearCart: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  cart,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [fulfillment, setFulfillment] = useState<'Ambil di toko' | 'Kirim via ekspedisi'>('Ambil di toko');
  const [customerNote, setCustomerNote] = useState('');

  if (!isOpen) return null;

  const totalAmount = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.totalQty, 0);

  const handleCheckoutWA = () => {
    if (cart.length === 0) return;

    let text = `Halo MIG Digital Printing, saya mau pesan apparel dari katalog:\n\n`;
    cart.forEach((item, idx) => {
      text += `*${idx + 1}. ${item.name}* (${item.colorName})\n`;
      const sizeBreakdown = Object.entries(item.sizes)
        .map(([sz, qty]) => `${sz}: ${qty} pcs`)
        .join(', ');
      text += `   - Ukuran: ${sizeBreakdown} (Total ${item.totalQty} pcs)\n`;
      if (item.addons.sablon) text += `   - Tambahan: Sablon nama/dada\n`;
      if (item.addons.giftbox) text += `   - Tambahan: Kotak kado\n`;
      text += `   - Subtotal: Rp ${item.totalPrice.toLocaleString('id-ID')}\n\n`;
    });

    text += `*Total Keseluruhan:* Rp ${totalAmount.toLocaleString('id-ID')} (${totalItems} pcs)\n`;
    text += `*Metode Pengambilan:* ${fulfillment}\n`;
    if (customerNote.trim()) {
      text += `*Catatan Tambahan:* ${customerNote.trim()}\n`;
    }
    text += `\nMohon informasi total dan instruksi pembayarannya ya. Terima kasih!`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/6281222400922?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-[420px] bg-surface flex flex-col shadow-float border-l border-line">
          {/* Header */}
          <div className="px-5 py-4 border-b border-line flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand" />
              <h2 className="text-base font-bold text-ink">Keranjang Belanja</h2>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-brand-soft text-brand">
                {totalItems} pcs
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-ink/70 hover:bg-page press-active"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Isi Keranjang */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3 no-scrollbar">
            {cart.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12 text-ink/50">
                <ShoppingBag className="w-12 h-12 stroke-1 text-ink/30 mb-3" />
                <p className="text-[14px] font-semibold text-ink">Keranjang Anda masih kosong</p>
                <p className="text-[12px] text-ink/50 mt-1 max-w-[220px]">
                  Pilih pakaian dari rak gantungan lalu klik Masukkan Keranjang.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartId}
                  className="flex items-start justify-between gap-3 p-3.5 bg-page rounded-2xl border border-line"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <span
                      className="w-4 h-4 rounded-full border border-line flex-shrink-0 mt-1"
                      style={{ backgroundColor: item.hex }}
                    />
                    <div className="flex flex-col min-w-0">
                      <strong className="text-[13.5px] font-bold text-ink truncate">{item.name}</strong>
                      <span className="text-[12px] text-ink/60">{item.colorName}</span>

                      {/* Ukuran */}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {Object.entries(item.sizes).map(([sz, qty]) => (
                          <span
                            key={sz}
                            className="px-2 py-0.5 rounded-full bg-surface text-ink text-[11px] font-semibold border border-line"
                          >
                            {sz}: {qty}
                          </span>
                        ))}
                      </div>

                      {/* Addons */}
                      {(item.addons.sablon || item.addons.giftbox) && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.addons.sablon && (
                            <span className="px-2 py-0.5 rounded-full bg-brand-soft text-brand text-[10.5px] font-medium">
                              + Sablon dada
                            </span>
                          )}
                          {item.addons.giftbox && (
                            <span className="px-2 py-0.5 rounded-full bg-brand-soft text-brand text-[10.5px] font-medium">
                              + Kotak kado
                            </span>
                          )}
                        </div>
                      )}

                      <span className="text-[13px] font-bold text-ink mt-1.5">
                        Rp {item.totalPrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onRemoveItem(item.cartId)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-ink/40 hover:text-red-600 hover:bg-surface press-active"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-line bg-surface flex flex-col gap-3.5">
              {/* Opsi Pengiriman */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[12px] font-bold text-ink">Metode Pengambilan</span>
                <div className="grid grid-cols-2 gap-2">
                  {(['Ambil di toko', 'Kirim via ekspedisi'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setFulfillment(method)}
                      className={`py-2 px-2.5 rounded-xl text-[12px] font-semibold border transition-all text-center ${
                        fulfillment === method
                          ? 'bg-brand text-surface border-brand shadow-sm'
                          : 'bg-page text-ink border-line hover:border-ink/30'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Catatan Tambahan */}
              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-bold text-ink">Catatan untuk Penjual (opsional)</span>
                <input
                  type="text"
                  placeholder="Contoh: Nama di dada kiri, nomor tim..."
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  className="w-full h-9 px-3 bg-page border border-line rounded-xl text-[12.5px] text-ink focus:outline-none focus:border-brand"
                />
              </div>

              {/* Total & Checkout */}
              <div className="flex items-center justify-between pt-2 border-t border-line">
                <span className="text-[13px] font-semibold text-ink/75">Total Belanja</span>
                <strong className="text-[18px] font-black text-ink">
                  Rp {totalAmount.toLocaleString('id-ID')}
                </strong>
              </div>

              <button
                type="button"
                onClick={handleCheckoutWA}
                className="w-full h-12 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-surface font-bold text-[14px] flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all press-active"
              >
                <span>Pesan lewat WhatsApp</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
