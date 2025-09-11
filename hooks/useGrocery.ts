import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { groceryApi, queryKeys } from "@/services/api";
import {
  CreateGroceryItemData,
  UpdateGroceryItemData,
  GroceryItem,
} from "@/types";

export const useGroceryItems = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.grocery,
    queryFn: groceryApi.getAll,
    enabled: !!userId,
  });
};

export const useGroceryItem = (id: string) => {
  return useQuery({
    queryKey: queryKeys.groceryItem(id),
    queryFn: () => groceryApi.getById(id),
    enabled: !!id,
  });
};

export const useGroceryItemsByUser = (userId?: string) => {
  return useQuery({
    queryKey: queryKeys.groceryByUser(userId || ""),
    queryFn: () => groceryApi.getByUserId(userId!),
    enabled: !!userId,
  });
};

export const useCreateGroceryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGroceryItemData) => groceryApi.create(data),
    onSuccess: (newItem) => {
      queryClient.setQueryData(
        queryKeys.groceryByUser(newItem.userId),
        (oldData: GroceryItem[] | undefined) =>
          oldData ? [...oldData, newItem] : [newItem]
      );
    },
    onError: (error) => {
      console.error("Error creating grocery item:", error);
    },
  });
};

export const useUpdateGroceryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGroceryItemData }) =>
      groceryApi.update(id, data),
    onSuccess: (updatedItem) => {
      queryClient.setQueryData(
        queryKeys.groceryByUser(updatedItem.userId),
        (oldData: GroceryItem[] | undefined) =>
          oldData?.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          ) || []
      );
    },
    onError: (error) => {
      console.error("Error updating grocery item:", error);
    },
  });
};

export const useDeleteGroceryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => groceryApi.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.grocery });
      queryClient.invalidateQueries({
        queryKey: queryKeys.groceryItem(deletedId),
      });
    },
    onError: (error) => {
      console.error("Error deleting grocery item:", error);
    },
  });
};

export const useTogglePurchase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isPurchased }: { id: string; isPurchased: boolean }) =>
      groceryApi.update(id, { isPurchased }),
    onSuccess: (updatedItem) => {
      queryClient.setQueryData(
        queryKeys.groceryByUser(updatedItem.userId),
        (oldData: GroceryItem[] | undefined) =>
          oldData?.map((item) =>
            item.id === updatedItem.id ? updatedItem : item
          ) || []
      );
    },
    onError: (error) => {
      console.error("Error toggling purchase status:", error);
    },
  });
};
