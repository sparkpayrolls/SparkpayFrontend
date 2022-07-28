import { ConcealedInput, ConcealedSelect } from '../../components';
import { PayoutDetailFieldsComponentProps } from '../types';
import { useBankTransferFieldsContext } from './hooks';

export const BankTransferFields = (props: PayoutDetailFieldsComponentProps) => {
  const {
    accountName,
    error,
    handleChange,
    loading,
    values,
    banks,
    bank,
  } = useBankTransferFieldsContext(props);

  return (
    <>
      <ConcealedSelect
        className="flex-table__td"
        loading={loading}
        selectProps={{
          placeholder: 'Account Number',
          defaultValue: values.bankId,
          options: banks.map((bank) => ({ value: bank.id, label: bank.name })),
          onChange: handleChange,
          showSearch: true,
          loading,
          optionFilterProp: 'label',
        }}
      >
        {bank?.name}
      </ConcealedSelect>

      <ConcealedInput
        className="flex-table__td"
        helper={accountName as string}
        error={error}
        inputProps={{
          type: 'text',
          placeholder: 'Account Number',
          className: 'employee-list__input',
          defaultValue: values.accountNumber,
          name: `accountNumber`,
          onChange: handleChange,
        }}
      >
        {values.accountNumber}
      </ConcealedInput>
    </>
  );
};
