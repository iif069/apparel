/**
 * ============================================================================
 * MIG DIGITAL PRINTING — INTERACTIVE 3D HANGER APPAREL STORE
 * Disesuaikan penuh mengikuti mockup PDF "MIG Apparel — Atur Produk (Mockup)"
 * dengan tetap mempertahankan:
 * - Teks besar "APPAREL" di belakang baju + bayangan "APPAREL" di lantai bawahnya
 * - Callout kiri "Tampil MENAWAN" dan kanan "Langsung PILIH UKURAN"
 * ============================================================================
 */

const STORE_CONFIG = {
  name: 'MIG Digital Printing',
  location: 'Rajadesa, Ciamis',
  whatsappNumber: '6289510405562',
  whatsappDisplay: '0895 1040 5562',
};

const CONTENT = {
  garmentSizes: ['S', 'M', 'L', 'XL', 'XXL'],
  categories: {
    kaos: {
      id: 'kaos',
      tabLabel: 'Kaos sablon',
      heroTitle: 'APPAREL',
      kicker: 'Knitto Cotton Combed 24s & 30s',
      watermark: 'Apparel',
      subtitle: 'Kaos sablon custom DTF & Plastisol standar MIG Digital Printing.',
      material: '100% Cotton Combed 24s & 30s Knitto Textiles',
      weight: 'Sablon DTF tajam · Bisa satuan & lusinan',
      description:
        'Kaos sablon custom produksi MIG Digital Printing menggunakan warna resmi katalog Knitto Textiles (Hitam Reaktif, Biru Dongker Navy, Mineral Green, Putih Netral, Benhur Spesial, Burgundy, hingga Royal Purple).',
      rack: [
        { id: 'kaos-hitam', name: 'Kaos Hitam Reaktif', colorName: 'Hitam', hex: '#1c1b1a', highlight: '#3c3c3c', shadow: '#111111', accent: '#ffffff', price: 65000, side: null, front: null, back: null },
        { id: 'kaos-dongker', name: 'Kaos Biru Dongker', colorName: 'Biru Dongker', hex: '#1F2734', highlight: '#354257', shadow: '#10151d', accent: '#ffffff', price: 65000, side: null, front: null, back: null },
        { id: 'kaos-mineral', name: 'Kaos Mineral Green', colorName: 'Mineral Green', hex: '#5B7069', highlight: '#768f87', shadow: '#3b4a45', accent: '#ffffff', price: 65000, side: null, front: null, back: null },
        { id: 'kaos-putih', name: 'Kaos Putih Netral', colorName: 'Putih', hex: '#f8f7f3', highlight: '#ffffff', shadow: '#cac6bc', accent: '#7b29ba', price: 60000, side: null, front: null, back: null },
        { id: 'kaos-benhur', name: 'Kaos Benhur Spesial', colorName: 'Benhur Spesial', hex: '#203B72', highlight: '#35589e', shadow: '#122244', accent: '#ffffff', price: 65000, side: null, front: null, back: null },
        { id: 'kaos-burgundy', name: 'Kaos Burgundy', colorName: 'Burgundy', hex: '#602332', highlight: '#823548', shadow: '#3b121c', accent: '#ffffff', price: 65000, side: null, front: null, back: null },
        { id: 'kaos-purple', name: 'Kaos Royal Purple', colorName: 'Royal Purple', hex: '#573A69', highlight: '#75518c', shadow: '#362242', accent: '#ffffff', price: 65000, side: null, front: null, back: null },
      ],
    },
    jersey: {
      id: 'jersey',
      tabLabel: 'Jersey printing',
      heroTitle: 'APPAREL',
      kicker: 'Jersey Full Printing Sublimasi',
      watermark: 'Apparel',
      subtitle: 'Jersey printing custom futsal, bola, voli & esport standar MIG Digital Printing.',
      material: 'Dryfit Milano & Brazil UV Protection',
      weight: 'Sublimasi Epson Original · Gratis nama & nomor',
      description:
        'Jersey full printing sublimasi dengan bahan Dryfit Milano dan Brazil berpori lembut yang adem serta cepat menyerap keringat. Warna cetak tajam menyatu dengan serat kain, bebas pasang logo tim, sponsor, nama, dan nomor punggung.',
      rack: [
        { id: 'jersey-black', name: 'Jersey Hitam Gold', colorName: 'Hitam gold', hex: '#1c1b1a', highlight: '#3b3b42', shadow: '#101012', accent: '#e5b842', price: 115000, side: null, front: null, back: null },
        { id: 'jersey-blue', name: 'Jersey Biru Elektrik', colorName: 'Biru elektrik', hex: '#183f8c', highlight: '#2859b8', shadow: '#0d2452', accent: '#28a9c4', price: 115000, side: null, front: null, back: null },
        { id: 'jersey-red', name: 'Jersey Merah Garuda', colorName: 'Merah garuda', hex: '#a51c24', highlight: '#c72c37', shadow: '#610e14', accent: '#ffffff', price: 115000, side: null, front: null, back: null },
        { id: 'jersey-white', name: 'Jersey Putih Klasik', colorName: 'Putih klasik', hex: '#efedf2', highlight: '#ffffff', shadow: '#c9c5bc', accent: '#7b29ba', price: 110000, side: null, front: null, back: null },
        { id: 'jersey-teal', name: 'Jersey Hijau Tosca', colorName: 'Hijau tosca', hex: '#167559', highlight: '#258f87', shadow: '#0b3d39', accent: '#dff266', price: 115000, side: null, front: null, back: null },
        { id: 'jersey-maroon', name: 'Jersey Marun Pro', colorName: 'Marun pro', hex: '#6e1923', highlight: '#822c3e', shadow: '#360d16', accent: '#f3c677', price: 115000, side: null, front: null, back: null },
        { id: 'jersey-purple', name: 'Jersey Ungu MIG', colorName: 'Ungu MIG', hex: '#761eb8', highlight: '#7b38ab', shadow: '#34114d', accent: '#ffffff', price: 115000, side: null, front: null, back: null },
      ],
    },
    puffer: {
      id: 'puffer',
      tabLabel: 'Kemeja',
      heroTitle: 'APPAREL',
      kicker: 'Koleksi kemeja kerja & kasual',
      watermark: 'Apparel',
      subtitle: 'Kemeja PDH, korsa, drill & kasual standar MIG Digital Printing.',
      material: 'American Drill & Japan Drill Premium',
      weight: 'Bordir komputer presisi · Jahitan rapi ganda',
      description:
        'Kemeja custom untuk seragam kerja, komunitas, instansi, maupun kasual. Menggunakan bahan drill berkualitas yang adem, kuat, dan tidak mudah kusut, dilengkapi bordir komputer detail dan rapi.',
      rack: [
        { id: 'kemeja-hitam', name: 'Kemeja Hitam Elegan', colorName: 'Hitam elegan', hex: '#202022', highlight: '#3a3a3e', shadow: '#101012', accent: '#ffffff', price: 95000, side: null, front: null, back: null },
        { id: 'kemeja-navy', name: 'Kemeja Biru Dongker', colorName: 'Biru dongker', hex: '#1c283c', highlight: '#2e3e5c', shadow: '#101724', accent: '#ffffff', price: 95000, side: null, front: null, back: null },
        { id: 'kemeja-army', name: 'Kemeja Hijau Army', colorName: 'Hijau army', hex: '#444c3c', highlight: '#5c6652', shadow: '#2d3328', accent: '#ffffff', price: 95000, side: null, front: null, back: null },
        { id: 'kemeja-putih', name: 'Kemeja Putih Formal', colorName: 'Putih formal', hex: '#f6f5f1', highlight: '#ffffff', shadow: '#cac6bc', accent: '#7b29ba', price: 90000, side: null, front: null, back: null },
        { id: 'kemeja-khaki', name: 'Kemeja Krem Khaki', colorName: 'Krem khaki', hex: '#b39d7b', highlight: '#cbba9c', shadow: '#877254', accent: '#ffffff', price: 95000, side: null, front: null, back: null },
        { id: 'kemeja-marun', name: 'Kemeja Merah Marun', colorName: 'Merah marun', hex: '#5c1b26', highlight: '#7d2a38', shadow: '#380d14', accent: '#ffffff', price: 95000, side: null, front: null, back: null },
        { id: 'kemeja-abu', name: 'Kemeja Abu Semen', colorName: 'Abu semen', hex: '#6f7478', highlight: '#8d9296', shadow: '#4d5154', accent: '#ffffff', price: 95000, side: null, front: null, back: null },
      ],
    },
  },
};

const ADDON_PRICES = {
  sablon: { label: 'Cetak logo / nama dada', price: 15000 },
  giftbox: { label: 'Kemasan kotak kado', price: 15000 },
};

const state = {
  category: 'kaos',
  activeIndex: 3, // Kaos Putih Netral (04 / 07)
  viewMode: 'rack', // 'rack' | 'detail'
  detailAngle: 'front', // 'side-left' | 'front' | 'back'
  detailSpinDeg: 0,
  sizeQtys: { M: 1 }, // Multi-ukuran + kuantitas sesuai mockup PDF
  colorPickerOpen: false,
  addons: { sablon: false, giftbox: false },
  fulfillmentMethod: 'Ambil di toko',
  soundEnabled: true,
  cart: [],
  customPhotos: {},
  customCategories: {},
  lastTurnedAt: 0,
};

let hangerPhysics = [];
let rafId = null;
let lastFrameTime = 0;

const prefersReducedMotion = () =>
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function isTouchOrMobileViewport() {
  if (window.innerWidth <= 900) return true;
  if (window.matchMedia && !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    return true;
  }
  return false;
}

// ============================================================================
// FORMATTER & EFEK SUARA GANTUNGAN
// ============================================================================
function formatRupiah(num) {
  return 'Rp ' + Math.round(num).toLocaleString('id-ID');
}

function formatShortTag(num) {
  return `Rp ${Math.round(num / 1000)}rb`;
}

function parseRupiahInput(str) {
  const digits = String(str || '').replace(/[^\d]/g, '');
  return digits ? Number(digits) : 0;
}

let audioCtx = null;
function playHangerSound(type = 'slide') {
  if (!state.soundEnabled) return;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    if (type === 'slide') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(890, now + 0.06);
      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.075);
    } else if (type === 'open') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.12);
      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.13);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    }
  } catch {
    // Abaikan jika diblokir browser
  }
}

// ============================================================================
// GENERATOR VISUAL BAJU & HANGER (SESUAI MOCKUP PDF)
// - Hanger kawat minimalis bersih
// - Tag harga kapsul ungu lembut ("Rp 115.000") di sisi kanan hanger yang aktif
// - Tampak samping berupa kapsul vertikal berujung membulat bersih
// - Tampak depan berupa siluet bersih sesuai kategori (Kaos / Jersey / Jaket)
// ============================================================================
function renderHangerHookSVG(priceText, showPriceTag = true) {
  return `
    <div class="hanger-top-assembly">
      <svg class="hanger-hook-svg" viewBox="0 0 120 62" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M58 19 C52 19, 50 9, 56 5 C62 1, 69 6, 66 14 C64 19, 60 22, 60 31"
              stroke="#1c1b1a" stroke-width="3.2" stroke-linecap="round" fill="none"/>
        <path d="M24 52 C37 35, 51 30, 60 30 C69 30, 83 35, 96 52"
              stroke="#1c1b1a" stroke-width="7.5" stroke-linecap="round" fill="none"/>
      </svg>
      ${
        showPriceTag
          ? `<div class="hanger-tag-string-group">
               <div class="hanger-tag-string"></div>
               <span class="hanger-price-tag tabular-nums">${priceText}</span>
             </div>`
          : ''
      }
    </div>
  `;
}

function renderGarmentSVG(item, categoryId, viewAngle = 'front', extraClass = 'garment-main-svg') {
  const custom = state.customPhotos[item.id];
  if (custom) {
    if (viewAngle.startsWith('side') && custom.sideDataUrl) {
      return `<img class="garment-main-img" src="${custom.sideDataUrl}" alt="${item.name} tampak samping" />`;
    }
    if (viewAngle === 'front' && custom.frontDataUrl) {
      return `<img class="garment-main-img" src="${custom.frontDataUrl}" alt="${item.name} tampak depan" />`;
    }
    if (viewAngle === 'back' && (custom.backDataUrl || custom.frontDataUrl)) {
      return `<img class="garment-main-img" src="${custom.backDataUrl || custom.frontDataUrl}" alt="${item.name} tampak belakang" />`;
    }
  }

  if (viewAngle.startsWith('side') && item.side) {
    return `<img class="garment-main-img" src="${item.side}" alt="${item.name} tampak samping" />`;
  }
  if (viewAngle === 'front' && item.front) {
    return `<img class="garment-main-img" src="${item.front}" alt="${item.name} tampak depan" />`;
  }
  if (viewAngle === 'back' && (item.back || item.front)) {
    return `<img class="garment-main-img" src="${item.back || item.front}" alt="${item.name} tampak belakang" />`;
  }

  const hex = item.hex || '#f8f7f3';
  const isLight = ['#ebe7df', '#f1efe9', '#ece7dd', '#f2f0eb', '#f8f7f3', '#efedf2', '#ffffff'].includes(
    hex.toLowerCase()
  );
  const strokeColor = isLight ? '#d5d2de' : 'rgba(28, 27, 26, 0.14)';

  // -------------------------------------------------------------------------
  // 1. TAMPAK SAMPING — Kapsul vertikal bersih seperti pada Mockup PDF
  // -------------------------------------------------------------------------
  if (viewAngle.startsWith('side')) {
    return `
      <svg class="${extraClass}" viewBox="0 0 300 350" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="101" y="6" width="98" height="314" rx="22"
              fill="${hex}" stroke="${strokeColor}" stroke-width="2"/>
      </svg>`;
  }

  // -------------------------------------------------------------------------
  // 2. TAMPAK DEPAN (0°) & BELAKANG (180°) — Siluet bersih sesuai Mockup PDF
  // -------------------------------------------------------------------------
  const isBack = viewAngle === 'back';

  if (categoryId === 'jersey') {
    const leftSleeve = '#7b29ba';
    const rightSleeve = '#27a4bf';
    const sashColor = '#7b29ba';
    const bodyFill = '#ffffff';
    const bodyStroke = '#d3d0dc';
    const textFill = '#1c1b1a';

    return `
      <svg class="${extraClass}" viewBox="0 0 300 350" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Lengan Kiri & Kanan -->
        <path d="M95 36 L34 80 L61 130 L95 108 Z"
              fill="${leftSleeve}" stroke="${bodyStroke}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M205 36 L266 80 L239 130 L205 108 Z"
              fill="${rightSleeve}" stroke="${bodyStroke}" stroke-width="2" stroke-linejoin="round"/>

        <!-- Badan Jersey -->
        <path d="M95 36 Q150 66 205 36 L205 322 Q150 338 95 322 Z"
              fill="${bodyFill}" stroke="${bodyStroke}" stroke-width="2.2" stroke-linejoin="round"/>

        <!-- Selempang Diagonal Ungu -->
        <path d="M96 175 L204 140 L204 185 L96 220 Z" fill="${sashColor}"/>

        <!-- Kerah V-Neck -->
        <path d="M124 38 L150 68 L176 38 Z" fill="${sashColor}"/>

        ${
          isBack
            ? `<text x="150" y="114" text-anchor="middle" fill="${textFill}" font-family="Inter, sans-serif" font-size="11" font-weight="800" letter-spacing="2">MIG APPAREL</text>
               <text x="150" y="268" text-anchor="middle" fill="${sashColor}" font-family="Anton, sans-serif" font-size="56" opacity="0.85">10</text>`
            : ''
        }
      </svg>`;
  }

  if (categoryId === 'puffer') {
    const bodyStroke = isLight ? '#d3d0dc' : 'rgba(255,255,255,0.2)';
    const placketColor = isLight ? '#e5e2ee' : 'rgba(0,0,0,0.18)';
    const buttonFill = isLight ? '#7b29ba' : '#ffffff';
    const detailColor = isLight ? '#1c1b1a' : '#ffffff';

    return `
      <svg class="${extraClass}" viewBox="0 0 300 350" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- Lengan Pendek Kemeja -->
        <path d="M95 38 L28 88 L60 142 L95 116 Z"
              fill="${hex}" stroke="${bodyStroke}" stroke-width="2.2" stroke-linejoin="round"/>
        <path d="M205 38 L272 88 L240 142 L205 116 Z"
              fill="${hex}" stroke="${bodyStroke}" stroke-width="2.2" stroke-linejoin="round"/>

        <!-- Badan Utama Kemeja -->
        <path d="M95 36 Q150 56 205 36 L205 322 Q150 336 95 322 Z"
              fill="${hex}" stroke="${bodyStroke}" stroke-width="2.2" stroke-linejoin="round"/>

        ${
          !isBack
            ? `<!-- Plakat Kancing Tengah -->
               <rect x="141" y="44" width="18" height="280" fill="${placketColor}" stroke="${bodyStroke}" stroke-width="1.2"/>
               <!-- Kancing-kancing -->
               <circle cx="150" cy="80" r="3.2" fill="${buttonFill}"/>
               <circle cx="150" cy="125" r="3.2" fill="${buttonFill}"/>
               <circle cx="150" cy="170" r="3.2" fill="${buttonFill}"/>
               <circle cx="150" cy="215" r="3.2" fill="${buttonFill}"/>
               <circle cx="150" cy="260" r="3.2" fill="${buttonFill}"/>
               <circle cx="150" cy="305" r="3.2" fill="${buttonFill}"/>

               <!-- Saku Dada Kiri -->
               <path d="M168 118 H198 V152 L183 162 L168 152 Z"
                     fill="${hex}" stroke="${bodyStroke}" stroke-width="1.8"/>

               <!-- Kerah Kemeja (Collar) Berdiri/Lipat Rapih -->
               <path d="M124 38 L148 68 L114 74 L100 44 Z"
                     fill="${hex}" stroke="${bodyStroke}" stroke-width="2" stroke-linejoin="round"/>
               <path d="M176 38 L152 68 L186 74 L200 44 Z"
                     fill="${hex}" stroke="${bodyStroke}" stroke-width="2" stroke-linejoin="round"/>`
            : `<!-- Jahitan Punggung (Yoke) Belakang -->
               <path d="M95 90 Q150 98 205 90" stroke="${bodyStroke}" stroke-width="2" fill="none"/>
               <text x="150" y="68" text-anchor="middle" fill="${detailColor}" font-family="Inter, sans-serif" font-size="10" font-weight="700" letter-spacing="1.8" opacity="0.75">MIG WORKWEAR</text>`
        }
      </svg>`;
  }

  // Kaos Sablon — Sama persis dengan Mockup PDF Halaman Detail ("Kaos Putih Netral")
  const teeStroke = isLight ? '#d3d0dc' : 'rgba(255,255,255,0.18)';
  const labelColor = isLight ? '#1c1b1a' : '#ffffff';

  return `
    <svg class="${extraClass}" viewBox="0 0 300 350" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Garis Kerah Belakang -->
      <path d="M122 39 Q150 61 178 39"
            stroke="${teeStroke}" stroke-width="2.2" stroke-linecap="round" fill="none"/>

      <!-- Siluet Kaos Utuh (Lengan + Badan Menyatu seperti Mockup PDF) -->
      <path d="M95 36 Q150 66 205 36 L266 80 L238 128 L205 106 L205 322 Q150 338 95 322 L95 106 L62 128 L34 80 Z"
            fill="${hex}" stroke="${teeStroke}" stroke-width="2.4" stroke-linejoin="round"/>

      ${
        !isBack
          ? `<text x="150" y="142" text-anchor="middle" fill="${labelColor}" font-family="Inter, sans-serif" font-size="11.5" font-weight="800" letter-spacing="2.2">MIG APPAREL</text>`
          : `<text x="150" y="122" text-anchor="middle" fill="${labelColor}" font-family="Inter, sans-serif" font-size="10.5" font-weight="700" letter-spacing="2" opacity="0.65">MIG DIGITAL PRINTING</text>`
      }
    </svg>`;
}

// ============================================================================
// DATA HELPER & SINKRONISASI KATEGORI
// ============================================================================
function getCurrentCategoryData(catId = state.category) {
  const base = CONTENT.categories[catId] || CONTENT.categories.kaos;
  const customCat = state.customCategories[base.id] || {};
  const heroTitle = customCat.heroTitle || base.heroTitle;
  return {
    ...base,
    tabLabel: customCat.tabLabel || base.tabLabel,
    heroTitle,
    watermark: customCat.heroTitle || base.watermark,
    kicker: customCat.kicker || base.kicker,
    subtitle: customCat.subtitle || base.subtitle,
    material: customCat.material || base.material,
    weight: customCat.weight || base.weight,
    description: customCat.description || base.description,
  };
}

function getMergedRackItem(rawItem) {
  const custom = state.customPhotos[rawItem.id];
  const mergedName = custom?.name || rawItem.name;
  let mergedColorName = custom?.colorName || rawItem.colorName;
  if (!custom?.colorName && custom?.name && custom.name !== rawItem.name) {
    mergedColorName = custom.name.replace(/^(Kaos|Jersey|Jaket|Kemeja)\s+/i, '').trim() || custom.name;
  }
  return {
    ...rawItem,
    name: mergedName,
    colorName: mergedColorName,
    price: custom?.price || rawItem.price,
  };
}

function itemHasOwnHanger(rawItem) {
  const custom = state.customPhotos[rawItem.id];
  if (!custom) return false;
  const hasPhoto = Boolean(custom.frontDataUrl || custom.sideDataUrl || custom.backDataUrl);
  if (!hasPhoto) return false;
  return custom.ownHanger !== false;
}

function syncCategoryChipLabels() {
  Object.keys(CONTENT.categories).forEach((catId) => {
    const catData = getCurrentCategoryData(catId);
    document.querySelectorAll(`.mig-chip[data-category="${catId}"]`).forEach((btn) => {
      btn.textContent = catData.tabLabel;
    });
  });
}

function getActiveItem() {
  const cat = getCurrentCategoryData();
  const rawItem = cat.rack[state.activeIndex] || cat.rack[0];
  return getMergedRackItem(rawItem);
}

// ============================================================================
// MESIN FISIKA REAL-TIME
// ============================================================================
function startPhysicsLoop() {
  if (rafId !== null) return;
  lastFrameTime = performance.now();
  rafId = requestAnimationFrame(stepPhysics);
}

function stepPhysics(now) {
  let dt = (now - lastFrameTime) / 1000;
  lastFrameTime = now;
  if (dt <= 0) dt = 0.016;
  if (dt > 0.1) dt = 0.1;

  const reduced = prefersReducedMotion();
  let stillMoving = false;

  const isMobile = window.innerWidth <= 768;
  const sideWidth = isMobile ? 84 : 104;
  const frontWidth = isMobile ? 210 : 236;

  for (let i = 0; i < hangerPhysics.length; i++) {
    const p = hangerPhysics[i];

    // --- A. DROP-IN ENTRANCE ---
    if (!p.landed) {
      if (reduced) {
        p.dropProgress = 1;
        p.landed = true;
      } else if (now >= p.dropStartTime) {
        stillMoving = true;
        p.dropProgress += dt / 0.65;
        if (p.dropProgress >= 1) {
          p.dropProgress = 1;
          p.landed = true;
          const dir = i % 2 === 0 ? 1 : -1;
          p.v += dir * (14 + (i % 3) * 3);
        }
      } else {
        stillMoving = true;
      }
    }

    let dropY = 0;
    let dropOpacity = 1;
    if (!p.landed) {
      const t = Math.max(0, Math.min(1, p.dropProgress));
      dropOpacity = Math.min(1, t * 2.2);
      const c1 = 1.70158;
      const c3 = c1 + 1;
      const easeOutBack = 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
      dropY = -140 * (1 - easeOutBack);
    }

    // --- B. DAMPED PENDULUM SWING ---
    if (reduced) {
      p.a = 0;
      p.v = 0;
      p.tagAngle = 0;
    } else if (p.landed) {
      let rem = dt;
      while (rem > 0) {
        const h = Math.min(0.016, rem);
        p.v += (-30 * p.a - 2.6 * p.v) * h;
        p.a += p.v * h;
        if (Math.abs(p.a) > 10) {
          p.a = Math.sign(p.a) * 10;
          p.v = -p.v * 0.3;
        }
        rem -= h;
      }

      p.tagAngle += (p.a - p.tagAngle) * (1 - Math.exp(-7 * dt));

      if (Math.abs(p.a) > 0.02 || Math.abs(p.v) > 0.05 || Math.abs(p.a - p.tagAngle) > 0.02) {
        stillMoving = true;
      } else {
        p.a = 0;
        p.v = 0;
        p.tagAngle = 0;
      }
    }

    // --- C. HOVER / TAP TURN (Side -> Front) ---
    const kTarget = i === state.activeIndex ? 1 : 0;
    if (reduced) {
      p.k = kTarget;
    } else {
      const diffK = kTarget - p.k;
      if (Math.abs(diffK) > 0.002) {
        p.k += diffK * (1 - Math.exp(-dt / 0.2));
        stillMoving = true;
      } else {
        p.k = kTarget;
      }
    }

    const k = p.k;
    const e = k * k * (3 - 2 * k);

    const currentWidth = sideWidth + (frontWidth - sideWidth) * e;
    const sideGap = (isMobile ? 6 : 10) * e;
    p.slotEl.style.width = `${currentWidth.toFixed(1)}px`;
    p.slotEl.style.marginLeft = `${sideGap.toFixed(1)}px`;
    p.slotEl.style.marginRight = `${sideGap.toFixed(1)}px`;
    p.slotEl.style.zIndex = e > 0.5 ? '20' : String(10 - Math.abs(i - state.activeIndex));

    p.pivotEl.style.opacity = dropOpacity.toFixed(3);
    p.pivotEl.style.transform = `translate3d(0, ${dropY.toFixed(1)}px, 0) rotateZ(${p.a.toFixed(2)}deg)`;

    if (p.tagGroupEl) {
      const trailDiff = (p.a - p.tagAngle) * 1.25;
      p.tagGroupEl.style.transform = `rotateZ(${trailDiff.toFixed(2)}deg)`;
    }

    const dirSign = i > state.activeIndex ? -1 : 1;
    if (e < 0.5) {
      const firstHalf = e / 0.5;
      const sideRotY = -88 * firstHalf * dirSign;
      p.sideLayerEl.style.opacity = '1';
      p.sideLayerEl.style.transform = `rotateY(${sideRotY.toFixed(1)}deg)`;
      p.frontLayerEl.style.opacity = '0';
      p.frontLayerEl.style.transform = `rotateY(${(-12 * dirSign).toFixed(1)}deg) scale(1)`;
    } else {
      const secondHalf = (e - 0.5) / 0.5;
      const frontScale = 0.96 + 0.04 * secondHalf;
      const frontRotY = -12 * (1 - secondHalf) * dirSign;
      p.sideLayerEl.style.opacity = '0';
      p.frontLayerEl.style.opacity = secondHalf.toFixed(3);
      p.frontLayerEl.style.transform = `rotateY(${frontRotY.toFixed(1)}deg) scale(${frontScale.toFixed(3)})`;
    }
  }

  if (stillMoving) {
    rafId = requestAnimationFrame(stepPhysics);
  } else {
    rafId = null;
  }
}

function knockNeighbours(index) {
  if (prefersReducedMotion()) return;
  if (hangerPhysics[index]) {
    hangerPhysics[index].v += (Math.random() > 0.5 ? 1 : -1) * 8;
  }
  if (hangerPhysics[index - 1]) hangerPhysics[index - 1].v += 22;
  if (hangerPhysics[index + 1]) hangerPhysics[index + 1].v -= 22;
  if (hangerPhysics[index - 2]) hangerPhysics[index - 2].v += 8;
  if (hangerPhysics[index + 2]) hangerPhysics[index + 2].v -= 8;
  startPhysicsLoop();
}

// ============================================================================
// RENDER RAK GANTUNGAN UTAMA
// ============================================================================
function renderRackStage(withDropEntrance = false) {
  syncCategoryChipLabels();
  const cat = getCurrentCategoryData();

  document.getElementById('hero-kicker').textContent = cat.kicker;
  document.getElementById('hero-giant-title').textContent = cat.heroTitle;
  document.getElementById('floor-shadow-title').textContent = cat.heroTitle;

  const rackList = document.getElementById('hanger-rack-list');
  rackList.innerHTML = '';
  hangerPhysics = [];

  const now = performance.now();

  cat.rack.forEach((rawItem, idx) => {
    const item = getMergedRackItem(rawItem);
    const hasOwnHanger = itemHasOwnHanger(rawItem);

    const slot = document.createElement('div');
    slot.className = `hanger-slot ${idx === state.activeIndex ? 'is-active' : ''}`;
    slot.setAttribute('role', 'listitem');
    slot.setAttribute('tabindex', '0');
    slot.setAttribute('aria-label', `${item.name}, ${formatRupiah(item.price)}`);
    slot.dataset.index = idx;

    const sideSvg = renderGarmentSVG(item, cat.id, 'side-left');
    const frontSvg = renderGarmentSVG(item, cat.id, 'front');

    slot.innerHTML = `
      <div class="hanger-pivot ${hasOwnHanger ? 'has-own-hanger' : ''}">
        ${renderHangerHookSVG(formatShortTag(item.price), true)}
        <div class="garment-3d-body">
          <div class="garment-layer-side">${sideSvg}</div>
          <div class="garment-layer-front">${frontSvg}</div>
        </div>
      </div>
    `;

    // Hover hanya untuk desktop dengan mouse
    slot.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse' && !isTouchOrMobileViewport()) {
        if (state.activeIndex !== idx) {
          setActiveHanger(idx, true);
        }
      }
    });

    // Klik / Ketuk: putar ke depan dulu jika masih samping; buka detail jika sudah depan
    slot.addEventListener('click', (e) => {
      e.stopPropagation();
      if (state.activeIndex !== idx) {
        setActiveHanger(idx, true);
        if (window.innerWidth <= 768) {
          setTimeout(() => {
            slot.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
          }, 80);
        }
        return;
      }

      if (performance.now() - state.lastTurnedAt < 280) {
        return;
      }

      openDetailViewWithFlight(idx);
    });

    slot.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (state.activeIndex !== idx) {
          setActiveHanger(idx, true);
        } else {
          openDetailViewWithFlight(idx);
        }
      }
    });

    rackList.appendChild(slot);

    hangerPhysics.push({
      slotEl: slot,
      pivotEl: slot.querySelector('.hanger-pivot'),
      tagGroupEl: slot.querySelector('.hanger-tag-string-group'),
      sideLayerEl: slot.querySelector('.garment-layer-side'),
      frontLayerEl: slot.querySelector('.garment-layer-front'),
      a: 0,
      v: 0,
      tagAngle: 0,
      k: idx === state.activeIndex ? 1 : 0,
      landed: !withDropEntrance,
      dropStartTime: now + idx * 65,
      dropProgress: withDropEntrance ? 0 : 1,
    });
  });

  updateFloatingRackPill();
  populateCustomModalSelect();
  startPhysicsLoop();

  if (window.innerWidth <= 768) {
    setTimeout(() => {
      const activeSlot = rackList.children[state.activeIndex];
      if (activeSlot) {
        activeSlot.scrollIntoView({ behavior: 'instant', inline: 'center', block: 'nearest' });
      }
    }, 30);
  }
}

function setActiveHanger(index, withSound = false) {
  state.activeIndex = index;
  state.lastTurnedAt = performance.now();
  if (withSound) playHangerSound('slide');

  document.querySelectorAll('.hanger-slot').forEach((slot, idx) => {
    slot.classList.toggle('is-active', idx === index);
  });

  knockNeighbours(index);
  updateFloatingRackPill();
}

function updateFloatingRackPill() {
  const item = getActiveItem();
  const dot = document.getElementById('pill-color-dot');
  const nameEl = document.getElementById('pill-name');
  const priceEl = document.getElementById('pill-price');

  if (dot) dot.style.backgroundColor = item.hex;
  if (nameEl) nameEl.textContent = item.name;
  if (priceEl) priceEl.textContent = `Mulai dari ${formatRupiah(item.price)}`;
}

// ============================================================================
// HALAMAN DETAIL PRODUK (SESUAI MOCKUP PDF HALAMAN 5, 6, 7)
// ============================================================================
function openDetailViewWithFlight(index = state.activeIndex) {
  state.activeIndex = index;
  state.viewMode = 'detail';
  state.detailAngle = 'front';
  state.detailSpinDeg = 0;
  state.colorPickerOpen = false;
  if (Object.keys(state.sizeQtys).length === 0) {
    state.sizeQtys = { M: 1 };
  }
  playHangerSound('open');

  const slots = document.querySelectorAll('.hanger-slot');
  const sourceSlot = slots[index];
  const detailStage = document.getElementById('detail-stage');
  const scrollArea = detailStage.querySelector('.detail-scroll-area');
  const detailHeader = document.getElementById('detail-fixed-header');

  renderDetailStage();
  detailStage.classList.remove('is-hidden');
  if (scrollArea) scrollArea.scrollTop = 0;
  if (detailHeader) detailHeader.classList.remove('is-scrolled');

  if (!sourceSlot || prefersReducedMotion() || !Element.prototype.animate) {
    return;
  }

  const srcRect = sourceSlot.getBoundingClientRect();
  const targetStage = document.getElementById('detail-garment-stage');
  const dstRect = targetStage.getBoundingClientRect();

  sourceSlot.classList.add('is-hidden-on-rack');
  targetStage.style.visibility = 'hidden';

  const cat = getCurrentCategoryData();
  const item = getActiveItem();
  const flyer = document.createElement('div');
  flyer.className = 'arc-flight-clone';
  flyer.style.width = `${dstRect.width}px`;
  flyer.style.height = `${dstRect.height}px`;
  flyer.style.left = `${dstRect.left}px`;
  flyer.style.top = `${dstRect.top}px`;
  flyer.innerHTML = renderGarmentSVG(item, cat.id, 'front');
  document.getElementById('flying-item-layer').appendChild(flyer);

  const dx = srcRect.left + srcRect.width / 2 - (dstRect.left + dstRect.width / 2);
  const dy = srcRect.top + srcRect.height / 2 - (dstRect.top + dstRect.height / 2);
  const startScale = Math.max(0.45, srcRect.height / dstRect.height);

  const anim = flyer.animate(
    [
      {
        transform: `translate(${dx}px, ${dy}px) scale(${startScale}) rotateY(-45deg) rotateZ(0deg)`,
      },
      {
        transform: `translate(${dx * 0.42}px, ${dy * 0.42 - 48}px) scale(${Math.min(1.04, startScale + 0.35)}) rotateY(-12deg) rotateZ(2deg)`,
        offset: 0.55,
      },
      {
        transform: 'translate(0px, 0px) scale(1) rotateY(0deg) rotateZ(0deg)',
      },
    ],
    {
      duration: 560,
      easing: 'cubic-bezier(0.2, 0.8, 0.25, 1)',
      fill: 'forwards',
    }
  );

  anim.onfinish = () => {
    flyer.remove();
    targetStage.style.visibility = 'visible';
  };
}

function closeDetailView() {
  if (state.viewMode !== 'detail') return;
  state.viewMode = 'rack';
  playHangerSound('slide');

  const detailStage = document.getElementById('detail-stage');
  const slots = document.querySelectorAll('.hanger-slot');
  const targetSlot = slots[state.activeIndex];
  const centerStage = document.getElementById('detail-garment-stage');

  if (!targetSlot || !centerStage || prefersReducedMotion() || !Element.prototype.animate) {
    detailStage.classList.add('is-hidden');
    document.querySelectorAll('.hanger-slot').forEach((s) => s.classList.remove('is-hidden-on-rack'));
    return;
  }

  const srcRect = centerStage.getBoundingClientRect();
  const dstRect = targetSlot.getBoundingClientRect();

  const cat = getCurrentCategoryData();
  const item = getActiveItem();
  const flyer = document.createElement('div');
  flyer.className = 'arc-flight-clone';
  flyer.style.width = `${srcRect.width}px`;
  flyer.style.height = `${srcRect.height}px`;
  flyer.style.left = `${srcRect.left}px`;
  flyer.style.top = `${srcRect.top}px`;
  flyer.innerHTML = renderGarmentSVG(item, cat.id, 'front');
  document.getElementById('flying-item-layer').appendChild(flyer);

  detailStage.classList.add('is-hidden');

  const dx = dstRect.left + dstRect.width / 2 - (srcRect.left + srcRect.width / 2);
  const dy = dstRect.top + dstRect.height / 2 - (srcRect.top + srcRect.height / 2);
  const endScale = Math.max(0.5, dstRect.height / srcRect.height);

  const anim = flyer.animate(
    [
      { transform: 'translate(0px, 0px) scale(1) rotateZ(0deg)' },
      { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 40}px) scale(${(1 + endScale) / 2}) rotateZ(-2deg)`, offset: 0.5 },
      { transform: `translate(${dx}px, ${dy}px) scale(${endScale}) rotateZ(0deg)` },
    ],
    {
      duration: 480,
      easing: 'ease-in-out',
      fill: 'forwards',
    }
  );

  anim.onfinish = () => {
    flyer.remove();
    document.querySelectorAll('.hanger-slot').forEach((s) => s.classList.remove('is-hidden-on-rack'));
    if (hangerPhysics[state.activeIndex]) {
      hangerPhysics[state.activeIndex].v += 18;
      knockNeighbours(state.activeIndex);
    }
    targetSlot.focus();
  };
}

function getCalculatedUnitPrice() {
  const item = getActiveItem();
  let total = item.price;
  if (state.addons.sablon) total += ADDON_PRICES.sablon.price;
  if (state.addons.giftbox) total += ADDON_PRICES.giftbox.price;
  return total;
}

function getTotalSelectedQty() {
  const sum = Object.values(state.sizeQtys).reduce((acc, q) => acc + (Number(q) || 0), 0);
  return Math.max(1, sum);
}

function syncOrderTotalDisplay() {
  const unitPrice = getCalculatedUnitPrice();
  const totalQty = getTotalSelectedQty();
  const totalPrice = unitPrice * totalQty;

  const detailPriceEl = document.getElementById('detail-price');
  const totalLabelEl = document.getElementById('order-total-label');
  const totalPriceEl = document.getElementById('order-total-price');

  if (detailPriceEl) detailPriceEl.textContent = formatRupiah(unitPrice);
  if (totalLabelEl) totalLabelEl.textContent = `Total · ${totalQty} pcs`;
  if (totalPriceEl) totalPriceEl.textContent = formatRupiah(totalPrice);
}

function renderSizeRows() {
  const container = document.getElementById('detail-size-rows');
  if (!container) return;
  container.innerHTML = '';

  const entries = Object.entries(state.sizeQtys).filter(([, qty]) => qty > 0);
  if (entries.length === 0) {
    state.sizeQtys = { M: 1 };
  }

  Object.entries(state.sizeQtys).forEach(([size, qty]) => {
    if (!qty || qty <= 0) return;
    const row = document.createElement('div');
    row.className = 'size-qty-row';
    row.innerHTML = `
      <span class="size-qty-label">Ukuran ${size}</span>
      <div class="size-qty-stepper">
        <button type="button" class="size-step-btn press" data-action="dec" aria-label="Kurangi ukuran ${size}">−</button>
        <span class="size-step-val tabular-nums">${qty}</span>
        <button type="button" class="size-step-btn press" data-action="inc" aria-label="Tambah ukuran ${size}">+</button>
      </div>
    `;
    row.querySelector('[data-action="dec"]').addEventListener('click', () => {
      const activeSizes = Object.keys(state.sizeQtys).filter((k) => state.sizeQtys[k] > 0);
      if (state.sizeQtys[size] > 1) {
        state.sizeQtys[size] -= 1;
      } else if (activeSizes.length > 1) {
        delete state.sizeQtys[size];
      } else {
        state.sizeQtys[size] = 1;
      }
      renderSizeRows();
      syncOrderTotalDisplay();
    });
    row.querySelector('[data-action="inc"]').addEventListener('click', () => {
      state.sizeQtys[size] = (state.sizeQtys[size] || 0) + 1;
      renderSizeRows();
      syncOrderTotalDisplay();
    });
    container.appendChild(row);
  });
}

function renderDetailStage() {
  const cat = getCurrentCategoryData();
  const item = getActiveItem();
  const hasOwnHanger = itemHasOwnHanger(item);

  document.getElementById('detail-counter-badge').textContent = `0${state.activeIndex + 1} / 0${cat.rack.length}`;
  const headerTitle = document.getElementById('detail-header-title');
  if (headerTitle) headerTitle.textContent = item.name;

  document.getElementById('detail-title').textContent = item.name;
  document.getElementById('detail-subtitle').textContent = cat.subtitle;
  document.getElementById('spec-material').textContent = cat.material;
  document.getElementById('spec-weight').textContent = cat.weight;
  document.getElementById('detail-description').textContent = cat.description;

  const colorDot = document.getElementById('detail-color-dot');
  if (colorDot) colorDot.style.backgroundColor = item.hex;
  document.getElementById('detail-color-name').textContent = item.colorName;

  const detailStageEl = document.getElementById('detail-garment-stage');
  if (detailStageEl) {
    detailStageEl.classList.toggle('has-own-hanger', hasOwnHanger);
  }

  // Di halaman detail hanger menampilkan kait, tali & tag harga persis seperti di rak utama
  document.getElementById('detail-hanger-hook').innerHTML = renderHangerHookSVG(formatShortTag(item.price), true);
  renderDetail3DCardFaces();
  renderSizeRows();
  syncOrderTotalDisplay();

  const swatchesWrap = document.getElementById('detail-color-swatches');
  swatchesWrap.innerHTML = '';
  swatchesWrap.classList.toggle('is-hidden', !state.colorPickerOpen);
  const colorChangeBtn = document.getElementById('color-change-btn');
  if (colorChangeBtn) {
    colorChangeBtn.setAttribute('aria-expanded', String(state.colorPickerOpen));
    colorChangeBtn.textContent = state.colorPickerOpen ? 'Tutup' : 'Ganti';
  }

  cat.rack.forEach((rawColorItem, idx) => {
    const colorItem = getMergedRackItem(rawColorItem);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `mig-color-chip press ${idx === state.activeIndex ? 'active' : ''}`;
    btn.innerHTML = `
      <span class="color-dot-22" style="background-color: ${colorItem.hex}"></span>
      <span>${colorItem.colorName}</span>
    `;
    btn.addEventListener('click', () => {
      state.activeIndex = idx;
      state.colorPickerOpen = false;
      playHangerSound('slide');
      renderDetailStage();
      updateFloatingRackPill();
      document.querySelectorAll('.hanger-slot').forEach((slot, sIdx) => {
        slot.classList.toggle('is-active', sIdx === idx);
      });
    });
    swatchesWrap.appendChild(btn);
  });
}

function renderDetail3DCardFaces() {
  const cat = getCurrentCategoryData();
  const item = getActiveItem();
  const rotator = document.getElementById('detail-garment-rotator');

  if (state.detailAngle === 'side-left') {
    rotator.innerHTML = `
      <div class="detail-face detail-face-front">
        ${renderGarmentSVG(item, cat.id, 'side-left')}
      </div>
      <div class="detail-face detail-face-back">
        ${renderGarmentSVG(item, cat.id, 'back')}
      </div>
    `;
    state.detailSpinDeg = 0;
  } else {
    rotator.innerHTML = `
      <div class="detail-face detail-face-front">
        ${renderGarmentSVG(item, cat.id, 'front')}
      </div>
      <div class="detail-face detail-face-back">
        ${renderGarmentSVG(item, cat.id, 'back')}
      </div>
    `;
    state.detailSpinDeg = state.detailAngle === 'back' ? 180 : 0;
  }

  applyDetailSpinTransform();
}

function applyDetailSpinTransform() {
  const rotator = document.getElementById('detail-garment-rotator');
  if (!rotator) return;

  rotator.style.transform = `rotateY(${state.detailSpinDeg}deg)`;

  document.querySelectorAll('.angle-tab').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.angle === state.detailAngle);
  });
}

// ============================================================================
// KERANJANG BELANJA & WHATSAPP CHECKOUT
// ============================================================================
function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem('mig-apparel-cart');
    if (saved) state.cart = JSON.parse(saved);
    const savedCustom = localStorage.getItem('mig-apparel-custom-photos');
    if (savedCustom) state.customPhotos = JSON.parse(savedCustom);
    const savedCats = localStorage.getItem('mig-apparel-custom-categories');
    if (savedCats) state.customCategories = JSON.parse(savedCats);
  } catch {
    state.cart = [];
  }
  updateCartUI();
}

function saveCartToStorage() {
  try {
    localStorage.setItem('mig-apparel-cart', JSON.stringify(state.cart));
  } catch {
    // Abaikan jika penyimpanan penuh
  }
}

function triggerFlyToCartAnimation(sourceEl) {
  const cartBtn =
    state.viewMode === 'detail'
      ? document.getElementById('detail-cart-open-btn') || document.getElementById('cart-open-btn')
      : document.getElementById('cart-open-btn');
  const layer = document.getElementById('flying-item-layer');
  if (!cartBtn || !layer || prefersReducedMotion()) return;

  const cartRect = cartBtn.getBoundingClientRect();
  const srcRect = sourceEl
    ? sourceEl.getBoundingClientRect()
    : { left: window.innerWidth / 2, top: window.innerHeight / 2 };

  const startX = Math.max(cartRect.left - 120, Math.min(srcRect.left, cartRect.left - 80));
  const startY = cartRect.top + 110;

  const clone = document.createElement('div');
  clone.className = 'flying-garment-clone';
  clone.style.left = `${startX}px`;
  clone.style.top = `${startY}px`;

  const cat = getCurrentCategoryData();
  const item = getActiveItem();
  clone.innerHTML = renderGarmentSVG(item, cat.id, 'front');
  layer.appendChild(clone);

  requestAnimationFrame(() => {
    const dx = cartRect.left + cartRect.width / 2 - startX - 34;
    const dy = cartRect.top + cartRect.height / 2 - startY - 34;
    clone.style.transform = `translate(${dx}px, ${dy}px) scale(0.25)`;
    clone.style.opacity = '0.2';
  });

  setTimeout(() => {
    clone.remove();
    cartBtn.classList.remove('animate-bump');
    void cartBtn.offsetWidth;
    cartBtn.classList.add('animate-bump');
  }, 600);
}

function addCurrentItemToCart(openDrawerAfter = false) {
  const cat = getCurrentCategoryData();
  const item = getActiveItem();
  const unitPrice = getCalculatedUnitPrice();

  const addonLabels = [];
  if (state.addons.sablon) addonLabels.push(ADDON_PRICES.sablon.label);
  if (state.addons.giftbox) addonLabels.push(ADDON_PRICES.giftbox.label);

  const sizeEntries = Object.entries(state.sizeQtys).filter(([, q]) => q > 0);
  if (sizeEntries.length === 0) {
    sizeEntries.push(['M', 1]);
  }

  sizeEntries.forEach(([size, qty]) => {
    const key = `${item.id}__${size}__${addonLabels.join('+')}`;
    const existing = state.cart.find((c) => c.key === key);

    if (existing) {
      existing.qty += qty;
    } else {
      state.cart.push({
        key,
        itemId: item.id,
        categoryId: cat.id,
        name: item.name,
        colorName: item.colorName,
        hex: item.hex,
        highlight: item.highlight,
        shadow: item.shadow,
        accent: item.accent,
        size,
        addons: addonLabels,
        unitPrice,
        qty,
      });
    }
  });

  saveCartToStorage();
  updateCartUI();

  const centerStage = document.getElementById('detail-garment-stage');
  triggerFlyToCartAnimation(centerStage);
  showToast('Dimasukkan ke keranjang');

  if (openDrawerAfter) openCartDrawer();
}

function updateCartQty(key, delta) {
  const idx = state.cart.findIndex((c) => c.key === key);
  if (idx === -1) return;
  state.cart[idx].qty += delta;
  if (state.cart[idx].qty <= 0) {
    state.cart.splice(idx, 1);
    showToast('Dihapus dari keranjang');
  }
  saveCartToStorage();
  updateCartUI();
}

function updateCartUI() {
  const totalQty = state.cart.reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = state.cart.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);

  const badgeMain = document.getElementById('cart-count-badge');
  const badgeDetail = document.getElementById('detail-cart-count-badge');
  if (badgeMain) badgeMain.textContent = totalQty;
  if (badgeDetail) badgeDetail.textContent = totalQty;

  document.getElementById('cart-drawer-sub').textContent =
    totalQty > 0 ? `${totalQty} potong pakaian dipilih` : 'Belum ada barang dipilih';
  document.getElementById('cart-total-price').textContent = formatRupiah(totalPrice);

  const container = document.getElementById('cart-items-container');
  container.innerHTML = '';

  if (state.cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-state">
        Belum ada pakaian di keranjang. Pilih baju dari gantungan untuk mulai memesan.
      </div>
    `;
    return;
  }

  state.cart.forEach((entry) => {
    const row = document.createElement('div');
    row.className = 'mig-list-pill';
    const addonText = entry.addons.length > 0 ? ` · ${entry.addons.join(', ')}` : '';

    row.innerHTML = `
      <div class="list-pill-left">
        <div class="list-pill-thumb">
          ${renderGarmentSVG(entry, entry.categoryId || 'kaos', 'front')}
        </div>
        <div class="list-pill-text">
          <span class="list-pill-title">${entry.name}</span>
          <span class="list-pill-summary">Ukuran ${entry.size}${addonText}</span>
        </div>
      </div>
      <div class="list-pill-right">
        <span class="list-pill-price tabular-nums">${formatRupiah(entry.unitPrice * entry.qty)}</span>
        <div class="qty-stepper">
          <button type="button" class="qty-btn press" data-action="dec" aria-label="Kurangi jumlah">−</button>
          <span class="qty-val tabular-nums">${entry.qty}</span>
          <button type="button" class="qty-btn press" data-action="inc" aria-label="Tambah jumlah">+</button>
        </div>
      </div>
    `;

    row.querySelector('[data-action="dec"]').addEventListener('click', () => updateCartQty(entry.key, -1));
    row.querySelector('[data-action="inc"]').addEventListener('click', () => updateCartQty(entry.key, 1));
    container.appendChild(row);
  });
}

function openCartDrawer() {
  document.getElementById('cart-backdrop').classList.remove('is-hidden');
  document.getElementById('cart-drawer').classList.remove('is-hidden');
}

function closeCartDrawer() {
  document.getElementById('cart-backdrop').classList.add('is-hidden');
  document.getElementById('cart-drawer').classList.add('is-hidden');
}

function sendOrderToWhatsApp() {
  if (state.cart.length === 0) {
    showToast('Pilih minimal 1 pakaian terlebih dahulu');
    return;
  }

  const nameInput = document.getElementById('buyer-name');
  const nameError = document.getElementById('buyer-name-error');
  const buyerName = nameInput.value.trim();

  if (!buyerName) {
    nameError.classList.remove('is-hidden');
    nameInput.focus();
    return;
  }
  nameError.classList.add('is-hidden');

  const buyerPhone = document.getElementById('buyer-phone').value.trim() || '-';
  const buyerAddress = document.getElementById('buyer-address').value.trim() || '-';
  const buyerNote = document.getElementById('buyer-note').value.trim() || '-';
  const totalPrice = state.cart.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);

  const lines = [
    `Halo *${STORE_CONFIG.name}*, saya ingin memesan pakaian dari Katalog MIG Apparel:`,
    '',
    '*Rincian pesanan:*',
    ...state.cart.map((item, idx) => {
      const addonInfo = item.addons.length ? ` (${item.addons.join(', ')})` : '';
      return `${idx + 1}. *${item.name}* — Ukuran ${item.size}${addonInfo} × ${item.qty} pcs = *${formatRupiah(item.unitPrice * item.qty)}*`;
    }),
    '',
    `*Total pesanan: ${formatRupiah(totalPrice)}*`,
    '',
    '*Data pemesan:*',
    `• Nama: ${buyerName}`,
    `• No. HP: ${buyerPhone}`,
    `• Pengambilan: ${state.fulfillmentMethod}`,
    `• Alamat/Patokan: ${buyerAddress}`,
    `• Catatan: ${buyerNote}`,
  ];

  const waUrl = `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
}

// ============================================================================
// MODAL PENGATURAN KATALOG (SESUAI MOCKUP PDF HALAMAN 1 & 2)
// ============================================================================
function populateCustomModalSelect() {
  const select = document.getElementById('custom-product-select');
  if (!select) return;
  const cat = getCurrentCategoryData();
  const selectLabel = document.getElementById('custom-product-select-label');
  if (selectLabel) {
    selectLabel.textContent = `Gantungan di kategori ${cat.tabLabel}`;
  }

  select.innerHTML = '';

  cat.rack.forEach((rawItem, idx) => {
    const merged = getMergedRackItem(rawItem);
    const opt = document.createElement('option');
    opt.value = rawItem.id;
    opt.textContent = `${idx + 1} · ${merged.name}`;
    if (idx === state.activeIndex) opt.selected = true;
    select.appendChild(opt);
  });

  syncCustomModalInputs();
  syncCustomCategoryInputs();
}

function updatePhotoSlotUI(prefix, degreeText, hasPhoto) {
  const statusEl = document.getElementById(`custom-${prefix}-status`);
  if (statusEl) {
    statusEl.textContent = `${degreeText} · ${hasPhoto ? 'Foto dipilih' : 'Belum ada foto'}`;
  }
}

function syncCustomModalInputs() {
  const select = document.getElementById('custom-product-select');
  if (!select) return;
  const cat = getCurrentCategoryData();
  const idx = Math.max(0, cat.rack.findIndex((i) => i.id === select.value));
  const found = cat.rack[idx] || cat.rack[0];
  const merged = getMergedRackItem(found);
  const custom = state.customPhotos[found.id];

  const dotEl = document.getElementById('custom-product-dot');
  if (dotEl) dotEl.style.backgroundColor = found.hex;

  const nameInput = document.getElementById('custom-name-input');
  const variantInput = document.getElementById('custom-variant-input');
  const priceInput = document.getElementById('custom-price-input');
  const hangerCheck = document.getElementById('custom-own-hanger-check');
  const hangerHint = document.getElementById('custom-own-hanger-hint');

  if (nameInput) nameInput.value = merged.name;
  if (variantInput) {
    variantInput.value = merged.colorName;
    variantInput.dataset.manualEdit = custom?.colorName ? 'true' : 'false';
  }
  if (priceInput) priceInput.value = formatRupiah(merged.price);
  if (hangerCheck) {
    hangerCheck.checked = custom?.ownHanger !== false;
  }
  if (hangerHint) {
    hangerHint.textContent = `Hanger gantungan ke-${idx + 1} disembunyikan`;
  }

  updatePhotoSlotUI('front', '0°', Boolean(custom?.frontDataUrl));
  updatePhotoSlotUI('back', '180°', Boolean(custom?.backDataUrl));
  updatePhotoSlotUI('side', '90°', Boolean(custom?.sideDataUrl));
}

function syncCustomCategoryInputs() {
  const cat = getCurrentCategoryData();
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  };
  setVal('custom-cat-tab-input', cat.tabLabel);
  setVal('custom-cat-hero-input', cat.heroTitle);
  setVal('custom-cat-kicker-input', cat.kicker);
  setVal('custom-cat-subtitle-input', cat.subtitle);
  setVal('custom-cat-material-input', cat.material);
  setVal('custom-cat-weight-input', cat.weight);
  setVal('custom-cat-desc-input', cat.description);
}

function switchCustomModalTab(tabName = 'product') {
  const prodBtn = document.getElementById('modal-tab-product-btn');
  const catBtn = document.getElementById('modal-tab-category-btn');
  const prodPanel = document.getElementById('modal-panel-product');
  const catPanel = document.getElementById('modal-panel-category');

  if (prodBtn) prodBtn.classList.toggle('active', tabName === 'product');
  if (catBtn) catBtn.classList.toggle('active', tabName === 'category');
  if (prodPanel) prodPanel.classList.toggle('is-hidden', tabName !== 'product');
  if (catPanel) catPanel.classList.toggle('is-hidden', tabName !== 'category');
}

function readAndResizeImageFile(file, maxHeight = 760) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => resolve(reader.result);
      img.onload = () => {
        const scale = Math.min(1, maxHeight / img.height);
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/png'));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function autoGenerateSideProfileFromFront(frontDataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onerror = () => resolve(frontDataUrl);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      const targetW = Math.round(img.width * 0.34);
      const dstX = Math.round((img.width - targetW) / 2);
      const srcX = Math.round(img.width * 0.24);
      const srcW = Math.round(img.width * 0.52);

      ctx.save();
      ctx.beginPath();
      ctx.ellipse(
        img.width / 2,
        img.height * 0.52,
        targetW * 0.52,
        img.height * 0.48,
        0,
        0,
        Math.PI * 2
      );
      ctx.clip();
      ctx.drawImage(img, srcX, 0, srcW, img.height, dstX, 0, targetW, img.height);
      ctx.restore();

      resolve(canvas.toDataURL('image/png'));
    };
    img.src = frontDataUrl;
  });
}

let toastTimer = null;
function showToast(message) {
  const toast = document.getElementById('toast-notification');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.remove('is-hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.add('is-hidden');
  }, 3000);
}

// ============================================================================
// INISIALISASI EVENT LISTENERS
// ============================================================================
function initEvents() {
  // Klik Logo MIG Apparel: selalu kembali ke menu utama (Rak Gantungan)
  document.getElementById('brand-home-btn').addEventListener('click', () => {
    closeCartDrawer();
    document.getElementById('size-modal-backdrop').classList.add('is-hidden');
    document.getElementById('custom-modal-backdrop').classList.add('is-hidden');
    if (state.viewMode !== 'rack') {
      closeDetailView();
    } else {
      setActiveHanger(3, true);
    }
  });

  // Chip Kategori (Sinkron antara Desktop & Mobile Bar)
  document.querySelectorAll('.mig-chip[data-category]').forEach((chip) => {
    chip.addEventListener('click', () => {
      const targetCat = chip.dataset.category;
      document.querySelectorAll('.mig-chip[data-category]').forEach((c) => {
        c.classList.toggle('active', c.dataset.category === targetCat);
      });
      state.category = targetCat;
      state.activeIndex = targetCat === 'jersey' ? 1 : 3;
      playHangerSound('slide');
      if (state.viewMode === 'detail') {
        closeDetailView();
      }
      renderRackStage(false);
      knockNeighbours(state.activeIndex);
    });
  });

  // Tombol Suara & Menu Lainnya (HP)
  const soundBtn = document.getElementById('sound-toggle-btn');
  const menuSoundLabel = document.getElementById('menu-sound-label');
  const toggleSound = () => {
    state.soundEnabled = !state.soundEnabled;
    if (soundBtn) soundBtn.setAttribute('aria-pressed', String(state.soundEnabled));
    if (menuSoundLabel) {
      menuSoundLabel.textContent = `Suara gantungan: ${state.soundEnabled ? 'aktif' : 'mati'}`;
    }
    showToast(state.soundEnabled ? 'Suara gantungan aktif' : 'Suara gantungan dimatikan');
  };
  if (soundBtn) soundBtn.addEventListener('click', toggleSound);

  const moreMenuBtn = document.getElementById('more-menu-btn');
  const moreMenu = document.getElementById('more-menu');
  if (moreMenuBtn && moreMenu) {
    moreMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = moreMenu.classList.contains('is-hidden');
      moreMenu.classList.toggle('is-hidden', !willOpen);
      moreMenuBtn.setAttribute('aria-expanded', String(willOpen));
    });
    document.addEventListener('click', () => {
      moreMenu.classList.add('is-hidden');
      moreMenuBtn.setAttribute('aria-expanded', 'false');
    });
  }

  const openCustomModal = (tab = 'product') => {
    populateCustomModalSelect();
    switchCustomModalTab(tab);
    document.getElementById('custom-modal-backdrop').classList.remove('is-hidden');
  };

  document.getElementById('upload-custom-btn').addEventListener('click', () => openCustomModal('product'));
  const menuCustomBtn = document.getElementById('menu-custom-btn');
  if (menuCustomBtn) menuCustomBtn.addEventListener('click', () => openCustomModal('product'));
  const menuSoundBtn = document.getElementById('menu-sound-btn');
  if (menuSoundBtn) menuSoundBtn.addEventListener('click', toggleSound);

  document.getElementById('pill-inspect-btn').addEventListener('click', () => {
    openDetailViewWithFlight(state.activeIndex);
  });

  document.getElementById('quick-buy-callout').addEventListener('click', () => {
    openDetailViewWithFlight(state.activeIndex);
  });

  // Scroll Breeze di Rak
  let lastWheelAt = 0;
  window.addEventListener(
    'wheel',
    (e) => {
      if (state.viewMode !== 'rack' || prefersReducedMotion()) return;
      const now = performance.now();
      if (now - lastWheelAt < 90) return;
      lastWheelAt = now;
      const speed = Math.max(-10, Math.min(10, e.deltaY * 0.16));
      hangerPhysics.forEach((p, idx) => {
        p.v += speed * Math.sin(idx * 2.1 + 1);
      });
      startPhysicsLoop();
    },
    { passive: true }
  );

  // Header Detail di HP: Saat di-scroll ke bawah, tampilkan nama produk di tengah header (sesuai Mockup Hal. 7)
  const detailScrollArea = document.getElementById('detail-scroll-area');
  const detailFixedHeader = document.getElementById('detail-fixed-header');
  if (detailScrollArea && detailFixedHeader) {
    detailScrollArea.addEventListener(
      'scroll',
      () => {
        detailFixedHeader.classList.toggle('is-scrolled', detailScrollArea.scrollTop > 180);
      },
      { passive: true }
    );
  }

  // Tombol Kembali & Tombol Keranjang di Halaman Detail
  document.getElementById('back-to-rack-btn').addEventListener('click', closeDetailView);
  const detailCartBtn = document.getElementById('detail-cart-open-btn');
  if (detailCartBtn) detailCartBtn.addEventListener('click', openCartDrawer);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.viewMode === 'detail') {
      closeDetailView();
    }
  });

  // Tombol "Ganti" Warna di Halaman Detail
  const colorChangeBtn = document.getElementById('color-change-btn');
  if (colorChangeBtn) {
    colorChangeBtn.addEventListener('click', () => {
      state.colorPickerOpen = !state.colorPickerOpen;
      const swatchesWrap = document.getElementById('detail-color-swatches');
      if (swatchesWrap) swatchesWrap.classList.toggle('is-hidden', !state.colorPickerOpen);
      colorChangeBtn.setAttribute('aria-expanded', String(state.colorPickerOpen));
      colorChangeBtn.textContent = state.colorPickerOpen ? 'Tutup' : 'Ganti';
    });
  }

  // Dropdown "Pilih ukuran" untuk menambah ukuran atau menambah kuantitas ukuran
  const sizeSelect = document.getElementById('detail-size-select');
  if (sizeSelect) {
    sizeSelect.addEventListener('change', () => {
      const chosen = sizeSelect.value;
      if (!chosen) return;
      state.sizeQtys[chosen] = (state.sizeQtys[chosen] || 0) + 1;
      sizeSelect.value = '';
      renderSizeRows();
      syncOrderTotalDisplay();
    });
  }

  // Tambahan Opsional
  const sablonBtn = document.getElementById('addon-custom-sablon');
  const giftBtn = document.getElementById('addon-gift-box');

  sablonBtn.addEventListener('click', () => {
    state.addons.sablon = !state.addons.sablon;
    sablonBtn.dataset.active = String(state.addons.sablon);
    syncOrderTotalDisplay();
  });

  giftBtn.addEventListener('click', () => {
    state.addons.giftbox = !state.addons.giftbox;
    giftBtn.dataset.active = String(state.addons.giftbox);
    syncOrderTotalDisplay();
  });

  // Tab Sudut Tampilan ("Samping", "Depan", "Belakang")
  document.querySelectorAll('.angle-tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.detailAngle = btn.dataset.angle;
      playHangerSound('slide');
      renderDetail3DCardFaces();
    });
  });

  // Drag-to-Spin 180° di Tengah Halaman Detail
  const detailStageEl = document.getElementById('detail-garment-stage');
  let isDraggingSpin = false;
  let dragStartX = 0;
  let dragStartDeg = 0;

  detailStageEl.addEventListener('pointerdown', (e) => {
    isDraggingSpin = true;
    dragStartX = e.clientX;
    dragStartDeg = state.detailSpinDeg;
    const rotator = document.getElementById('detail-garment-rotator');
    if (rotator) rotator.classList.add('is-dragging');
    detailStageEl.setPointerCapture(e.pointerId);
  });

  detailStageEl.addEventListener('pointermove', (e) => {
    if (!isDraggingSpin) return;
    const deltaX = e.clientX - dragStartX;
    state.detailSpinDeg = dragStartDeg + deltaX * 0.65;
    const rotator = document.getElementById('detail-garment-rotator');
    if (rotator) rotator.style.transform = `rotateY(${state.detailSpinDeg}deg)`;
  });

  const endSpinDrag = (e) => {
    if (!isDraggingSpin) return;
    isDraggingSpin = false;
    const rotator = document.getElementById('detail-garment-rotator');
    if (rotator) rotator.classList.remove('is-dragging');

    const moved = Math.abs((e.clientX || dragStartX) - dragStartX);
    if (moved < 6) {
      state.detailAngle = state.detailAngle === 'front' ? 'back' : 'front';
      playHangerSound('slide');
      renderDetail3DCardFaces();
      return;
    }

    const normalized = ((state.detailSpinDeg % 360) + 360) % 360;
    if (normalized > 90 && normalized < 270) {
      state.detailAngle = 'back';
      state.detailSpinDeg = 180;
    } else {
      state.detailAngle = 'front';
      state.detailSpinDeg = 0;
    }
    playHangerSound('slide');
    applyDetailSpinTransform();
  };

  detailStageEl.addEventListener('pointerup', endSpinDrag);
  detailStageEl.addEventListener('pointercancel', endSpinDrag);

  // Tombol Masukkan Keranjang & Pesan WA
  document.getElementById('detail-add-cart-btn').addEventListener('click', () => addCurrentItemToCart(false));
  document.getElementById('detail-buy-wa-btn').addEventListener('click', () => addCurrentItemToCart(true));

  // Drawer Keranjang
  document.getElementById('cart-open-btn').addEventListener('click', openCartDrawer);
  document.getElementById('cart-close-btn').addEventListener('click', closeCartDrawer);
  document.getElementById('cart-backdrop').addEventListener('click', closeCartDrawer);

  document.querySelectorAll('#fulfillment-choice .mig-choice-pill').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#fulfillment-choice .mig-choice-pill').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      state.fulfillmentMethod = btn.dataset.method;
    });
  });

  document.getElementById('checkout-wa-btn').addEventListener('click', sendOrderToWhatsApp);

  // Modal Panduan Ukuran
  const sizeModal = document.getElementById('size-modal-backdrop');
  document.getElementById('size-guide-btn').addEventListener('click', () => sizeModal.classList.remove('is-hidden'));
  document.getElementById('size-modal-close').addEventListener('click', () => sizeModal.classList.add('is-hidden'));
  document.getElementById('size-modal-ok').addEventListener('click', () => sizeModal.classList.add('is-hidden'));

  // Modal Pengaturan Produk, Foto, & Judul Kategori
  const customModal = document.getElementById('custom-modal-backdrop');

  // Klik Kicker di bawah rak langsung membuka Tab 2 (Judul & keterangan)
  const heroKickerBtn = document.getElementById('hero-kicker-btn');
  if (heroKickerBtn) {
    heroKickerBtn.addEventListener('click', () => openCustomModal('category'));
  }

  const tabProdBtn = document.getElementById('modal-tab-product-btn');
  const tabCatBtn = document.getElementById('modal-tab-category-btn');
  if (tabProdBtn) tabProdBtn.addEventListener('click', () => switchCustomModalTab('product'));
  if (tabCatBtn) tabCatBtn.addEventListener('click', () => switchCustomModalTab('category'));

  document.getElementById('custom-modal-close').addEventListener('click', () => customModal.classList.add('is-hidden'));
  document.getElementById('custom-product-select').addEventListener('change', syncCustomModalInputs);

  // Tombol "Pilih foto" memicu input file tersembunyi
  document.querySelectorAll('.photo-pick-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.fileTarget;
      const inputEl = document.getElementById(targetId);
      if (inputEl) inputEl.click();
    });
  });

  const bindFileChange = (inputId, prefix, deg) => {
    const input = document.getElementById(inputId);
    if (!input) return;
    input.addEventListener('change', () => {
      if (input.files && input.files[0]) {
        updatePhotoSlotUI(prefix, deg, true);
      }
    });
  };
  bindFileChange('custom-front-file', 'front', '0°');
  bindFileChange('custom-back-file', 'back', '180°');
  bindFileChange('custom-side-file', 'side', '90°');

  // Format input harga otomatis ("Rp 115.000")
  const priceInputEl = document.getElementById('custom-price-input');
  if (priceInputEl) {
    priceInputEl.addEventListener('blur', () => {
      const num = parseRupiahInput(priceInputEl.value);
      if (num > 0) priceInputEl.value = formatRupiah(num);
    });
  }

  // Saat pengguna mengetik Nama Produk, sesuaikan Label Warna otomatis jika belum diubah manual
  const nameInputEl = document.getElementById('custom-name-input');
  const variantInputEl = document.getElementById('custom-variant-input');
  if (nameInputEl && variantInputEl) {
    variantInputEl.addEventListener('input', () => {
      variantInputEl.dataset.manualEdit = 'true';
    });
    nameInputEl.addEventListener('input', () => {
      if (variantInputEl.dataset.manualEdit !== 'true') {
        variantInputEl.value =
          nameInputEl.value.replace(/^(Kaos|Jersey|Jaket|Kemeja)\s+/i, '').trim() || nameInputEl.value;
      }
    });
  }

  document.getElementById('custom-save-btn').addEventListener('click', async () => {
    const itemId = document.getElementById('custom-product-select').value;
    const nameVal = document.getElementById('custom-name-input').value.trim();
    const variantVal = document.getElementById('custom-variant-input')?.value.trim() || '';
    const priceVal = parseRupiahInput(document.getElementById('custom-price-input').value) || 65000;
    const ownHangerVal = document.getElementById('custom-own-hanger-check')?.checked !== false;

    const frontFile = document.getElementById('custom-front-file').files[0];
    const backFile = document.getElementById('custom-back-file')?.files[0];
    const sideFile = document.getElementById('custom-side-file').files[0];

    const prev = state.customPhotos[itemId] || {};
    const nextData = {
      name: nameVal,
      colorName: variantVal || nameVal.replace(/^(Kaos|Jersey|Jaket|Kemeja)\s+/i, '').trim() || nameVal,
      price: priceVal,
      ownHanger: ownHangerVal,
      frontDataUrl: prev.frontDataUrl || null,
      backDataUrl: prev.backDataUrl || null,
      sideDataUrl: prev.sideDataUrl || null,
    };

    if (frontFile) nextData.frontDataUrl = await readAndResizeImageFile(frontFile);
    if (backFile) nextData.backDataUrl = await readAndResizeImageFile(backFile);
    if (sideFile) {
      nextData.sideDataUrl = await readAndResizeImageFile(sideFile);
    } else if (frontFile && !nextData.sideDataUrl) {
      nextData.sideDataUrl = await autoGenerateSideProfileFromFront(nextData.frontDataUrl);
    }

    state.customPhotos[itemId] = nextData;

    const catId = state.category;
    state.customCategories[catId] = {
      tabLabel: document.getElementById('custom-cat-tab-input')?.value.trim() || '',
      heroTitle: document.getElementById('custom-cat-hero-input')?.value.trim() || '',
      kicker: document.getElementById('custom-cat-kicker-input')?.value.trim() || '',
      subtitle: document.getElementById('custom-cat-subtitle-input')?.value.trim() || '',
      material: document.getElementById('custom-cat-material-input')?.value.trim() || '',
      weight: document.getElementById('custom-cat-weight-input')?.value.trim() || '',
      description: document.getElementById('custom-cat-desc-input')?.value.trim() || '',
    };

    try {
      localStorage.setItem('mig-apparel-custom-photos', JSON.stringify(state.customPhotos));
      localStorage.setItem('mig-apparel-custom-categories', JSON.stringify(state.customCategories));
    } catch {
      // Abaikan jika melebihi kuota localStorage
    }

    document.getElementById('custom-front-file').value = '';
    if (document.getElementById('custom-back-file')) document.getElementById('custom-back-file').value = '';
    document.getElementById('custom-side-file').value = '';

    customModal.classList.add('is-hidden');
    renderRackStage(false);
    if (state.viewMode === 'detail') renderDetailStage();
    showToast('Produk & kategori berhasil disesuaikan');
  });

  document.getElementById('custom-reset-btn').addEventListener('click', () => {
    state.customPhotos = {};
    state.customCategories = {};
    localStorage.removeItem('mig-apparel-custom-photos');
    localStorage.removeItem('mig-apparel-custom-categories');
    customModal.classList.add('is-hidden');
    renderRackStage(false);
    if (state.viewMode === 'detail') renderDetailStage();
    showToast('Dikembalikan ke setelan bawaan');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadCartFromStorage();
  renderRackStage(false);
  initEvents();

  const h = window.location.hash;
  if (h.includes('kemeja')) {
    const kemejaChip = document.querySelector('.mig-chip[data-category="puffer"]');
    if (kemejaChip) kemejaChip.click();
  }
  if (h.includes('jersey')) {
    const jerseyChip = document.querySelector('.mig-chip[data-category="jersey"]');
    if (jerseyChip) jerseyChip.click();
  }
  if (h.includes('detail')) {
    openDetailViewWithFlight(state.activeIndex);
  }
  if (h.includes('modal')) {
    const btn = document.getElementById('upload-custom-btn');
    if (btn) btn.click();
  }
});
