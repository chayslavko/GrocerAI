import ApiService from "./ApiService";
import { GroceryItem } from "@/types";

const apiService = ApiService.getInstance();

export const groceryApi = {
  getAll: (): Promise<GroceryItem[]> => {
    return apiService.get<GroceryItem[]>("/groceries");
  },

  getById: (id: string): Promise<GroceryItem> => {
    return apiService.get<GroceryItem>(`/groceries/${id}`);
  },

  getByUserId: (userId: string): Promise<GroceryItem[]> => {
    return apiService.get<GroceryItem[]>(
      `/groceries?userId=${encodeURIComponent(userId)}`
    );
  },

  create: (
    item: Omit<GroceryItem, "id" | "createdAt" | "updatedAt" | "isPurchased">
  ): Promise<GroceryItem> => {
    const now = new Date().toISOString();
    const itemWithTimestamps = {
      ...item,
      isPurchased: false,
      createdAt: now,
      updatedAt: now,
    };
    return apiService.post<GroceryItem>("/groceries", itemWithTimestamps);
  },

  update: (id: string, item: Partial<GroceryItem>): Promise<GroceryItem> => {
    const now = new Date().toISOString();
    const itemWithUpdatedTimestamp = {
      ...item,
      updatedAt: now,
    };
    return apiService.patch<GroceryItem>(
      `/groceries/${id}`,
      itemWithUpdatedTimestamp
    );
  },

  delete: (id: string): Promise<void> => {
    return apiService.delete<void>(`/groceries/${id}`);
  },
};
