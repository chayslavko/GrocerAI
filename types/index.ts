export interface GroceryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  isPurchased: boolean;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  barcode?: string;
  imageUrl?: string;
  estimatedPrice?: number;
}

export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export const StorageKeys = {
  USER: '@user',
} as const;
