import { formatAmount } from "@/shared/utils/formatAmount";
import type { SwapAsset } from "../infrastructure/entities/SwapAsset.entity";

export type SwapField = "from" | "to" | "amount";

export interface SwapIssue {
  field: SwapField;
  kind: "incomplete" | "invalid";
  label: string;
  message: string;
}

export interface SwapDraft {
  from?: SwapAsset;
  to?: SwapAsset;
  amount: number | null;
  hasAmountInput: boolean;
}

const RELATIVE_TOLERANCE = 1e-12;

export function exceedsBalance(amount: number, balance: number): boolean {
  return amount - balance > balance * RELATIVE_TOLERANCE;
}

export function resolveSendAmount(amount: number, balance: number): number {
  if (balance <= 0 || amount <= 0) return amount;
  return formatAmount(amount) === formatAmount(balance) ? balance : amount;
}

export function validateSwap({
  from,
  to,
  amount,
  hasAmountInput,
}: SwapDraft): SwapIssue | null {
  if (!from) {
    return {
      field: "from",
      kind: "incomplete",
      label: "Choose a coin to send",
      message: "Choose a coin you own to send",
    };
  }
  if (from.balance <= 0) {
    return {
      field: "from",
      kind: "invalid",
      label: `No ${from.symbol} to send`,
      message: `You do not own any ${from.symbol}`,
    };
  }
  if (from.usdPrice === undefined) {
    return {
      field: "from",
      kind: "invalid",
      label: `No price for ${from.symbol}`,
      message: `${from.symbol} has no price yet, so it can't be swapped`,
    };
  }

  if (!to)
    return {
      field: "to",
      kind: "incomplete",
      label: "Choose a coin to receive",
      message: "Choose a coin to receive",
    };
  if (to.symbol === from.symbol) {
    return {
      field: "to",
      kind: "invalid",
      label: "Choose two different coins",
      message: "Choose a different coin to receive",
    };
  }
  if (to.usdPrice === undefined) {
    return {
      field: "to",
      kind: "invalid",
      label: `No price for ${to.symbol}`,
      message: `${to.symbol} has no price yet, so you can't swap into it`,
    };
  }

  if (!hasAmountInput || amount === 0) {
    return {
      field: "amount",
      kind: "incomplete",
      label: "Enter an amount",
      message: "Enter an amount",
    };
  }
  if (amount === null)
    return {
      field: "amount",
      kind: "invalid",
      label: "Invalid amount",
      message: "Enter a valid number",
    };
  if (exceedsBalance(resolveSendAmount(amount, from.balance), from.balance)) {
    return {
      field: "amount",
      kind: "invalid",
      label: `Not enough ${from.symbol}`,
      message: `You only have ${formatAmount(from.balance)} ${from.symbol}`,
    };
  }

  return null;
}
