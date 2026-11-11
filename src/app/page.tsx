'use client';

import React, { useState, useEffect } from 'react';
import { INITIAL_CATEGORIES } from '@/data/catalog';
import { CategoryId, CategoryData, CartItem, CustomPhotoData, CustomCategoryData } from '@/types';
import { useSound } from '@/hooks/useSound';
import { Topbar } from '@/components/Topbar';
import { HangerRack } from '@/components/HangerRack';
import { DetailStage } from '@/components/DetailStage';
import { CartDrawer } from '@/components/CartDrawer';
import { CustomCatalogModal } from '@/components/CustomCatalogModal';

export default function HomePage() {
  const [currentCategory, setCurrentCategory] = useState<CategoryId>('kaos');
  const [activeSlotIndex, setActiveSlotIndex] = useState(3); // Kaos Putih Netral (04 / 07)
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const { playSound } = useSound(soundEnabled);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [customPhotos, setCustomPhotos] = useState<Record<string, CustomPhotoData>>({});
  const [customCategories, setCustomCategories] = useState<Record<string, CustomCategoryData>>({});

  // 1. Muat data dari localStorage saat mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('mig-apparel-cart');
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedPhotos = localStorage.getItem('mig-apparel-custom-photos');
      if (savedPhotos) setCustomPhotos(JSON.parse(savedPhotos));

      const savedCats = localStorage.getItem('mig-apparel-custom-categories');
      if (savedCats) setCustomCategories(JSON.parse(savedCats));

      if (window.location.hash.includes('detail') || window.location.search.includes('detail')) {
        setIsDetailOpen(true);
      }
    } catch {
      // Abaikan jika localStorage tidak tersedia
    }
  }, []);

  // 2. Simpan cart ke localStorage saat berubah
  useEffect(() => {
    try {
      localStorage.setItem('mig-apparel-cart', JSON.stringify(cart));
    } catch {
      // Abaikan
    }
  }, [cart]);

  // Siapkan data kategori aktif yang sudah digabung dengan kustomisasi
  const baseCategory = INITIAL_CATEGORIES[currentCategory] || INITIAL_CATEGORIES.kaos;
  const customCat = customCategories[currentCategory] || {};
  const activeCategoryData: CategoryData = {
    ...baseCategory,
    tabLabel: customCat.tabLabel || baseCategory.tabLabel,
    heroTitle: customCat.heroTitle || baseCategory.heroTitle,
    watermark: customCat.heroTitle || baseCategory.watermark,
  };

  const categoryTabList = (Object.keys(INITIAL_CATEGORIES) as CategoryId[]).map((catId) => {
    const base = INITIAL_CATEGORIES[catId];
    const c = customCategories[catId] || {};
    return {
      id: catId,
      tabLabel: c.tabLabel || base.tabLabel,
    };
  });

  const handleSelectCategory = (id: CategoryId) => {
    setCurrentCategory(id);
    setActiveSlotIndex(0);
    playSound('slide');
  };

  const handleAddToCart = (order: {
    item: CategoryData['rack'][0];
    categoryId: CategoryId;
    sizes: Record<string, number>;
    addons: { sablon: boolean; giftbox: boolean };
    totalPrice: number;
  }) => {
    const totalQty = Object.values(order.sizes).reduce((acc, q) => acc + q, 0);
    const cartId = `${order.item.id}-${Date.now()}`;
    const custom = customPhotos[order.item.id];

    const newItem: CartItem = {
      cartId,
      itemId: order.item.id,
      categoryId: order.categoryId,
      name: custom?.name || order.item.name,
      colorName: custom?.colorName || order.item.colorName,
      hex: order.item.hex,
      sizes: order.sizes,
      totalQty,
      basePrice: custom?.price || order.item.price,
      addons: order.addons,
      totalPrice: order.totalPrice,
      frontPhoto: custom?.frontDataUrl,
    };

    setCart((prev) => [newItem, ...prev]);
    setIsCartOpen(true);
  };

  const handleOrderViaWhatsApp = (order: {
    item: CategoryData['rack'][0];
    categoryId: CategoryId;
    sizes: Record<string, number>;
    addons: { sablon: boolean; giftbox: boolean };
    totalPrice: number;
  }) => {
    const custom = customPhotos[order.item.id];
    const name = custom?.name || order.item.name;
    const color = custom?.colorName || order.item.colorName;
    const totalQty = Object.values(order.sizes).reduce((acc, q) => acc + q, 0);

    let text = `Halo MIG Digital Printing, saya mau pesan langsung:\n\n`;
    text += `*Produk:* ${name} (${color})\n`;
    const sizeStr = Object.entries(order.sizes)
      .map(([sz, q]) => `${sz}: ${q} pcs`)
      .join(', ');
    text += `*Ukuran:* ${sizeStr} (Total ${totalQty} pcs)\n`;
    if (order.addons.sablon) text += `*Tambahan:* Cetak logo / nama dada (+15rb)\n`;
    if (order.addons.giftbox) text += `*Tambahan:* Kemasan kotak kado (+10rb)\n`;
    text += `*Total Harga:* Rp ${order.totalPrice.toLocaleString('id-ID')}\n\n`;
    text += `Mohon konfirmasi ketersediaan dan nomor rekening untuk transfer ya. Terima kasih!`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/6281222400922?text=${encoded}`, '_blank');
  };

  const handleSaveCustom = (
    itemId: string,
    data: CustomPhotoData,
    catData: CustomCategoryData
  ) => {
    const nextPhotos = { ...customPhotos, [itemId]: data };
    const nextCats = { ...customCategories, [currentCategory]: catData };

    setCustomPhotos(nextPhotos);
    setCustomCategories(nextCats);

    try {
      localStorage.setItem('mig-apparel-custom-photos', JSON.stringify(nextPhotos));
      localStorage.setItem('mig-apparel-custom-categories', JSON.stringify(nextCats));
    } catch {
      // Abaikan jika melebihi kuota
    }
  };

  const handleResetCustom = () => {
    setCustomPhotos({});
    setCustomCategories({});
    try {
      localStorage.removeItem('mig-apparel-custom-photos');
      localStorage.removeItem('mig-apparel-custom-categories');
    } catch {
      // Abaikan
    }
    setIsCustomModalOpen(false);
  };

  const cartTotalCount = cart.reduce((acc, it) => acc + it.totalQty, 0);

  return (
    <main className="min-h-screen bg-page flex flex-col relative overflow-x-hidden">
      {/* 1. Bar Atas (Header Toko & Kategori) */}
      <Topbar
        currentCategory={currentCategory}
        categories={categoryTabList}
        onSelectCategory={handleSelectCategory}
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
      />

      {/* 2. Panggung Rak Gantungan 3D (Stage 1) */}
      <HangerRack
        categoryData={activeCategoryData}
        activeIndex={activeSlotIndex}
        onSelectIndex={setActiveSlotIndex}
        onOpenDetail={(idx) => {
          setActiveSlotIndex(idx);
          setIsDetailOpen(true);
        }}
        customPhotos={customPhotos}
        onPlaySound={playSound}
      />

      {/* 3. Modal / Halaman Detail Produk (Stage 2) */}
      <DetailStage
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        categoryData={activeCategoryData}
        itemIndex={activeSlotIndex}
        onSelectIndex={setActiveSlotIndex}
        customPhotos={customPhotos}
        cartCount={cartTotalCount}
        onOpenCart={() => setIsCartOpen(true)}
        onAddToCart={handleAddToCart}
        onOrderViaWhatsApp={handleOrderViaWhatsApp}
        onPlaySound={playSound}
      />

      {/* 4. Panel Keranjang Belanja */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onRemoveItem={(id) => setCart((prev) => prev.filter((it) => it.cartId !== id))}
        onClearCart={() => setCart([])}
      />

      {/* 5. Modal Atur Katalog */}
      <CustomCatalogModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        categoryData={activeCategoryData}
        customPhotos={customPhotos}
        customCategories={customCategories}
        onSaveCustom={handleSaveCustom}
        onResetCustom={handleResetCustom}
      />
    </main>
  );
}
