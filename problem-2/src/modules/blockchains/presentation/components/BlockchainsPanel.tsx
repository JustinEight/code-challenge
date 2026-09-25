import { IconGrid } from "@/shared/components/IconGrid/IconGrid";
import { ImagePreloadGate } from "@/shared/components/ImagePreloadGate/ImagePreloadGate";
import { LoadingIndicator } from "@/shared/components/LoadingIndicator/LoadingIndicator";
import { StatusMessage } from "@/shared/components/StatusMessage/StatusMessage";
import { useBlockchains } from "../hooks/useBlockchains";

interface BlockchainsPanelProps {
  query: string;
}

export function BlockchainsPanel({ query }: BlockchainsPanelProps) {
  const { state, blockchains } = useBlockchains(query);

  if (state.status === "loading")
    return <LoadingIndicator label="Loading blockchains…" />;
  if (state.status === "error")
    return (
      <StatusMessage tone="error">
        Failed to load blockchains: {state.error.message}
      </StatusMessage>
    );

  return (
    <ImagePreloadGate
      loadingLabel="Loading blockchains…"
      urls={state.data.map((chain) => chain.url)}
    >
      {blockchains.length === 0 ? (
        <StatusMessage>No blockchains match “{query}”.</StatusMessage>
      ) : (
        <IconGrid
          hoverEffect="grow"
          virtualized
          items={blockchains.map((chain) => ({
            id: chain.fileName,
            label: chain.name,
            title: chain.fileName,
            url: chain.url,
          }))}
        />
      )}
    </ImagePreloadGate>
  );
}
