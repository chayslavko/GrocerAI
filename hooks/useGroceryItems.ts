import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { groceryItemsApi, queryKeys } from '@/services/api';
import {
  GroceryItem,
  CreateGroceryItemData,
  UpdateGroceryItemData,
} from '@/types';

export const useGroceryItems = () => {
  return useQuery({
    queryKey: queryKeys.groceryItems,
    queryFn: groceryItemsApi.getAll,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useGroceryItem = (id: string) => {
  return useQuery({
    queryKey: queryKeys.groceryItem(id),
    queryFn: () => groceryItemsApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateGroceryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGroceryItemData) => groceryItemsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.groceryItems });
    },
    onError: error => {
      console.error('Error creating grocery item:', error);
    },
  });
};

export const useUpdateGroceryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGroceryItemData }) =>
      groceryItemsApi.update(id, data),
    onSuccess: updatedItem => {
      queryClient.invalidateQueries({ queryKey: queryKeys.groceryItems });
      queryClient.invalidateQueries({
        queryKey: queryKeys.groceryItem(updatedItem.id),
      });
    },
    onError: error => {
      console.error('Error updating grocery item:', error);
    },
  });
};

export const useDeleteGroceryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => groceryItemsApi.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.groceryItems });
      queryClient.invalidateQueries({
        queryKey: queryKeys.groceryItem(deletedId),
      });
    },
    onError: error => {
      console.error('Error deleting grocery item:', error);
    },
  });
};

export const useTogglePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isPurchased }: { id: string; isPurchased: boolean }) =>
      groceryItemsApi.update(id, { isPurchased }),
    onSuccess: updatedItem => {
      queryClient.invalidateQueries({ queryKey: queryKeys.groceryItems });
      queryClient.invalidateQueries({
        queryKey: queryKeys.groceryItem(updatedItem.id),
      });
    },
    onError: error => {
      console.error('Error toggling purchase status:', error);
    },
  });
};
