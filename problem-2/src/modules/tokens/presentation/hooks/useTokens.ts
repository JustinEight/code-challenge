import { useMemo } from "react";
import { useAsync } from "@/shared/hooks/useAsync";
import { matchesQuery } from "@/shared/utils/matchesQuery";
import { TokenRepository } from "../../infrastructure/repositories/TokenRepository";
import { GetTokensUseCase } from "../../use-cases/GetTokensUseCase";

const getTokens = new GetTokensUseCase(new TokenRepository());

export function useTokens(query: string) {
  const state = useAsync(() => getTokens.execute(), []);

  const tokens = useMemo(
    () =>
      state.status === "success"
        ? state.data.filter((token) => matchesQuery(token.symbol, query))
        : [],
    [state, query],
  );

  return { state, tokens };
}
