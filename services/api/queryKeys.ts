export const queryKeys = {
  groceryItems: ['groceryItems'] as const,
  groceryItem: (id: string) => ['groceryItems', id] as const,
  groceryItemsByCategory: (category: string) =>
    ['groceryItems', 'category', category] as const,
  groceryItemsByList: (listId: string) =>
    ['groceryItems', 'list', listId] as const,
  groceryItemsSearch: (query: string) =>
    ['groceryItems', 'search', query] as const,
} as const;
