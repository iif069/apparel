'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { INITIAL_CATEGORIES } from '@/data/catalog';
import { CategoryId, CategoryData, CustomPhotoData, CustomCategoryData } from '@/types';
import { useSound } from '@/hooks/useSound';
import { Topbar } from '@/components/Topbar';
import { HangerRack } from '@/components/HangerRack';
import { DetailStage } from '@/components/DetailStage';
import { CustomCatalogModal } from '@/components/CustomCatalogModal';
import { getWhatsAppUrl } from '@/config/store';

export default function HomePage() {
  const [currentCategory, setCurrentCategory] = useState<CategoryId>('kaos');
  const [activeSlotIndex, setActiveSlotIndex] = useState(3); // Kaos Putih Netral (04 / 07)
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const { playSound } = useSound(soundEnabled);

  const [customPhotos, setCustomPhotos] = useState<Record<string, CustomPhotoData>>({});
  const [customCategories, setCustomCategories] = useState<Record<string, CustomCategoryData>>({});

  // Mode Rahasia Admin (disembunyikan secara default untuk pengunjung umum)
  const [isAdmin, setIsAdmin] = useState(false);
  const [toast, setToast] = useState<{ icon: 'unlock' | 'lock'; text: string } | null>(null);

  const showToast = (icon: 'unlock' | 'lock', text: string) => {
    setToast({ icon, text });
    setTimeout(() => setToast(null), 2500);
  };

  // 1. Muat data dari localStorage & cek URL secret admin saat mount
  useEffect(() => {
    try {
      const savedPhotos = localStorage.getItem('mig-apparel-custom-photos');
      if (savedPhotos) setCustomPhotos(JSON.parse(savedPhotos));

      const savedCats = localStorage.getItem('mig-apparel-custom-categories');
      if (savedCats) setCustomCategories(JSON.parse(savedCats));

      // Cek apakah ada parameter URL rahasia ?admin=1 atau ?admin=mig atau tersimpan sebelumnya
      const params = new URLSearchParams(window.location.search);
      const adminParam = params.get('admin');
      const savedAdmin = localStorage.getItem('mig-apparel-admin-mode') === 'true';

      if (adminParam === '1' || adminParam === 'mig' || adminParam === 'true' || savedAdmin) {
        setIsAdmin(true);
        localStorage.setItem('mig-apparel-admin-mode', 'true');
      }

      if (window.location.hash.includes('detail') || window.location.search.includes('detail')) {
        setIsDetailOpen(true);
      }
    } catch {
      // Abaikan jika localStorage tidak tersedia
    }
  }, []);

  const handleToggleAdmin = () => {
    setIsAdmin((prev) => {
      const next = !prev;
      if (next) {
        localStorage.setItem('mig-apparel-admin-mode', 'true');
        showToast('unlock', 'Mode Admin Aktif');
      } else {
        localStorage.removeItem('mig-apparel-admin-mode');
        showToast('lock', 'Mode Admin Dinonaktifkan');
      }
      return next;
    });
  };

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

  const handleOrderViaWhatsApp = (order: {
    item: CategoryData['rack'][0];
    categoryId: CategoryId;
    sizes: Record<string, number>;
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
    text += `*Total Harga:* Rp ${order.totalPrice.toLocaleString('id-ID')}\n\n`;
    text += `Mohon konfirmasi ketersediaan dan nomor rekening untuk transfer ya. Terima kasih!`;

    window.open(getWhatsAppUrl(text), '_blank');
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

  return (
    <main className="h-[100dvh] max-h-[100dvh] w-full bg-page flex flex-col relative overflow-hidden select-none md:select-auto">
      {/* 1. Bar Atas (Header Toko & Kategori) */}
      <Topbar
        currentCategory={currentCategory}
        categories={categoryTabList}
        onSelectCategory={handleSelectCategory}
        onOpenCustomModal={() => setIsCustomModalOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled((prev) => !prev)}
        isAdmin={isAdmin}
        onToggleAdmin={handleToggleAdmin}
      />

      {/* 2. Panggung Rak Gantungan 3D (Stage 1) */}
      <HangerRack
        categoryData={activeCategoryData}
        categories={categoryTabList}
        currentCategory={currentCategory}
        onSelectCategory={handleSelectCategory}
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
        onOrderViaWhatsApp={handleOrderViaWhatsApp}
        onPlaySound={playSound}
      />

      {/* 4. Modal Atur Katalog (Khusus Mode Admin) */}
      <CustomCatalogModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        categoryData={activeCategoryData}
        customPhotos={customPhotos}
        customCategories={customCategories}
        onSaveCustom={handleSaveCustom}
        onResetCustom={handleResetCustom}
      />

      {/* Toast Notifikasi Mode Rahasia */}
      {toast && (
        <div className="fixed top-18 md:top-6 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 rounded-2xl bg-ink/95 text-surface border border-line/20 shadow-float flex items-center gap-2 text-xs sm:text-[13px] font-semibold whitespace-nowrap backdrop-blur-md transition-all">
          {toast.icon === 'unlock' ? (
            <Unlock className="w-3.5 h-3.5 text-brand-soft shrink-0" />
          ) : (
            <Lock className="w-3.5 h-3.5 text-surface/60 shrink-0" />
          )}
          <span>{toast.text}</span>
        </div>
      )}
    </main>
  );
}
