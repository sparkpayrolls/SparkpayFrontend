import Skeleton from 'react-loading-skeleton';

import 'react-loading-skeleton/dist/skeleton.css';
import { Util } from 'src/helpers/util';

export const WalletBalanceChip = (props: {
  title: string;
  balance: number;
  currency: string;
  loading?: boolean;
}) => {
  return (
    <span className="wallet-balance-chip">
      <>
        <span className="wallet-balance-chip__title">{props.title}</span>

        {props.loading && <Skeleton width={200} borderRadius={4} count={1} />}

        {!props.loading && (
          <span className="wallet-balance-chip__balance">
            (wallet balance{' '}
            <span className="wallet-balance-chip__balance__amount">
              {props.currency}&nbsp;{Util.formatMoneyNumber(props.balance)}
            </span>
            )
          </span>
        )}
      </>
    </span>
  );
};
