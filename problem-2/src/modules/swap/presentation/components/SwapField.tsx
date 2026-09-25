import type { ReactNode } from "react";
import {
  AssetSelect,
  type AssetSelectOption,
} from "@/shared/components/AssetSelect/AssetSelect";
import "./SwapField.css";

interface SwapFieldProps {
  id: string;
  label: string;
  amount: string;
  onAmountChange: (value: string) => void;
  selectLabel: string;
  options: readonly AssetSelectOption[];
  selected?: string;
  onSelect: (value: string) => void;
  footer: ReactNode;
  error?: string;
  amountInvalid?: boolean;
  selectInvalid?: boolean;
  disabled?: boolean;
}

export function SwapField({
  id,
  label,
  amount,
  onAmountChange,
  selectLabel,
  options,
  selected,
  onSelect,
  footer,
  error,
  amountInvalid = false,
  selectInvalid = false,
  disabled = false,
}: SwapFieldProps) {
  const errorId = `${id}-error`;
  const lengthClass =
    amount.length > 18
      ? " swap-field__input--xlong"
      : amount.length > 12
        ? " swap-field__input--long"
        : "";

  return (
    <div className={`swap-field${error ? " swap-field--invalid" : ""}`}>
      <label htmlFor={id} className="swap-field__label">
        {label}
      </label>

      <div className="swap-field__main">
        <input
          id={id}
          className={`swap-field__input${lengthClass}`}
          inputMode="decimal"
          autoComplete="off"
          placeholder="0"
          value={amount}
          onChange={(event) => onAmountChange(event.target.value)}
          aria-invalid={amountInvalid}
          aria-describedby={error ? errorId : undefined}
          disabled={disabled}
        />
        <AssetSelect
          label={selectLabel}
          options={options}
          value={selected}
          onChange={onSelect}
          invalid={selectInvalid}
          disabled={disabled}
        />
      </div>

      <div className="swap-field__footer">{footer}</div>

      {error && (
        <p id={errorId} className="swap-field__error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
