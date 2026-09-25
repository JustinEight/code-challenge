import type { RouteObject } from "react-router";
import { TOKENS_PATH } from "./tokens.paths";
import { TokensPage } from "../pages/TokensPage";

export const tokensRoutes: RouteObject[] = [
  { path: TOKENS_PATH, element: <TokensPage /> },
];
