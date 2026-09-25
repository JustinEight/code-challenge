import type { User } from "../infrastructure/entities/User.entity";
import type { ICurrentUserRepository } from "../infrastructure/repositories/ICurrentUserRepository";

export class GetCurrentUserUseCase {
  private readonly repository: ICurrentUserRepository;

  constructor(repository: ICurrentUserRepository) {
    this.repository = repository;
  }

  execute(): Promise<User> {
    return this.repository.get();
  }
}
