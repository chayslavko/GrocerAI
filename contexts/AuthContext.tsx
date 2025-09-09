import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { userStorageService } from '@/services/storage';
import { userApi } from '@/services/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  console.log('AuthProvider', { user, isLoading });
  useEffect(() => {
    console.log('checkAuthState', { user });
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const storedUser = await userStorageService.getUser();

      if (storedUser) {
        try {
          const dbUser = await userApi.getById(storedUser.id);
          setUser(dbUser);
          await userStorageService.setUser(dbUser);
        } catch (error) {
          console.log('User not found in DB');
          await userStorageService.removeUser();
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth state:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: User) => {
    await userStorageService.setUser(userData);
    setUser(userData);
  };

  const logout = async () => {
    await userStorageService.removeUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
