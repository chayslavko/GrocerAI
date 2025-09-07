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

  create: (item: Omit<GroceryItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<GroceryItem> => {
    return apiService.post<GroceryItem>('/groceryItems', item);
  },

  update: (id: string, item: Partial<GroceryItem>): Promise<GroceryItem> => {
    return apiService.put<GroceryItem>(`/groceryItems/${id}`, item);
  },

  delete: (id: string): Promise<void> => {
    return apiService.delete<void>(`/groceryItems/${id}`);
  },

  search: (query: string): Promise<GroceryItem[]> => {
    return apiService.get<GroceryItem[]>(`/groceryItems/search?q=${encodeURIComponent(query)}`);
  },

  getByCategory: (categoryId: string): Promise<GroceryItem[]> => {
    return apiService.get<GroceryItem[]>(`/groceryItems?category=${categoryId}`);
  },
};
