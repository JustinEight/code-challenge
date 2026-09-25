import type { RouteObject } from "react-router";
import { SWAP_PATH } from "./swap.paths";
import { SwapPage } from "../pages/SwapPage";

export const swapRoutes: RouteObject[] = [
  { path: SWAP_PATH, element: <SwapPage /> },
];
