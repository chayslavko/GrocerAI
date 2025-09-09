export const queryKeys = {
  grocery: ['grocery'] as const,
  groceryItem: (id: string) => ['grocery', id] as const,
  groceryByUser: (userId: string) => ['grocery', 'user', userId] as const,
  users: ['users'] as const,
  user: (id: string) => ['users', id] as const,
  userByUsername: (username: string) =>
    ['users', 'username', username] as const,
} as const;
