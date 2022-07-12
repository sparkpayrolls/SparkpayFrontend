import { BankTransferFields } from './bank-transfer-fields.component/bank-transfer-fields.component';
import {
  PayoutDetailFieldsComponentProps,
  PayoutDetailFieldsProps,
} from './types';

export const PayoutDetailFields = (props: PayoutDetailFieldsProps) => {
  const { payoutDetails, payoutMethod, ...fieldsComponentProps } = props;
  const FieldsComponent = payoutDetailFieldsComponent[payoutMethod.name];
  if (FieldsComponent) {
    return (
      <FieldsComponent
        {...fieldsComponentProps}
        payoutMethod={payoutMethod.id}
        value={payoutDetails}
      />
    );
  }

  return (
    <>
      {payoutDetails.map((name, i) => {
        return <td key={`${name}_${i}`}></td>;
      })}
    </>
  );
};

const payoutDetailFieldsComponent: Record<
  string,
  // eslint-disable-next-line no-undef
  (_props: PayoutDetailFieldsComponentProps) => JSX.Element
> = {
  'Bank Transfer': BankTransferFields,
};
