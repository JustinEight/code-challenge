import type { RouteObject } from "react-router";
import { BLOCKCHAINS_PATH } from "./blockchains.paths";
import { BlockchainsPage } from "../pages/BlockchainsPage";

export const blockchainsRoutes: RouteObject[] = [
  { path: BLOCKCHAINS_PATH, element: <BlockchainsPage /> },
];
