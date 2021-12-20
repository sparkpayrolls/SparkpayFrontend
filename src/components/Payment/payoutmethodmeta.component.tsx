import { IPayoutMethodMeta } from '../types';
import { BankPayoutMethodMeta } from './bankpayoutmethodmeta.component';

export const PayoutMethodMeta = (props: IPayoutMethodMeta) => {
  const { method, error, setMeta } = props;

  switch (method?.name) {
    case 'Bank Transfer':
      return (
        <BankPayoutMethodMeta
          initialValues={props.initialValues as any}
          method={method}
          error={error}
          setMeta={setMeta}
        />
      );
    default:
      return null;
  }
};
