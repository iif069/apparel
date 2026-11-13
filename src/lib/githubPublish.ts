import { CategoryData, CategoryId, CustomCategoryData, CustomPhotoData } from '@/types';

const GITHUB_OWNER = 'iif069';
const GITHUB_REPO = 'apparel';
const GITHUB_BRANCH = 'main';
const CATALOG_FILE_PATH = 'src/data/catalog.json';

function utf8ToBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

async function getFileSha(token: string, path: string): Promise<string | undefined> {
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
      },
    }
  );
  if (res.status === 404) return undefined;
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Gagal membaca ${path} (${res.status})`);
  }
  const data = await res.json();
  return data.sha;
}

async function putFileToGitHub(
  token: string,
  path: string,
  base64Content: string,
  message: string
): Promise<{ commitUrl?: string }> {
  const sha = await getFileSha(token, path);
  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        content: base64Content,
        branch: GITHUB_BRANCH,
        ...(sha ? { sha } : {}),
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    if (res.status === 401) {
      throw new Error('Token GitHub tidak valid atau sudah kedaluwarsa.');
    }
    if (res.status === 403 || res.status === 404) {
      throw new Error('Token tidak punya izin tulis (Contents: Read & write) ke repo iif069/apparel.');
    }
    throw new Error(err.message || `Gagal push ke GitHub (${res.status})`);
  }

  const data = await res.json();
  return { commitUrl: data?.commit?.html_url };
}

export async function publishCatalogToGitHub(params: {
  token: string;
  baseCategories: Record<CategoryId, CategoryData>;
  customPhotos: Record<string, CustomPhotoData>;
  customCategories: Record<string, CustomCategoryData>;
}): Promise<{ commitUrl?: string; uploadedImages: number }> {
  const { token, baseCategories, customPhotos, customCategories } = params;
  const cleanToken = token.trim();
  if (!cleanToken) {
    throw new Error('Masukkan GitHub Personal Access Token terlebih dahulu.');
  }

  // Klon data agar tidak memutasi objek asli
  const merged = JSON.parse(JSON.stringify(baseCategories)) as Record<CategoryId, CategoryData>;
  let uploadedImages = 0;

  for (const catId of Object.keys(merged) as CategoryId[]) {
    const cat = merged[catId];
    const catCustom = customCategories[catId];
    if (catCustom?.tabLabel) cat.tabLabel = catCustom.tabLabel;
    if (catCustom?.heroTitle) {
      cat.heroTitle = catCustom.heroTitle;
      cat.watermark = catCustom.heroTitle;
    }

    for (const item of cat.rack) {
      const custom = customPhotos[item.id];
      if (!custom) continue;

      if (custom.name) item.name = custom.name;
      if (custom.colorName) item.colorName = custom.colorName;
      if (typeof custom.price === 'number' && custom.price > 0) item.price = custom.price;

      const angleMap: Array<{ dataUrl?: string; key: 'front' | 'side' | 'back' }> = [
        { dataUrl: custom.frontDataUrl, key: 'front' },
        { dataUrl: custom.sideDataUrl, key: 'side' },
        { dataUrl: custom.backDataUrl, key: 'back' },
      ];

      for (const { dataUrl, key } of angleMap) {
        if (dataUrl && dataUrl.startsWith('data:image/')) {
          const match = dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
          if (match) {
            const rawExt = match[1].toLowerCase() === 'jpeg' ? 'jpg' : match[1].toLowerCase();
            const base64Body = match[2];
            const repoImgPath = `public/products/${item.id}-${key}.${rawExt}`;
            await putFileToGitHub(
              cleanToken,
              repoImgPath,
              base64Body,
              `chore(katalog): update gambar ${item.id} (${key}) via Mode Admin`
            );
            item[key] = `/products/${item.id}-${key}.${rawExt}`;
            uploadedImages += 1;
          }
        }
      }
    }
  }

  const jsonContent = JSON.stringify(merged, null, 2) + '\n';
  const result = await putFileToGitHub(
    cleanToken,
    CATALOG_FILE_PATH,
    utf8ToBase64(jsonContent),
    'chore(katalog): update harga & data produk via Mode Admin web'
  );

  return { commitUrl: result.commitUrl, uploadedImages };
}
