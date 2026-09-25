import { AssetIcon } from "@/shared/components/AssetIcon/AssetIcon";
import { formatAmount } from "@/shared/utils/formatAmount";
import type { WalletHolding } from "../../infrastructure/entities/WalletHolding.entity";
import "./WalletSummary.css";

interface WalletSummaryProps {
  holdings: readonly WalletHolding[];
}

export function WalletSummary({ holdings }: WalletSummaryProps) {
  const largest = holdings[0];

  return (
    <div className="wallet-summary">
      <div className="wallet-summary__card">
        <span className="wallet-summary__label">Coins owned</span>
        <span className="wallet-summary__value">{holdings.length}</span>
        <span className="wallet-summary__hint">
          {holdings.length === 1
            ? "Different coin in your wallet"
            : "Different coins in your wallet"}
        </span>
      </div>

      <div className="wallet-summary__card">
        <span className="wallet-summary__label">Largest holding</span>
        <span className="wallet-summary__value wallet-summary__value--holding">
          <AssetIcon url={largest.iconUrl} label={largest.symbol} size={28} />
          <span>
            {formatAmount(largest.amount)}{" "}
            <span className="wallet-summary__unit">{largest.symbol}</span>
          </span>
        </span>
        <span className="wallet-summary__hint">
          The coin you have the most of
        </span>
      </div>
    </div>
  );
}
