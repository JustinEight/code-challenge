import { IconGrid } from "@/shared/components/IconGrid/IconGrid";
import { ImagePreloadGate } from "@/shared/components/ImagePreloadGate/ImagePreloadGate";
import { LoadingIndicator } from "@/shared/components/LoadingIndicator/LoadingIndicator";
import { StatusMessage } from "@/shared/components/StatusMessage/StatusMessage";
import { useTokens } from "../hooks/useTokens";

interface TokensPanelProps {
  query: string;
}

export function TokensPanel({ query }: TokensPanelProps) {
  const { state, tokens } = useTokens(query);

  if (state.status === "loading")
    return <LoadingIndicator label="Loading tokens…" />;
  if (state.status === "error")
    return (
      <StatusMessage tone="error">
        Failed to load tokens: {state.error.message}
      </StatusMessage>
    );

  return (
    <ImagePreloadGate
      loadingLabel="Loading tokens…"
      urls={state.data.map((token) => token.url)}
    >
      {tokens.length === 0 ? (
        <StatusMessage>No tokens match “{query}”.</StatusMessage>
      ) : (
        <IconGrid
          hoverEffect="grow-spin"
          virtualized
          items={tokens.map((token) => ({
            id: token.fileName,
            label: token.symbol,
            title: token.fileName,
            url: token.url,
          }))}
        />
      )}
    </ImagePreloadGate>
  );
}
