import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, queryKeys } from '@/services/api';
import { User, CreateUserData, UpdateUserData } from '@/types';

export const useUser = (id: string) => {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => userApi.getById(id),
    enabled: !!id,
  });
};

export const useUserByName = (name: string) => {
  return useQuery({
    queryKey: queryKeys.userByName(name),
    queryFn: () => userApi.getByName(name),
    enabled: !!name,
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserData) => userApi.create(data),
    onSuccess: newUser => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      queryClient.invalidateQueries({ queryKey: queryKeys.user(newUser.id) });
      queryClient.invalidateQueries({
        queryKey: queryKeys.userByName(newUser.name),
      });
    },
    onError: error => {
      console.error('Error creating user:', error);
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) =>
      userApi.update(id, data),
    onSuccess: updatedUser => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      queryClient.invalidateQueries({
        queryKey: queryKeys.user(updatedUser.id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.userByName(updatedUser.name),
      });
    },
    onError: error => {
      console.error('Error updating user:', error);
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => userApi.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users });
      queryClient.invalidateQueries({
        queryKey: queryKeys.user(deletedId),
      });
    },
    onError: error => {
      console.error('Error deleting user:', error);
    },
  });
};
