import { CategoryData, CategoryId, GarmentItem } from '@/types';

// Simpan referensi HTMLImageElement di memori agar bitmap hasil decode tidak di-GC browser saat berpindah tab kategori
const decodedImageCache = new Map<string, HTMLImageElement>();

const IMAGE_CONCURRENCY = 6;
const IMAGE_TIMEOUT_MS = 15000;

function pushUnique(target: string[], seen: Set<string>, url?: string | null) {
  if (!url || seen.has(url)) return;
  seen.add(url);
  target.push(url);
}

function collectItemUrls(
  item: GarmentItem,
  fields: Array<keyof Pick<GarmentItem, 'front' | 'side' | 'back' | 'flashFront' | 'flashBack' | 'reflectiveFront' | 'reflectiveBack'>>,
  target: string[],
  seen: Set<string>
) {
  for (const field of fields) {
    pushUnique(target, seen, item[field]);
  }
}

/**
 * Mengumpulkan seluruh URL gambar katalog dalam urutan prioritas:
 * 1. Logo & tampak depan/samping kategori utama
 * 2. Tampak depan/samping kategori lainnya
 * 3. Tampak belakang & efek flash/reflektif semua kategori
 */
export function collectCatalogImageUrls(
  categories: Record<CategoryId, CategoryData>,
  primaryCategory: CategoryId = 'kaos'
): string[] {
  const urls: string[] = [];
  const seen = new Set<string>();

  pushUnique(urls, seen, '/logo.svg');

  const categoryIds = Object.keys(categories) as CategoryId[];
  const orderedIds: CategoryId[] = [
    ...(categories[primaryCategory] ? [primaryCategory] : []),
    ...categoryIds.filter((id) => id !== primaryCategory),
  ];

  // Prioritas 1 & 2: Tampak depan & samping (langsung tampil di rak)
  for (const catId of orderedIds) {
    for (const item of categories[catId].rack) {
      collectItemUrls(item, ['front', 'side'], urls, seen);
    }
  }

  // Prioritas 3: Tampak belakang & aset efek flash
  for (const catId of orderedIds) {
    for (const item of categories[catId].rack) {
      collectItemUrls(
        item,
        ['back', 'flashFront', 'flashBack', 'reflectiveFront', 'reflectiveBack'],
        urls,
        seen
      );
    }
  }

  return urls;
}

/**
 * Memisahkan URL gambar menjadi:
 * - primary: logo + tampak depan/samping kategori utama (wajib siap sebelum masuk panggung utama)
 * - secondary: kategori lain, tampak belakang, dan aset efek flash (dimuat bertahap di latar belakang)
 */
export function collectSplitCatalogImageUrls(
  categories: Record<CategoryId, CategoryData>,
  primaryCategory: CategoryId = 'kaos'
): { primary: string[]; secondary: string[] } {
  const primary: string[] = [];
  const secondary: string[] = [];
  const seen = new Set<string>();

  pushUnique(primary, seen, '/logo.svg');

  const categoryIds = Object.keys(categories) as CategoryId[];
  const orderedIds: CategoryId[] = [
    ...(categories[primaryCategory] ? [primaryCategory] : []),
    ...categoryIds.filter((id) => id !== primaryCategory),
  ];

  // Tahap 1: Tampak depan & samping kategori utama
  if (categories[primaryCategory]) {
    for (const item of categories[primaryCategory].rack) {
      collectItemUrls(item, ['front', 'side'], primary, seen);
    }
  }

  // Tahap 2: Tampak depan & samping kategori lainnya
  for (const catId of orderedIds) {
    if (catId === primaryCategory) continue;
    for (const item of categories[catId].rack) {
      collectItemUrls(item, ['front', 'side'], secondary, seen);
    }
  }

  // Tahap 3: Tampak belakang & aset efek flash semua kategori
  for (const catId of orderedIds) {
    for (const item of categories[catId].rack) {
      collectItemUrls(
        item,
        ['back', 'flashFront', 'flashBack', 'reflectiveFront', 'reflectiveBack'],
        secondary,
        seen
      );
    }
  }

  return { primary, secondary };
}

function loadAndDecodeImage(url: string): Promise<void> {
  const cached = decodedImageCache.get(url);
  if (cached && cached.complete && cached.naturalWidth > 0) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve();
    };

    const timer = setTimeout(finish, IMAGE_TIMEOUT_MS);

    img.onload = () => {
      decodedImageCache.set(url, img);
      if (typeof img.decode === 'function') {
        img.decode().then(finish, finish);
      } else {
        finish();
      }
    };

    img.onerror = finish;
    img.src = url;

    if (img.complete && img.naturalWidth > 0) {
      decodedImageCache.set(url, img);
      if (typeof img.decode === 'function') {
        img.decode().then(finish, finish);
      } else {
        finish();
      }
    }
  });
}

/**
 * Mengunduh dan men-decode seluruh aset gambar katalog sebelum halaman utama tampil.
 */
export async function preloadAllCatalogImages(
  urls: string[],
  onProgress?: (loaded: number, total: number) => void
): Promise<void> {
  const total = urls.length;
  if (total === 0) {
    onProgress?.(0, 0);
    return;
  }

  let nextIndex = 0;
  let completed = 0;

  const runWorker = async () => {
    while (nextIndex < total) {
      const current = nextIndex++;
      await loadAndDecodeImage(urls[current]);
      completed++;
      onProgress?.(completed, total);
    }
  };

  const workerCount = Math.min(IMAGE_CONCURRENCY, total);
  await Promise.all(Array.from({ length: workerCount }, runWorker));
}
