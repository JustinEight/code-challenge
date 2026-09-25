import type { RouteObject } from "react-router";
import { WALLET_PATH } from "./wallet.paths";
import { WalletPage } from "../pages/WalletPage";

export const walletRoutes: RouteObject[] = [
  { path: WALLET_PATH, element: <WalletPage /> },
];
