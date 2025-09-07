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
  groceryItems: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.groceryItems });
  },

  groceryItem: (id: string) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.groceryItem(id) });
  },
};

export const prefetchQueries = {
  groceryItems: async () => {
    await queryClient.prefetchQuery({
      queryKey: queryKeys.groceryItems,
      queryFn: async () => {
        return [];
      },
    });
  },
};

export default queryClient;
