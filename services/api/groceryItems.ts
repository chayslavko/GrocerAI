import ApiService from './ApiService';
import { GroceryItem } from '@/types';

const apiService = ApiService.getInstance();

export const groceryItemsApi = {
  getAll: (): Promise<GroceryItem[]> => {
    return apiService.get<GroceryItem[]>('/groceryItems');
  },

  getById: (id: string): Promise<GroceryItem> => {
    return apiService.get<GroceryItem>(`/groceryItems/${id}`);
  },

  create: (
    item: Omit<GroceryItem, 'id' | 'createdAt' | 'updatedAt' | 'isPurchased'>,
  ): Promise<GroceryItem> => {
    const now = new Date().toISOString();
    const itemWithTimestamps = {
      ...item,
      isPurchased: false,
      createdAt: now,
      updatedAt: now,
    };
    return apiService.post<GroceryItem>('/groceryItems', itemWithTimestamps);
  },

  update: (id: string, item: Partial<GroceryItem>): Promise<GroceryItem> => {
    const now = new Date().toISOString();
    const itemWithUpdatedTimestamp = {
      ...item,
      updatedAt: now,
    };
    return apiService.patch<GroceryItem>(
      `/groceryItems/${id}`,
      itemWithUpdatedTimestamp,
    );
  },

  delete: (id: string): Promise<void> => {
    return apiService.delete<void>(`/groceryItems/${id}`);
  },

  search: (query: string): Promise<GroceryItem[]> => {
    return apiService.get<GroceryItem[]>(
      `/groceryItems/search?q=${encodeURIComponent(query)}`,
    );
  },

  getByCategory: (categoryId: string): Promise<GroceryItem[]> => {
    return apiService.get<GroceryItem[]>(
      `/groceryItems?category=${categoryId}`,
    );
  },
};
