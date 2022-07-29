import { useState, ChangeEvent, useEffect } from 'react';
import { Bank } from 'src/api/types';
import { usePayoutDetailsValidation } from 'src/helpers/hooks/use-payout-details-validation.hook';
import { PayoutDetailFieldsComponentProps } from '../types';

export const useBankTransferFieldsContext = (
  props: PayoutDetailFieldsComponentProps,
) => {
  const { payoutMethod, onChange, name, payoutMethodMeta } = props;
  const banks = props.payoutMehodContext.banks as Bank[];
  const {
    validateResponse,
    error: _error = '',
    bankId = '',
    accountNumber = '',
  } = payoutMethodMeta;
  const [values, setValues] = useState({
    bankId: bankId as string,
    accountNumber: accountNumber as string,
  });
  const [error, setError] = useState(_error as string);
  const [accountName, setAccountName] = useState(
    ((validateResponse as Record<string, unknown>)?.accountName as string) ||
      '',
  );
  const [validatePayload, setValidatePayload] = useState<typeof values>();
  const {
    result,
    error: validationError,
    loading,
  } = usePayoutDetailsValidation({
    meta: validatePayload,
    method: payoutMethod,
  });

  useEffect(() => {
    const { accountName = '' } = (result as { accountName: string }) || {};
    const error = validationError ? 'invalid bank details' : '';
    if (error || accountName) {
      setAccountName(accountName);
      setError(error);
    }
  }, [result, validationError]);

  useEffect(() => {
    const { bankId, accountNumber } = payoutMethodMeta;
    if (
      (values.bankId &&
        values.accountNumber.length >= 6 &&
        values.bankId !== bankId,
      accountNumber !== values.accountNumber)
    ) {
      setValidatePayload(values);
    }
  }, [values, payoutMethodMeta]);

  const handleChange = (param: string | ChangeEvent<HTMLInputElement>) => {
    let { value, name: _name = 'bankId' } =
      (param as ChangeEvent<HTMLInputElement>).target || {};
    if (typeof param === 'string') {
      value = param;
    }
    const update = { ...values, [_name]: value };
    if (onChange) {
      setTimeout(onChange, 0, {
        target: {
          name,
          value: {
            ...payoutMethodMeta,
            ...update,
          },
        },
      });
    }

    setValues(update);
  };

  return {
    accountName,
    error,
    handleChange,
    loading,
    values,
    banks,
    bank: banks.find((bank) => bank.id === values.bankId),
  };
};
