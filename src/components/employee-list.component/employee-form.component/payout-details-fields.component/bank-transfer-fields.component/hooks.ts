import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { useBanks } from 'src/helpers/hooks/use-banks.hook';
import { usePayoutDetailsValidation } from 'src/helpers/hooks/use-payout-details-validation.hook';
import { Util } from 'src/helpers/util';
import { useAppSelector } from 'src/redux/hooks';
import { PayoutDetailFieldsComponentProps } from '../types';

export const useBankTransferFieldsContext = (
  props: PayoutDetailFieldsComponentProps,
) => {
  const [bankName, accountNumber] = props.value;
  const { name, onChange, payoutMethod } = props;
  const [values, setValues] = useState({
    bankId: '',
    accountNumber: `${accountNumber}`,
  });
  const [toValidate, setToValidate] = useState<typeof values>();
  const {
    result,
    error: validationError,
    loading,
  } = usePayoutDetailsValidation({
    meta: toValidate,
    method: payoutMethod,
  });
  const administrator = useAppSelector((state) => state.administrator);
  const country = Util.getCountryFromAdministrator(administrator);
  const { banks, loading: loadingBanks } = useBanks({
    country: country.id,
    all: true,
  });
  const nameRegex = useRef(new RegExp(bankName, 'gi'));
  const { accountName } = (result as { accountName: string }) || {};
  const error = validationError ? 'invalid bank details' : '';

  useEffect(() => {
    const bankIdFromName = banks.find((bank) =>
      nameRegex.current.test(bank.name),
    );

    if (bankIdFromName) {
      setValues((values) => ({ ...values, bankId: bankIdFromName.id }));
    }
  }, [banks]);

  useEffect(() => {
    if (values.bankId && values.accountNumber.length >= 6) {
      setToValidate(values);
      if (onChange) {
        onChange({ target: { name, value: values } });
      }
    }
  }, [name, onChange, values]);

  const handleChange = (param: string | ChangeEvent<HTMLInputElement>) => {
    let { value, name = 'bankId' } =
      (param as ChangeEvent<HTMLInputElement>).target || {};

    if (typeof param === 'string') {
      value = param;
    }

    setValues({ ...values, [name]: value });
  };

  return {
    accountName,
    bankName,
    banks,
    error,
    handleChange,
    loading,
    loadingBanks,
    values,
  };
};
