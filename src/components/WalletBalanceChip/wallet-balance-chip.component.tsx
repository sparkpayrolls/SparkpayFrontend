export const WalletBalanceChip = (props: {
  title: string;
  balance: string;
}) => {
  return (
    <span className="wallet-balance-chip">
      <span className="wallet-balance-chip__title">{props.title}</span>

      <span className="wallet-balance-chip__balance">
        (wallet balance{' '}
        <span className="wallet-balance-chip__balance__amount">
          {props.balance}
        </span>
        )
      </span>
    </span>
  );
};
