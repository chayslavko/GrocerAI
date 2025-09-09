import ApiService from './ApiService';
import { GroceryItem } from '@/types';

const apiService = ApiService.getInstance();

export const groceryApi = {
  getAll: (): Promise<GroceryItem[]> => {
    return apiService.get<GroceryItem[]>('/grocery');
  },

  getById: (id: string): Promise<GroceryItem> => {
    return apiService.get<GroceryItem>(`/grocery/${id}`);
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
    return apiService.post<GroceryItem>('/grocery', itemWithTimestamps);
  },

  update: (id: string, item: Partial<GroceryItem>): Promise<GroceryItem> => {
    const now = new Date().toISOString();
    const itemWithUpdatedTimestamp = {
      ...item,
      updatedAt: now,
    };
    return apiService.patch<GroceryItem>(
      `/grocery/${id}`,
      itemWithUpdatedTimestamp,
    );
  },

  delete: (id: string): Promise<void> => {
    return apiService.delete<void>(`/grocery/${id}`);
  },

  search: (query: string): Promise<GroceryItem[]> => {
    return apiService.get<GroceryItem[]>(
      `/grocery/search?q=${encodeURIComponent(query)}`,
    );
  },

  getByCategory: (categoryId: string): Promise<GroceryItem[]> => {
    return apiService.get<GroceryItem[]>(`/grocery?category=${categoryId}`);
  },
};
