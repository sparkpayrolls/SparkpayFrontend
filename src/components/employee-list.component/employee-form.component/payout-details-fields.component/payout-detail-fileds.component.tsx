import { BankTransferFields } from './bank-transfer-fields.component/bank-transfer-fields.component';
import {
  PayoutDetailFieldsComponentProps,
  PayoutDetailFieldsProps,
} from './types';

export const PayoutDetailFields = (props: PayoutDetailFieldsProps) => {
  const { payoutMethodName, ...fieldsComponentProps } = props;
  const FieldsComponent = payoutDetailFieldsComponent[payoutMethodName];
  if (FieldsComponent) {
    return <FieldsComponent {...fieldsComponentProps} />;
  }

  return null;
};

const payoutDetailFieldsComponent: Record<
  string,
  // eslint-disable-next-line no-undef
  (_props: PayoutDetailFieldsComponentProps) => JSX.Element
> = {
  'Bank Transfer': BankTransferFields,
};
