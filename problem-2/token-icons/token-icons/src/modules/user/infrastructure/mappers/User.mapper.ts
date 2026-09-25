import type { UserDto } from "../dtos/User.dto";
import type { User } from "../entities/User.entity";

export const UserMapper = {
  toEntity({ id, name }: UserDto): User {
    return { id, name };
  },

  toDto({ id, name }: User): UserDto {
    return { id, name };
  },
};
