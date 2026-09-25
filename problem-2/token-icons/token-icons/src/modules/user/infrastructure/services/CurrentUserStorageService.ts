import { readJson, writeJson } from "@/shared/utils/jsonStorage";
import type { UserDto } from "../dtos/User.dto";
import type { CurrentUserStorageServiceOptions } from "./CurrentUserStorageService.types";

const DEFAULT_STORAGE_KEY = "user";

function isUserDto(value: unknown): value is UserDto {
  if (typeof value !== "object" || value === null) return false;
  const { id, name } = value as Partial<UserDto>;
  return (
    typeof id === "string" && typeof name === "string" && name.trim() !== ""
  );
}

export class CurrentUserStorageService {
  private readonly storageKey: string;

  constructor({
    storageKey = DEFAULT_STORAGE_KEY,
  }: CurrentUserStorageServiceOptions = {}) {
    this.storageKey = storageKey;
  }

  async read(): Promise<UserDto | null> {
    return readJson(this.storageKey, isUserDto);
  }

  async write(dto: UserDto): Promise<void> {
    writeJson(this.storageKey, dto);
  }
}
