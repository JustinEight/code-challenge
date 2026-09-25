import { Link } from "react-router";
import { WALLET_PATH } from "@/modules/wallet/presentation/routes/wallet.paths";
import { ImagePreloadGate } from "@/shared/components/ImagePreloadGate/ImagePreloadGate";
import { LoadingIndicator } from "@/shared/components/LoadingIndicator/LoadingIndicator";
import { StatusMessage } from "@/shared/components/StatusMessage/StatusMessage";
import { SwapForm } from "../components/SwapForm";
import { useSwapAssets } from "../hooks/useSwapAssets";
import "./SwapPage.css";

export function SwapPage() {
  const { state, data, retry, refresh } = useSwapAssets();

  if (!data) {
    if (state.status === "error") {
      return (
        <div className="swap-page">
          <StatusMessage tone="error">
            Couldn't load prices: {state.error.message}
          </StatusMessage>
          <button type="button" className="swap-page__retry" onClick={retry}>
            Try again
          </button>
        </div>
      );
    }
    return <LoadingIndicator label="Loading prices…" />;
  }

  const canSwapSomething = data.assets.some(
    (asset) => asset.balance > 0 && asset.usdPrice !== undefined,
  );

  if (!canSwapSomething) {
    return (
      <div className="swap-page">
        <StatusMessage>
          You don't own any coins with a price, so there's nothing to swap yet.{" "}
          <Link to={WALLET_PATH}>Go to My wallet</Link>
        </StatusMessage>
      </div>
    );
  }

  const iconUrls = data.assets.flatMap((asset) =>
    asset.iconUrl ? [asset.iconUrl] : [],
  );

  return (
    <div className="swap-page">
      <ImagePreloadGate loadingLabel="Loading prices…" urls={iconUrls}>
        <SwapForm
          assets={data.assets}
          pricesUpdatedAt={data.pricesUpdatedAt}
          onSwapped={refresh}
        />
      </ImagePreloadGate>
    </div>
  );
}
