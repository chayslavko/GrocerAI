export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  isPurchased: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface CreateGroceryItemData {
  name: string;
  quantity: number;
}

export interface UpdateGroceryItemData {
  name?: string;
  quantity?: number;
  isPurchased?: boolean;
}

export interface CreateUserData {
  name: string;
}

export interface UpdateUserData {
  name?: string;
}

export const StorageKeys = {
  USER: '@user',
  USER_PREFERENCES: '@user_preferences',
  GROCERY_ITEMS: '@grocery_items',
  OFFLINE_ACTIONS: '@offline_actions',
} as const;
