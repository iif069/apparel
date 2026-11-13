import { CategoryData, CategoryId } from '@/types';
import catalogData from './catalog.json';

export const INITIAL_CATEGORIES = catalogData as Record<CategoryId, CategoryData>;
