import { QueryClient } from '@tanstack/react-query';
import { ApiError, queryKeys } from './api/';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: (failureCount, error) => {
        if (
          error instanceof ApiError &&
          error.status >= 400 &&
          error.status < 500
        ) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      networkMode: 'offlineFirst',
    },
    mutations: {
      retry: (failureCount, error) => {
        if (
          error instanceof ApiError &&
          error.status >= 400 &&
          error.status < 500
        ) {
          return false;
        }
        return failureCount < 1;
      },
      networkMode: 'online',
    },
  },
});

export const invalidateQueries = {
  grocery: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.grocery });
  },

  groceryItem: (id: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.groceryItem(id) });
  },

  users: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.users });
  },

  user: (id: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.user(id) });
  },

  userByName: (name: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.userByName(name) });
  },
};

export const prefetchQueries = {
  grocery: async () => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.grocery,
      queryFn: async () => {
        return [];
      },
    });
  },

  users: async () => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.users,
      queryFn: async () => {
        return [];
      },
    });
  },
};

export default queryClient;
