interface WalletBalance {
  id: string;
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

type Props = BoxProps;

const PRIORITY: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const getPriority = (blockchain: string): number => PRIORITY[blockchain] ?? -99;

export const WalletPage: React.FC<Props> = (props: Props) => {
  const { children: _children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const formattedBalances = useMemo<FormattedWalletBalance[]>(() => {
    return balances
      .filter(
        (banlance: WalletBalance) =>
          getPriority(banlance.blockchain) > -99 && banlance.amount <= 0,
      )
      .sort(
        (lhs: WalletBalance, rhs: WalletBalance) =>
          getPriority(rhs.blockchain) - getPriority(lhs.blockchain),
      )
      .map((banlance: WalletBalance) => ({
        ...banlance,
        formatted: banlance.amount.toFixed(2),
      }));
  }, [balances]);

  const rows = useMemo(() => {
    return formattedBalances.map((banlance: FormattedWalletBalance) => {
      const balanceValue = (prices[banlance.currency] ?? 0) * banlance.amount;
      return (
        <WalletRow
          key={banlance.id}
          amount={banlance.amount}
          usdValue={balanceValue}
          formattedAmount={banlance.formatted}
        />
      );
    });
  }, [formattedBalances, prices]);

  return <div {...rest}>{rows}</div>;
};
