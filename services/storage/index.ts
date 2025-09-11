import AsyncStorageService from "./AsyncStorageService";
import UserStorageService from "./user/UserStorageService";

const storageService = AsyncStorageService.getInstance();
const userStorageService = UserStorageService.getInstance();

export { storageService, userStorageService };
