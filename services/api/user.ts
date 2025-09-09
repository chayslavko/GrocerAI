import ApiService from './ApiService';
import { User } from '@/types';

const apiService = ApiService.getInstance();

export const userApi = {
  getById: (id: string): Promise<User> => {
    return apiService.get<User>(`/users/${id}`);
  },

  getByName: (name: string): Promise<User> => {
    return apiService.get<User>(`/users/name/${encodeURIComponent(name)}`);
  },

  create: (
    user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<User> => {
    const now = new Date().toISOString();
    const data = {
      ...user,
      createdAt: now,
      updatedAt: now,
    };
    return apiService.post<User>('/users', data);
  },

  update: (id: string, user: Partial<User>): Promise<User> => {
    const now = new Date().toISOString();
    const userWithUpdatedTimestamp = {
      ...user,
      updatedAt: now,
    };
    return apiService.patch<User>(`/users/${id}`, userWithUpdatedTimestamp);
  },

  delete: (id: string): Promise<void> => {
    return apiService.delete<void>(`/users/${id}`);
  },
};
