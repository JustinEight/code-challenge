import { TokenRepository } from "@/modules/tokens/infrastructure/repositories/TokenRepository";
import { useAsync } from "@/shared/hooks/useAsync";
import { WalletRepository } from "../../infrastructure/repositories/WalletRepository";
import { GetWalletHoldingsUseCase } from "../../use-cases/GetWalletHoldingsUseCase";

const getWalletHoldings = new GetWalletHoldingsUseCase(
  new WalletRepository(),
  new TokenRepository(),
);

export function useWallet() {
  return useAsync(() => getWalletHoldings.execute(), []);
}
