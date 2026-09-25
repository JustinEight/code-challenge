import { TokenRepository } from "@/modules/tokens/infrastructure/repositories/TokenRepository";
import { WalletRepository } from "@/modules/wallet/infrastructure/repositories/WalletRepository";
import { PriceRepository } from "../../infrastructure/repositories/PriceRepository";
import { ExecuteSwapUseCase } from "../../use-cases/ExecuteSwapUseCase";
import { GetSwapAssetsUseCase } from "../../use-cases/GetSwapAssetsUseCase";

const walletRepository = new WalletRepository();
const priceRepository = new PriceRepository();

export const getSwapAssets = new GetSwapAssetsUseCase(
  walletRepository,
  priceRepository,
  new TokenRepository(),
);
export const executeSwap = new ExecuteSwapUseCase(
  walletRepository,
  priceRepository,
);
