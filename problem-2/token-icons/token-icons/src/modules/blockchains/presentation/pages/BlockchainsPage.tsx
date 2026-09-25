import { useSearchQuery } from "@/shared/hooks/useSearchQuery";
import { BlockchainsPanel } from "../components/BlockchainsPanel";

export function BlockchainsPage() {
  const [query] = useSearchQuery();
  return <BlockchainsPanel query={query} />;
}
