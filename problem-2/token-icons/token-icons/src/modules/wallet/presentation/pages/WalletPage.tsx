import { Link } from "react-router";
import { SwapIcon } from "@/modules/swap/presentation/components/SwapIcon";
import { SWAP_PATH } from "@/modules/swap/presentation/routes/swap.paths";
import { WalletIcon } from "../components/WalletIcon";
import { WalletPanel } from "../components/WalletPanel";
import "./WalletPage.css";

export function WalletPage() {
  return (
    <section className="wallet-page" aria-labelledby="wallet-page-title">
      <header className="wallet-page__header">
        <span className="wallet-page__badge">
          <WalletIcon size={22} />
        </span>
        <div className="wallet-page__heading">
          <h2 id="wallet-page-title" className="wallet-page__title">
            My wallet
          </h2>
          <p className="wallet-page__subtitle">
            All the coins you own and how much of each.
          </p>
        </div>
        <Link to={SWAP_PATH} className="wallet-page__action">
          <SwapIcon size={16} />
          Swap coins
        </Link>
      </header>
      <WalletPanel />
    </section>
  );
}
