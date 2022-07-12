import { EditableField } from '@/components/Input/editable-field.component';
import { Select } from '@/components/Input/select.component';
import { PayoutDetailFieldsComponentProps } from '../types';
import { useBankTransferFieldsContext } from './hooks';

export const BankTransferFields = (props: PayoutDetailFieldsComponentProps) => {
  const {
    accountName,
    bankName,
    banks,
    error,
    handleChange,
    loading,
    loadingBanks,
    values,
  } = useBankTransferFieldsContext(props);

  return (
    <>
      <td>
        <Select
          style={{ minWidth: '250px' }}
          loading={loadingBanks || loading}
          value={values.bankId}
          optionFilterProp="label"
          showSearch
          options={banks.map((bank) => ({ value: bank.id, label: bank.name }))}
          error={
            !values.bankId &&
            !!bankName &&
            `unknown/unsupported bank '${bankName}'`
          }
          onChange={handleChange}
        />
      </td>

      <td>
        <EditableField
          type="text"
          placeholder="Account Number"
          value={values.accountNumber}
          onChange={handleChange}
          error={error}
          name={'accountNumber'}
          helper={accountName}
        />
      </td>
    </>
  );
};
