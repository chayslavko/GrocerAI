export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  isPurchased: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  username: string;
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
  userId: string;
}

export interface UpdateGroceryItemData {
  name?: string;
  quantity?: number;
  isPurchased?: boolean;
}

export interface CreateUserData {
  username: string;
}

export interface UpdateUserData {
  username?: string;
}

export const StorageKeys = {
  USER: '@user',
} as const;
