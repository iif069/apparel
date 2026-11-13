/**
 * flyToCart.ts — Animasi Resmi Kasir MIG DIGITAL PRINTING (Web Pembeli)
 * Sesuai aturan DESIGN-SYSTEM.md v1.10 & Kasir-MIG-DIGITAL-PRINTING/apps/pembeli/src/lib/flyToCart.js
 *
 * "Masukkan keranjang" di halaman produk:
 * Foto barang melayang ke tombol keranjang (--motion-fly 600ms, muncul paling jauh 140px dari keranjang)
 * lalu tombol keranjang berdenyut (bump); pembeli tetap di halaman produk tanpa toast yang menutupi tombol.
 */

export const TARGET_SELECTOR = '[data-cart-target]';

const TARGET_BUMPS: Record<string, number> = { icon: 1.18 };
export const cartTargetProps = (kind = 'icon') => ({ 'data-cart-target': kind });

const START_SIZE_PX = 64; // Foto saat muncul
const END_SIZE_PX = 24; // Seukuran ikon troli saat sampai
const APPEAR_SCALE = 0.6; // Muncul membesar dari 60%
const APPEAR_PART = 0.25; // 25% waktu untuk muncul membesar; 75% sisanya terbang
const FLYER_RADIUS = '1rem'; // Sudut foto (rounded-2xl)

const center = (rect: DOMRect) => ({
  x: rect.left + rect.width / 2,
  y: rect.top + rect.height / 2,
});

export function visibleCartTargets(): HTMLElement[] {
  return Array.from(document.querySelectorAll<HTMLElement>(TARGET_SELECTOR)).filter((element) => {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  });
}

// Titik muncul: dari tengah keranjang ke arah foto produk, paling jauh `reach` px (140px)
function startPoint(
  origin: { x: number; y: number },
  end: { x: number; y: number },
  reach = 140
) {
  const dx = origin.x - end.x;
  const dy = origin.y - end.y;
  const distance = Math.hypot(dx, dy);
  if (distance <= reach) return origin;
  return {
    x: end.x + (dx / distance) * reach,
    y: end.y + (dy / distance) * reach,
  };
}

// Wadah melayang (flyer) di lapisan paling atas
function createFlyer(content: HTMLElement, point: { x: number; y: number }) {
  const flyer = document.createElement('div');
  flyer.setAttribute('aria-hidden', 'true');
  Object.assign(flyer.style, {
    position: 'fixed',
    left: `${point.x - START_SIZE_PX / 2}px`,
    top: `${point.y - START_SIZE_PX / 2}px`,
    width: `${START_SIZE_PX}px`,
    height: `${START_SIZE_PX}px`,
    margin: '0',
    padding: '0',
    border: '1.5px solid var(--color-line, #e2e0ea)',
    borderRadius: FLYER_RADIUS,
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--color-surface, #ffffff)',
    color: 'var(--color-ink, #1c1b1a)',
    boxShadow: '0 10px 28px rgba(40, 14, 62, 0.2)',
    pointerEvents: 'none',
    zIndex: '99999',
    willChange: 'transform, opacity',
  });

  content.style.animation = 'none';
  flyer.append(content);
  document.body.append(flyer);
  return flyer;
}

export function bumpCartTargets(targets?: HTMLElement[]) {
  const elements = targets || visibleCartTargets();
  const duration = 250;
  const easing = 'cubic-bezier(0.2, 0.8, 0.2, 1)';

  for (const element of elements) {
    const kind = element.dataset.cartTarget || 'icon';
    const scale = TARGET_BUMPS[kind] ?? 1.18;
    element.animate(
      [
        { transform: 'scale(1)' },
        { transform: `scale(${scale})` },
        { transform: 'scale(1)' },
      ],
      { duration, easing }
    );
  }
}

export interface FlyOptions {
  sourceElement?: HTMLElement | null;
  photoUrl?: string | null;
  fallbackColor?: string | null;
  reach?: number;
}

/**
 * Menerbangkan foto produk ke tombol keranjang belanja yang terlihat
 */
export function flyToCart(options: FlyOptions | HTMLElement) {
  // Jika prefer reduced motion, langsung jalankan bump
  if (
    typeof window === 'undefined' ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    typeof Element.prototype.animate !== 'function'
  ) {
    bumpCartTargets();
    return;
  }

  let sourceEl: HTMLElement | null = null;
  let photoUrl: string | null = null;
  let fallbackColor: string | null = null;
  let reach = 140;

  if (options instanceof HTMLElement) {
    sourceEl = options;
  } else if (options) {
    sourceEl = options.sourceElement || null;
    photoUrl = options.photoUrl || null;
    fallbackColor = options.fallbackColor || null;
    if (typeof options.reach === 'number') reach = options.reach;
  }

  // Buat konten gambar atau warna
  const content = document.createElement('div');
  content.style.width = '100%';
  content.style.height = '100%';
  content.style.display = 'flex';
  content.style.alignItems = 'center';
  content.style.justifyContent = 'center';

  if (photoUrl) {
    const img = document.createElement('img');
    img.src = photoUrl;
    img.alt = '';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'contain';
    img.style.pointerEvents = 'none';
    content.append(img);
  } else if (fallbackColor) {
    const dot = document.createElement('span');
    dot.style.width = '38px';
    dot.style.height = '38px';
    dot.style.borderRadius = '9999px';
    dot.style.backgroundColor = fallbackColor;
    dot.style.boxShadow = '0 2px 8px rgba(0,0,0,0.18)';
    dot.style.display = 'inline-block';
    content.append(dot);
  } else if (sourceEl?.firstElementChild) {
    const copy = sourceEl.firstElementChild.cloneNode(true) as HTMLElement;
    content.append(copy);
  } else {
    bumpCartTargets();
    return;
  }

  // Hitung titik awal origin
  let origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  if (sourceEl) {
    const rect = sourceEl.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      origin = center(rect);
    }
  }

  requestAnimationFrame(() => {
    const targets = visibleCartTargets();
    const target = targets[0];
    if (!target) {
      return;
    }

    const end = center(target.getBoundingClientRect());
    const start = startPoint(origin, end, reach);
    const endScale = END_SIZE_PX / START_SIZE_PX;
    const flyer = createFlyer(content, start);

    const flight = flyer.animate(
      [
        {
          transform: `translate(0, 0) scale(${APPEAR_SCALE})`,
          opacity: 0,
          easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
        },
        {
          offset: APPEAR_PART,
          transform: 'translate(0, 0) scale(1)',
          opacity: 1,
          easing: 'cubic-bezier(0.4, 0, 1, 1)',
        },
        {
          transform: `translate(${end.x - start.x}px, ${end.y - start.y}px) scale(${endScale})`,
          opacity: 1,
        },
      ],
      { duration: 600 }
    );

    flight.oncancel = () => flyer.remove();
    flight.onfinish = () => {
      flyer.remove();
      bumpCartTargets(targets);
    };
  });
}
