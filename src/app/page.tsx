'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock } from 'lucide-react';
import { INITIAL_CATEGORIES } from '@/data/catalog';
import { CategoryId, CategoryData, CustomPhotoData, CustomCategoryData } from '@/types';
import { useSound } from '@/hooks/useSound';
import { Topbar } from '@/components/Topbar';
import { HangerRack } from '@/components/HangerRack';
import { DetailStage } from '@/components/DetailStage';
import { CustomCatalogModal } from '@/components/CustomCatalogModal';
import { CatalogPreloader } from '@/components/CatalogPreloader';
import { collectCatalogImageUrls, preloadAllCatalogImages } from '@/lib/preloadCatalog';
import { getWhatsAppUrl } from '@/config/store';

export default function HomePage() {
  const [currentCategory, setCurrentCategory] = useState<CategoryId>('kaos');
  const [displayedCategory, setDisplayedCategory] = useState<CategoryId>('kaos');
  const [transitionPhase, setTransitionPhase] = useState<'idle' | 'exiting' | 'entering'>('idle');
  const [transitionDirection, setTransitionDirection] = useState<'forward' | 'backward'>('forward');
  const [activeSlotIndex, setActiveSlotIndex] = useState(3); // Kaos Biru Muda (04 / 07)
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

  const [preloadProgress, setPreloadProgress] = useState({ loaded: 0, total: 0 });
  const [isCatalogReady, setIsCatalogReady] = useState(false);

  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const enterRafRef = useRef<number | null>(null);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isFlashActive, setIsFlashActive] = useState(false);
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

  // 2. Unduh dan decode seluruh gambar katalog sebelum masuk halaman utama
  useEffect(() => {
    let cancelled = false;
    const urls = collectCatalogImageUrls(INITIAL_CATEGORIES, 'kaos');
    setPreloadProgress({ loaded: 0, total: urls.length });

    preloadAllCatalogImages(urls, (loaded, total) => {
      if (!cancelled) {
        setPreloadProgress({ loaded, total });
      }
    }).then(() => {
      if (cancelled) return;
      requestAnimationFrame(() => {
        if (!cancelled) {
          setIsCatalogReady(true);
        }
      });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // Bersihkan timer transisi tab saat unmount
  useEffect(() => {
    return () => {
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
      if (enterRafRef.current) cancelAnimationFrame(enterRafRef.current);
    };
  }, []);

  // Sinkronkan tombol Back HP / browser dengan state modal detail
  useEffect(() => {
    const handlePopState = () => {
      const shouldOpen =
        window.location.hash.includes('detail') ||
        window.location.search.includes('detail') ||
        Boolean(window.history.state?.detail);
      setIsDetailOpen(shouldOpen);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleOpenDetail = (idx: number) => {
    setActiveSlotIndex(idx);
    setIsDetailOpen(true);
    try {
      if (window.location.hash !== '#detail') {
        window.history.pushState({ detail: true }, '', '#detail');
      }
    } catch {
      // Abaikan jika history API dibatasi
    }
  };

  const handleCloseDetail = () => {
    try {
      if (window.location.hash === '#detail' || window.history.state?.detail) {
        window.history.back();
        return;
      }
    } catch {
      // Abaikan jika history API dibatasi
    }
    setIsDetailOpen(false);
  };

  const handleToggleFlash = () => {
    playSound('click');
    setIsFlashActive((prev) => !prev);
  };

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

  // Siapkan data kategori yang sedang tampil (digabung dengan kustomisasi)
  const categoryIds = Object.keys(INITIAL_CATEGORIES) as CategoryId[];
  const baseCategory = INITIAL_CATEGORIES[displayedCategory] || INITIAL_CATEGORIES.kaos;
  const customCat = customCategories[displayedCategory] || {};
  const activeCategoryData: CategoryData = {
    ...baseCategory,
    tabLabel: customCat.tabLabel || baseCategory.tabLabel,
    heroTitle: customCat.heroTitle || baseCategory.heroTitle,
    watermark: customCat.heroTitle || baseCategory.watermark,
  };

  const categoryTabList = categoryIds.map((catId) => {
    const base = INITIAL_CATEGORIES[catId];
    const c = customCategories[catId] || {};
    return {
      id: catId,
      tabLabel: c.tabLabel || base.tabLabel,
    };
  });

  const handleSelectCategory = (id: CategoryId) => {
    if (id === currentCategory) return;

    const prevIdx = categoryIds.indexOf(currentCategory);
    const nextIdx = categoryIds.indexOf(id);
    const dir: 'forward' | 'backward' = nextIdx >= prevIdx ? 'forward' : 'backward';

    setCurrentCategory(id);
    playSound('slide');

    if (exitTimerRef.current) clearTimeout(exitTimerRef.current);
    if (enterRafRef.current) cancelAnimationFrame(enterRafRef.current);

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setDisplayedCategory(id);
      setActiveSlotIndex(0);
      setIsFlashActive(false);
      setTransitionPhase('idle');
      return;
    }

    setTransitionDirection(dir);
    setTransitionPhase('exiting');

    exitTimerRef.current = setTimeout(() => {
      setDisplayedCategory(id);
      setActiveSlotIndex(0);
      setIsFlashActive(false);
      setTransitionPhase('entering');

      enterRafRef.current = requestAnimationFrame(() => {
        enterRafRef.current = requestAnimationFrame(() => {
          setTransitionPhase('idle');
        });
      });
    }, 150);
  };

  const handleOrderViaWhatsApp = (order: {
    item: CategoryData['rack'][0];
    categoryId: CategoryId;
  }) => {
    const custom = customPhotos[order.item.id];
    const name = custom?.name || order.item.name;
    const color = custom?.colorName || order.item.colorName;
    const catLabel = activeCategoryData.tabLabel || order.categoryId;

    let text = `Halo MIG Digital Printing, saya mau order custom atau konsultasi desain:\n\n`;
    text += `*Kategori:* ${catLabel}\n`;
    text += `*Model Referensi:* ${name} (${color})\n\n`;
    text += `Boleh dibantu info detail dan konsultasi desainnya? Terima kasih!`;

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
    <>
      <CatalogPreloader
        loaded={preloadProgress.loaded}
        total={preloadProgress.total}
        isReady={isCatalogReady}
      />

      <main
        aria-hidden={!isCatalogReady}
        className="min-h-[100dvh] w-full bg-page flex flex-col relative overflow-x-hidden select-none md:select-auto"
      >
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
          transitionPhase={transitionPhase}
          transitionDirection={transitionDirection}
          activeIndex={activeSlotIndex}
          onSelectIndex={setActiveSlotIndex}
          onOpenDetail={handleOpenDetail}
          customPhotos={customPhotos}
          isFlashActive={isFlashActive}
          onToggleFlash={handleToggleFlash}
          onPlaySound={playSound}
        />

        {/* 3. Modal / Halaman Detail Produk (Stage 2) */}
        <DetailStage
          isOpen={isDetailOpen}
          onClose={handleCloseDetail}
          categoryData={activeCategoryData}
          itemIndex={activeSlotIndex}
          onSelectIndex={setActiveSlotIndex}
          customPhotos={customPhotos}
          isFlashActive={isFlashActive}
          onToggleFlash={handleToggleFlash}
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
    </>
  );
}
