import { AssetIcon } from "@/shared/components/AssetIcon/AssetIcon";
import { formatAmount } from "@/shared/utils/formatAmount";
import type { WalletHolding } from "../../infrastructure/entities/WalletHolding.entity";
import "./HoldingList.css";

interface HoldingListProps {
  holdings: readonly WalletHolding[];
}

export function HoldingList({ holdings }: HoldingListProps) {
  return (
    <section className="holding-list" aria-labelledby="holding-list-title">
      <div className="holding-list__heading">
        <h3 id="holding-list-title" className="holding-list__title">
          Your coins
        </h3>
        <div className="holding-list__columns" aria-hidden="true">
          <span>Coin</span>
          <span>Amount</span>
        </div>
      </div>

      <ul className="holding-list__items">
        {holdings.map((holding) => (
          <li key={holding.symbol} className="holding-list__item">
            <AssetIcon url={holding.iconUrl} label={holding.symbol} size={40} />
            <div className="holding-list__coin">
              <span className="holding-list__symbol">{holding.symbol}</span>
              <span className="holding-list__caption">You own</span>
            </div>
            <div className="holding-list__amount">
              <span className="holding-list__value">
                {formatAmount(holding.amount)}
              </span>
              <span className="holding-list__unit">{holding.symbol}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
