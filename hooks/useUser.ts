import { useState, useEffect } from 'react';
import { userStorageService } from '@/services/storage';
import { User } from '@/types';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await userStorageService.getUser();
      setUser(userData);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUser = async (
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>,
  ) => {
    try {
      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const success = await userStorageService.setUser(newUser);
      if (success) {
        setUser(newUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error saving user:', error);
      return false;
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) return false;

    try {
      const updatedUser: User = {
        ...user,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      const success = await userStorageService.setUser(updatedUser);
      if (success) {
        setUser(updatedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating user:', error);
      return false;
    }
  };

  const clearUser = async () => {
    try {
      const success = await userStorageService.removeUser();
      if (success) {
        setUser(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error clearing user:', error);
      return false;
    }
  };

  return {
    user,
    isLoading,
    saveUser,
    updateUser,
    clearUser,
    refetch: loadUser,
  };
};
