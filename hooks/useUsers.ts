import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi, queryKeys } from '@/services/api';
import { CreateUserData } from '@/types';

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
    onError: error => {
      console.error('Error creating user:', error);
    },
  });
};
