import type { FormEvent } from "react";
import { Link } from "react-router";
import { WALLET_PATH } from "@/modules/wallet/presentation/routes/wallet.paths";
import type { AssetSelectOption } from "@/shared/components/AssetSelect/AssetSelect";
import { Spinner } from "@/shared/components/Spinner/Spinner";
import { formatAmount } from "@/shared/utils/formatAmount";
import { formatUsd } from "@/shared/utils/formatUsd";
import type { SwapAsset } from "../../infrastructure/entities/SwapAsset.entity";
import { useSwapForm } from "../hooks/useSwapForm";
import { SwapField } from "./SwapField";
import { SwapIcon } from "./SwapIcon";
import "./SwapForm.css";

interface SwapFormProps {
  assets: readonly SwapAsset[];
  pricesUpdatedAt: Date | null;
  onSwapped: () => Promise<void>;
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  dateStyle: "medium",
  timeStyle: "short",
});

function toFromOption(asset: SwapAsset): AssetSelectOption {
  const priced = asset.usdPrice !== undefined;
  const owned = asset.balance > 0;
  return {
    value: asset.symbol,
    label: asset.symbol,
    iconUrl: asset.iconUrl,
    detail: formatAmount(asset.balance),
    note: !owned
      ? "You do not own any"
      : priced
        ? formatUsd(asset.usdPrice!)
        : "No price, can't swap",
    disabled: !priced || !owned,
  };
}

function toToOption(asset: SwapAsset): AssetSelectOption {
  const priced = asset.usdPrice !== undefined;
  return {
    value: asset.symbol,
    label: asset.symbol,
    iconUrl: asset.iconUrl,
    detail: priced ? formatUsd(asset.usdPrice!) : undefined,
    note: !priced
      ? "No price available"
      : asset.balance > 0
        ? `You own ${formatAmount(asset.balance)}`
        : undefined,
    disabled: !priced,
  };
}

export function SwapForm({
  assets,
  pricesUpdatedAt,
  onSwapped,
}: SwapFormProps) {
  const form = useSwapForm(assets, onSwapped);
  const { from, to, issue, status } = form;
  const submitting = status.kind === "submitting";

  const fromOptions = assets
    .filter((asset) => asset.balance > 0 || asset.symbol === from?.symbol)
    .map(toFromOption);
  const toOptions = assets.map(toToOption);

  const invalid = issue?.kind === "invalid" ? issue : null;
  const sendError =
    invalid && (invalid.field === "from" || invalid.field === "amount")
      ? invalid.message
      : undefined;
  const receiveError = invalid?.field === "to" ? invalid.message : undefined;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void form.submit();
  };

  return (
    <form className="swap-form" onSubmit={handleSubmit} noValidate>
      <header className="swap-form__header">
        <h2 className="swap-form__title">Swap</h2>
        <p className="swap-form__subtitle">
          Trade a coin you own for another one at the latest USD prices.
        </p>
      </header>

      <div className="swap-form__fields">
        <SwapField
          id="input-amount"
          label="Amount to send"
          amount={form.fromText}
          onAmountChange={form.setFromAmount}
          selectLabel="Coin to send"
          options={fromOptions}
          selected={from?.symbol}
          onSelect={form.selectFrom}
          error={sendError}
          amountInvalid={invalid?.field === "amount"}
          selectInvalid={invalid?.field === "from"}
          disabled={submitting}
          footer={
            <>
              <span>
                Balance:{" "}
                {from ? `${formatAmount(from.balance)} ${from.symbol}` : "—"}
                {from && from.balance > 0 && (
                  <button
                    type="button"
                    className="swap-form__max"
                    onClick={form.setMax}
                    disabled={submitting}
                  >
                    Max
                  </button>
                )}
              </span>
              {form.fromUsd !== null && (
                <span>≈ {formatUsd(form.fromUsd)}</span>
              )}
            </>
          }
        />

        <button
          type="button"
          className="swap-form__flip"
          onClick={form.flip}
          disabled={!form.canFlip || submitting}
          aria-label="Switch the coins you send and receive"
          title={
            form.canFlip
              ? "Switch coins"
              : `You do not own any ${to?.symbol ?? "of this coin"} to send`
          }
        >
          <SwapIcon />
        </button>

        <SwapField
          id="output-amount"
          label="Amount to receive"
          amount={form.toText}
          onAmountChange={form.setToAmount}
          selectLabel="Coin to receive"
          options={toOptions}
          selected={to?.symbol}
          onSelect={form.selectTo}
          error={receiveError}
          selectInvalid={invalid?.field === "to"}
          disabled={submitting}
          footer={
            <>
              <span>
                Balance: {to ? `${formatAmount(to.balance)} ${to.symbol}` : "—"}
              </span>
              {form.toUsd !== null && <span>≈ {formatUsd(form.toUsd)}</span>}
            </>
          }
        />
      </div>

      {form.rate !== null && from && to && (
        <dl className="swap-form__details">
          <div>
            <dt>Rate</dt>
            <dd>
              1 {from.symbol} ≈ {formatAmount(form.rate)} {to.symbol}
            </dd>
          </div>
          <div>
            <dt>Prices</dt>
            <dd>
              {formatUsd(from.usdPrice!)} / {formatUsd(to.usdPrice!)}
            </dd>
          </div>
          {pricesUpdatedAt && (
            <div>
              <dt>Updated</dt>
              <dd>{dateFormatter.format(pricesUpdatedAt)}</dd>
            </div>
          )}
        </dl>
      )}

      {status.kind === "error" && (
        <p className="swap-form__alert swap-form__alert--error" role="alert">
          {status.message}
        </p>
      )}

      {status.kind === "success" && (
        <p className="swap-form__alert swap-form__alert--success" role="status">
          Swapped {formatAmount(status.result.fromAmount)}{" "}
          {status.result.fromSymbol} for {formatAmount(status.result.toAmount)}{" "}
          {status.result.toSymbol}. <Link to={WALLET_PATH}>View My wallet</Link>
        </p>
      )}

      <button
        type="submit"
        className="swap-form__submit"
        disabled={!!issue || submitting}
      >
        {submitting ? (
          <>
            <Spinner size={16} />
            Swapping…
          </>
        ) : issue ? (
          issue.label
        ) : (
          "CONFIRM SWAP"
        )}
      </button>
    </form>
  );
}
