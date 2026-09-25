import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AssetIcon } from "@/shared/components/AssetIcon/AssetIcon";
import { useDismiss } from "@/shared/hooks/useDismiss";
import { matchesQuery } from "@/shared/utils/matchesQuery";
import "./AssetSelect.css";

export interface AssetSelectOption {
  value: string;
  label: string;
  iconUrl?: string;
  detail?: string;
  disabled?: boolean;
  note?: string;
}

interface AssetSelectProps {
  label: string;
  options: readonly AssetSelectOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
}

export function AssetSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Select coin",
  invalid = false,
  disabled = false,
}: AssetSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const close = useCallback(() => setOpen(false), []);
  const ref = useDismiss<HTMLDivElement>(open, close);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const selected = options.find((option) => option.value === value);
  const visible = options.filter((option) =>
    matchesQuery(option.label, search),
  );

  useEffect(() => {
    if (open) {
      setSearch("");
      searchRef.current?.focus();
    }
  }, [open]);

  const choose = (option: AssetSelectOption) => {
    if (option.disabled) return;
    onChange(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div className="asset-select" ref={ref}>
      <button
        ref={triggerRef}
        type="button"
        className={`asset-select__trigger${invalid ? " asset-select__trigger--invalid" : ""}`}
        aria-label={selected ? `${label}: ${selected.label}` : label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
      >
        {selected ? (
          <>
            <AssetIcon
              url={selected.iconUrl}
              label={selected.label}
              size={24}
            />
            <span className="asset-select__value">{selected.label}</span>
          </>
        ) : (
          <>
            <span
              className="asset-select__placeholder-icon"
              aria-hidden="true"
            />
            <span className="asset-select__placeholder">{placeholder}</span>
          </>
        )}
        <svg
          className="asset-select__caret"
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
        <div className="asset-select__panel">
          <input
            ref={searchRef}
            className="asset-select__search"
            type="search"
            placeholder="Search coin…"
            aria-label={`Search ${label.toLowerCase()}`}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <ul
            id={listId}
            className="asset-select__list"
            role="listbox"
            aria-label={label}
          >
            {visible.map((option) => (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={option.value === value}
                  aria-disabled={option.disabled}
                  className={`asset-select__option${option.value === value ? " asset-select__option--selected" : ""}`}
                  onClick={() => choose(option)}
                >
                  <AssetIcon
                    url={option.iconUrl}
                    label={option.label}
                    size={28}
                  />
                  <span className="asset-select__option-text">
                    <span className="asset-select__option-label">
                      {option.label}
                    </span>
                    {option.note && (
                      <span className="asset-select__option-note">
                        {option.note}
                      </span>
                    )}
                  </span>
                  {option.detail && (
                    <span className="asset-select__option-detail">
                      {option.detail}
                    </span>
                  )}
                </button>
              </li>
            ))}
            {visible.length === 0 && (
              <li className="asset-select__empty">
                No coins match “{search}”.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
