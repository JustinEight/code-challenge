import { NavLink, useLocation } from "react-router";
import "./NavTabs.css";

export interface NavTabItem {
  to: string;
  label: string;
  keepSearch?: boolean;
}

interface NavTabsProps {
  items: readonly NavTabItem[];
}

export function NavTabs({ items }: NavTabsProps) {
  const { search } = useLocation();

  return (
    <nav className="nav-tabs">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={{ pathname: item.to, search: item.keepSearch ? search : "" }}
          className={({ isActive }) =>
            isActive ? "nav-tabs__tab nav-tabs__tab--active" : "nav-tabs__tab"
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
