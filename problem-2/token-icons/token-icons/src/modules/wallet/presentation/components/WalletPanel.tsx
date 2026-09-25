import { ImagePreloadGate } from "@/shared/components/ImagePreloadGate/ImagePreloadGate";
import { LoadingIndicator } from "@/shared/components/LoadingIndicator/LoadingIndicator";
import { StatusMessage } from "@/shared/components/StatusMessage/StatusMessage";
import { useWallet } from "../hooks/useWallet";
import { HoldingList } from "./HoldingList";
import { WalletSummary } from "./WalletSummary";

export function WalletPanel() {
  const state = useWallet();

  if (state.status === "loading")
    return <LoadingIndicator label="Loading wallet…" />;
  if (state.status === "error")
    return (
      <StatusMessage tone="error">
        Failed to load wallet: {state.error.message}
      </StatusMessage>
    );
  if (state.data.length === 0) {
    return (
      <StatusMessage>
        Your wallet is empty. Coins you get will show up here.
      </StatusMessage>
    );
  }

  const iconUrls = state.data.flatMap((holding) =>
    holding.iconUrl ? [holding.iconUrl] : [],
  );

  return (
    <ImagePreloadGate loadingLabel="Loading wallet…" urls={iconUrls}>
      <WalletSummary holdings={state.data} />
      <HoldingList holdings={state.data} />
    </ImagePreloadGate>
  );
}
