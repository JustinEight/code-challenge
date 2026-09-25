import type { User } from "../entities/User.entity";
import type { CurrentUserStorageService } from "../services/CurrentUserStorageService";

export interface CurrentUserRepositoryOptions {
  service?: CurrentUserStorageService;
  defaultUser?: User;
}
