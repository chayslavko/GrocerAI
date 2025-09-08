import { StorageKeys, User } from '@/types';
import AsyncStorageService from '../AsyncStorageService';

export class UserStorageService {
  private static instance: UserStorageService;
  private storageService: AsyncStorageService;

  private constructor() {
    this.storageService = AsyncStorageService.getInstance();
  }

  public static getInstance(): UserStorageService {
    if (!UserStorageService.instance) {
      UserStorageService.instance = new UserStorageService();
    }
    return UserStorageService.instance;
  }

  // User-specific methods
  async getUser(): Promise<User | null> {
    return this.storageService.getItem<User>(StorageKeys.USER);
  }

  async setUser(user: User): Promise<boolean> {
    return this.storageService.setItem(StorageKeys.USER, user);
  }

  async removeUser(): Promise<boolean> {
    return this.storageService.removeItem(StorageKeys.USER);
  }
}

export default UserStorageService;
