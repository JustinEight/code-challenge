import { useAsync } from "@/shared/hooks/useAsync";
import { CurrentUserRepository } from "../../infrastructure/repositories/CurrentUserRepository";
import { GetCurrentUserUseCase } from "../../use-cases/GetCurrentUserUseCase";

const getCurrentUser = new GetCurrentUserUseCase(new CurrentUserRepository());

export function useCurrentUser() {
  return useAsync(() => getCurrentUser.execute(), []);
}
