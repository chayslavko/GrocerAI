export const queryKeys = {
  groceryItems: ['groceryItems'] as const,
  groceryItem: (id: string) => ['groceryItems', id] as const,
} as const;
