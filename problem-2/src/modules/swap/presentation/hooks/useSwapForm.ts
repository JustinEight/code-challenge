import { useState } from "react";
import {
  parseDecimalInput,
  sanitizeDecimalInput,
  toDecimalInput,
} from "@/shared/utils/decimalInput";
import type { SwapAsset } from "../../infrastructure/entities/SwapAsset.entity";
import type { SwapResult } from "../../use-cases/ExecuteSwapUseCase";
import { convertAmount, toUsdValue } from "../../use-cases/swapMath";
import { resolveSendAmount, validateSwap } from "../../use-cases/validateSwap";
import { executeSwap } from "./swapUseCases";

type Side = "from" | "to";

type SubmitStatus =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; result: SwapResult }
  | { kind: "error"; message: string };

const PREFERRED_TO = ["ETH", "WBTC", "USD"];
const SIMULATED_DELAY_MS = 800;

const canSend = (asset?: SwapAsset) =>
  !!asset && asset.balance > 0 && asset.usdPrice !== undefined;

function pickDefaultFrom(assets: readonly SwapAsset[]) {
  return [...assets]
    .filter(canSend)
    .sort(
      (a, b) => b.balance * (b.usdPrice ?? 0) - a.balance * (a.usdPrice ?? 0),
    )[0]?.symbol;
}

function pickDefaultTo(assets: readonly SwapAsset[], fromSymbol?: string) {
  const priced = assets.filter(
    (asset) => asset.usdPrice !== undefined && asset.symbol !== fromSymbol,
  );
  return (
    PREFERRED_TO.map((symbol) =>
      priced.find((asset) => asset.symbol === symbol),
    ).find(Boolean) ?? priced[0]
  )?.symbol;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function useSwapForm(
  assets: readonly SwapAsset[],
  onSwapped: () => Promise<void>,
) {
  const [fromSymbol, setFromSymbol] = useState(() => pickDefaultFrom(assets));
  const [toSymbol, setToSymbol] = useState(() =>
    pickDefaultTo(assets, pickDefaultFrom(assets)),
  );
  const [entry, setEntry] = useState<{ side: Side; text: string }>({
    side: "from",
    text: "",
  });
  const [status, setStatus] = useState<SubmitStatus>({ kind: "idle" });

  const from = assets.find((asset) => asset.symbol === fromSymbol);
  const to = assets.find((asset) => asset.symbol === toSymbol);
  const fromPrice = from?.usdPrice;
  const toPrice = to?.usdPrice;
  const priced = fromPrice !== undefined && toPrice !== undefined;

  const typed = parseDecimalInput(entry.text);
  let fromAmount: number | null = null;
  let toAmount: number | null = null;
  if (entry.side === "from") {
    fromAmount = typed;
    if (typed !== null && priced)
      toAmount = convertAmount(typed, fromPrice, toPrice);
  } else {
    toAmount = typed;
    if (typed !== null && priced)
      fromAmount = convertAmount(typed, toPrice, fromPrice);
  }

  if (from && fromAmount !== null) {
    const resolved = resolveSendAmount(fromAmount, from.balance);
    if (resolved !== fromAmount) {
      fromAmount = resolved;
      if (entry.side === "from" && priced)
        toAmount = convertAmount(resolved, fromPrice, toPrice);
    }
  }

  const issue = validateSwap({
    from,
    to,
    amount: fromAmount,
    hasAmountInput: entry.text !== "",
  });

  const resetStatus = () => {
    if (status.kind !== "submitting") setStatus({ kind: "idle" });
  };

  const setAmount = (side: Side, raw: string) => {
    setEntry({ side, text: sanitizeDecimalInput(raw) });
    resetStatus();
  };

  const selectFrom = (symbol: string) => {
    if (symbol === toSymbol) setToSymbol(fromSymbol);
    setFromSymbol(symbol);
    resetStatus();
  };

  const selectTo = (symbol: string) => {
    if (symbol === fromSymbol && canSend(to)) setFromSymbol(toSymbol);
    setToSymbol(symbol);
    resetStatus();
  };

  const canFlip = canSend(to);

  const flip = () => {
    if (!canFlip) return;
    setFromSymbol(toSymbol);
    setToSymbol(fromSymbol);
    setEntry((current) => ({
      side: current.side === "from" ? "to" : "from",
      text: current.text,
    }));
    resetStatus();
  };

  const setMax = () => {
    if (from) setAmount("from", toDecimalInput(from.balance));
  };

  const submit = async () => {
    if (
      issue ||
      !from ||
      !to ||
      fromAmount === null ||
      status.kind === "submitting"
    )
      return;

    setStatus({ kind: "submitting" });
    try {
      const [result] = await Promise.all([
        executeSwap.execute({
          fromSymbol: from.symbol,
          toSymbol: to.symbol,
          amount: fromAmount,
        }),
        wait(SIMULATED_DELAY_MS),
      ]);
      setEntry({ side: "from", text: "" });
      await onSwapped();
      setStatus({ kind: "success", result });
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "Swap failed",
      });
    }
  };

  return {
    from,
    to,
    fromText:
      entry.side === "from" ? entry.text : toDecimalInput(fromAmount ?? 0),
    toText: entry.side === "to" ? entry.text : toDecimalInput(toAmount ?? 0),
    fromUsd:
      fromPrice !== undefined && fromAmount !== null
        ? toUsdValue(fromAmount, fromPrice)
        : null,
    toUsd:
      toPrice !== undefined && toAmount !== null
        ? toUsdValue(toAmount, toPrice)
        : null,
    rate: priced ? convertAmount(1, fromPrice, toPrice) : null,
    issue,
    status,
    canFlip,
    setFromAmount: (raw: string) => setAmount("from", raw),
    setToAmount: (raw: string) => setAmount("to", raw),
    selectFrom,
    selectTo,
    flip,
    setMax,
    submit,
  };
}
