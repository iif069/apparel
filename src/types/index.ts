export type ViewAngle = 'side-left' | 'front' | 'back';

export type CategoryId = 'kaos' | 'jersey' | 'puffer';

export interface GarmentItem {
  id: string;
  name: string;
  colorName: string;
  hex: string;
  highlight: string;
  shadow: string;
  accent: string;
  price: number;
  side: string | null;
  front: string | null;
  back: string | null;
  reflectiveFront?: string | null;
  reflectiveBack?: string | null;
  isReflective?: boolean;
}

export interface CategoryData {
  id: CategoryId;
  tabLabel: string;
  heroTitle: string;
  watermark: string;
  kicker: string;
  subtitle: string;
  rack: GarmentItem[];
}

export interface CartItem {
  cartId: string;
  itemId: string;
  categoryId: CategoryId;
  name: string;
  colorName: string;
  hex: string;
  sizes: Record<string, number>;
  totalQty: number;
  basePrice: number;
  addons: {
    sablon: boolean;
    giftbox: boolean;
  };
  totalPrice: number;
  frontPhoto?: string | null;
}

export interface CustomPhotoData {
  name?: string;
  colorName?: string;
  price?: number;
  ownHanger?: boolean;
  frontDataUrl?: string;
  sideDataUrl?: string;
  backDataUrl?: string;
}

export interface CustomCategoryData {
  tabLabel?: string;
  heroTitle?: string;
  watermark?: string;
  kicker?: string;
  subtitle?: string;
}
