import { useMemo } from "react";
import { useAsync } from "@/shared/hooks/useAsync";
import { matchesQuery } from "@/shared/utils/matchesQuery";
import { BlockchainRepository } from "../../infrastructure/repositories/BlockchainRepository";
import { GetBlockchainsUseCase } from "../../use-cases/GetBlockchainsUseCase";

const getBlockchains = new GetBlockchainsUseCase(new BlockchainRepository());

export function useBlockchains(query: string) {
  const state = useAsync(() => getBlockchains.execute(), []);

  const blockchains = useMemo(
    () =>
      state.status === "success"
        ? state.data.filter((chain) => matchesQuery(chain.name, query))
        : [],
    [state, query],
  );

  return { state, blockchains };
}
