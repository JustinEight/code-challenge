import { useCallback, useState } from "react";
import { useAsync } from "@/shared/hooks/useAsync";
import type { SwapAssets } from "../../use-cases/GetSwapAssetsUseCase";
import { getSwapAssets } from "./swapUseCases";

export function useSwapAssets() {
  const [attempt, setAttempt] = useState(0);
  const [refreshed, setRefreshed] = useState<SwapAssets | null>(null);
  const state = useAsync(() => getSwapAssets.execute(), [attempt]);

  const retry = useCallback(() => {
    setRefreshed(null);
    setAttempt((count) => count + 1);
  }, []);

  const refresh = useCallback(async () => {
    try {
      setRefreshed(await getSwapAssets.execute());
    } catch {
      retry();
    }
  }, [retry]);

  const data = refreshed ?? (state.status === "success" ? state.data : null);

  return { state, data, retry, refresh };
}
