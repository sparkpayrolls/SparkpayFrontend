import Skeleton from 'react-loading-skeleton';

import 'react-loading-skeleton/dist/skeleton.css';
import { Util } from 'src/helpers/util';

export const TotalPayrollChip = (props: {
  loading?: boolean;
  amount: number;
  currency: string;
}) => {
  return (
    <span className="total-payroll-chip">
      <span>Total Payroll Cost:</span>
      {props.loading && <Skeleton width={200} borderRadius={4} count={1} />}
      {!props.loading && (
        <span className="total-payroll-chip__amount">
          {props.currency}&nbsp;{Util.formatMoneyNumber(props.amount)}
        </span>
      )}
    </span>
  );
};
