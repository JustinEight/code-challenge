import { useSearchQuery } from "@/shared/hooks/useSearchQuery";
import { TokensPanel } from "../components/TokensPanel";

export function TokensPage() {
  const [query] = useSearchQuery();
  return <TokensPanel query={query} />;
}
