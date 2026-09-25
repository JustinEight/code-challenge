import { createBrowserRouter, Navigate } from "react-router";
import { RootLayout } from "@/layouts/RootLayout/RootLayout";
import { blockchainsRoutes } from "@/modules/blockchains/presentation/routes/blockchains.routes";
import { SWAP_PATH } from "@/modules/swap/presentation/routes/swap.paths";
import { swapRoutes } from "@/modules/swap/presentation/routes/swap.routes";
import { tokensRoutes } from "@/modules/tokens/presentation/routes/tokens.routes";
import { walletRoutes } from "@/modules/wallet/presentation/routes/wallet.routes";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Navigate to={SWAP_PATH} replace /> },
      ...swapRoutes,
      ...tokensRoutes,
      ...blockchainsRoutes,
      ...walletRoutes,
      { path: "*", element: <Navigate to={SWAP_PATH} replace /> },
    ],
  },
]);
