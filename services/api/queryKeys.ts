export const queryKeys = {
  grocery: ['grocery'] as const,
  groceryItem: (id: string) => ['grocery', id] as const,
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  userByName: (name: string) => ['users', 'name', name] as const,
} as const;
