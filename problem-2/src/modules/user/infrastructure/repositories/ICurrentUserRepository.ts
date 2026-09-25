import type { User } from "../entities/User.entity";

export interface ICurrentUserRepository {
  get(): Promise<User>;
}
