import { matchPath, Outlet, useLocation } from "react-router";
import { BLOCKCHAINS_PATH } from "@/modules/blockchains/presentation/routes/blockchains.paths";
import { SWAP_PATH } from "@/modules/swap/presentation/routes/swap.paths";
import { TOKENS_PATH } from "@/modules/tokens/presentation/routes/tokens.paths";
import { UserGreeting } from "@/modules/user/presentation/components/UserGreeting";
import { WalletIcon } from "@/modules/wallet/presentation/components/WalletIcon";
import { WALLET_PATH } from "@/modules/wallet/presentation/routes/wallet.paths";
import type { DropdownMenuItem } from "@/shared/components/DropdownMenu/DropdownMenu";
import { NavTabs, type NavTabItem } from "@/shared/components/NavTabs/NavTabs";
import { SearchInput } from "@/shared/components/SearchInput/SearchInput";
import { ThemeSwitcher } from "@/shared/components/ThemeSwitcher/ThemeSwitcher";
import { useSearchQuery } from "@/shared/hooks/useSearchQuery";
import "./RootLayout.css";

const NAV_ITEMS: readonly NavTabItem[] = [
  { to: SWAP_PATH, label: "Swap" },
  { to: TOKENS_PATH, label: "Tokens", keepSearch: true },
  { to: BLOCKCHAINS_PATH, label: "Blockchains", keepSearch: true },
];

const USER_MENU_ITEMS: readonly DropdownMenuItem[] = [
  { to: WALLET_PATH, label: "My wallet", icon: <WalletIcon /> },
];

export function RootLayout() {
  const [query, setQuery] = useSearchQuery();
  const { pathname } = useLocation();
  const showSearch = NAV_ITEMS.some(
    (item) => item.keepSearch && matchPath(item.to, pathname),
  );

  return (
    <main className="root-layout">
      <header
        className={
          showSearch
            ? "root-layout__header"
            : "root-layout__header root-layout__header--no-search"
        }
      >
        <h1 className="root-layout__title">Token Icons</h1>
        <div className="root-layout__tabs">
          <NavTabs items={NAV_ITEMS} />
        </div>
        {showSearch && (
          <div className="root-layout__search">
            <SearchInput
              value={query}
              onChange={setQuery}
              placeholder="Search by name…"
            />
          </div>
        )}
        <div className="root-layout__theme">
          <ThemeSwitcher />
        </div>
        <div className="root-layout__user">
          <UserGreeting menuItems={USER_MENU_ITEMS} />
        </div>
      </header>

      <Outlet />
    </main>
  );
}
