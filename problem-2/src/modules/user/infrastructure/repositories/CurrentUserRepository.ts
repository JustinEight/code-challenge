import type { User } from "../entities/User.entity";
import { UserMapper } from "../mappers/User.mapper";
import { CurrentUserStorageService } from "../services/CurrentUserStorageService";
import type { CurrentUserRepositoryOptions } from "./CurrentUserRepository.types";
import type { ICurrentUserRepository } from "./ICurrentUserRepository";

const GUEST_USER: User = { id: "guest", name: "user" };

export class CurrentUserRepository implements ICurrentUserRepository {
  private readonly service: CurrentUserStorageService;
  private readonly defaultUser: User;

  constructor({
    service = new CurrentUserStorageService(),
    defaultUser = GUEST_USER,
  }: CurrentUserRepositoryOptions = {}) {
    this.service = service;
    this.defaultUser = defaultUser;
  }

  async get(): Promise<User> {
    const dto = await this.service.read();
    if (dto) return UserMapper.toEntity(dto);

    await this.service.write(UserMapper.toDto(this.defaultUser));
    return { ...this.defaultUser };
  }
}
