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

export const useUserByUsername = (username: string) => {
  return useQuery({
    queryKey: queryKeys.userByUsername(username),
    queryFn: () => userApi.getByUsername(username),
    enabled: !!username,
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
        queryKey: queryKeys.userByUsername(newUser.username),
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
        queryKey: queryKeys.userByUsername(updatedUser.username),
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
