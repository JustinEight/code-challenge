import { useCallback, useId, useState, type ReactNode } from "react";
import { NavLink } from "react-router";
import { useDismiss } from "@/shared/hooks/useDismiss";
import "./DropdownMenu.css";

export interface DropdownMenuItem {
  to: string;
  label: string;
  icon?: ReactNode;
}

interface DropdownMenuProps {
  trigger: ReactNode;
  triggerClassName?: string;
  label: string;
  items: readonly DropdownMenuItem[];
}

export function DropdownMenu({
  trigger,
  triggerClassName = "",
  label,
  items,
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const ref = useDismiss<HTMLDivElement>(open, close);
  const menuId = useId();

  return (
    <div className="dropdown-menu" ref={ref}>
      <button
        type="button"
        className={`dropdown-menu__trigger ${triggerClassName}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      >
        {trigger}
        <svg
          className="dropdown-menu__caret"
          viewBox="0 0 12 12"
          width="12"
          height="12"
          aria-hidden="true"
        >
          <path
            d="M3 4.5 6 7.5 9 4.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={label}
          className="dropdown-menu__panel"
        >
          {items.map((item) => (
            <NavLink
              key={item.to}
              role="menuitem"
              to={item.to}
              onClick={close}
              className={({ isActive }) =>
                isActive
                  ? "dropdown-menu__item dropdown-menu__item--active"
                  : "dropdown-menu__item"
              }
            >
              {item.icon && (
                <span className="dropdown-menu__icon" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              {item.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}
