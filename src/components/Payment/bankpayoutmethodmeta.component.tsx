import { Formik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { $api } from 'src/api';
import { Bank } from 'src/api/types';
import { Util } from 'src/helpers/util';
import { bankPayoutMethodMetaValidationSchema } from 'src/helpers/validation';
import { Input } from '../Input/Input.component';
import { SelectInput } from '../Input/seletct-input';
import { IBankPayoutMethodMeta } from '../types';

export const BankPayoutMethodMeta = (props: IBankPayoutMethodMeta) => {
  const { method, error, setMeta } = props;
  const [banks, setBanks] = useState<Bank[]>([]);
  const [vals, setValues] = useState({
    bankId: '',
    accountNumber: '',
  });
  const [err, setErr] = useState('');
  const [accountName, setAccountName] = useState('');
  const [loading, setLoading] = useState(false);

  const getBanks = useCallback(async () => {
    try {
      setBanks([]);
      const {
        data,
      } = await $api.payout.getSupportedBanks(
        typeof method.country === 'string' ? method.country : method.country.id,
        { all: true },
      );
      setBanks(data);
    } catch (error) {
      //...
    }
  }, [method.country]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const validate = useCallback(
    Util.debounce(async (methodId: string, meta: Record<string, any>) => {
      try {
        setAccountName('');
        setMeta(null);
        setLoading(true);
        setErr('');
        if (meta.accountNumber && meta.bankId) {
          const res = await $api.payout.validatePayoutMethod(methodId, meta);
          setAccountName((res as { accountName: string })?.accountName);
          setMeta(meta);
        }
      } catch (error) {
        setAccountName('');
        setMeta(null);
        setErr('invalid bank details provided');
      } finally {
        setLoading(false);
      }
    }, 500),
    [],
  );

  useEffect(() => {
    validate(method.id, vals);
  }, [method.id, vals, validate]);

  useEffect(() => {
    getBanks();
  }, [getBanks]);

  return (
    <Formik
      initialValues={{ bankId: '', accountNumber: '' }}
      onSubmit={() => {}}
      validationSchema={bankPayoutMethodMetaValidationSchema}
    >
      {(props) => {
        const { values, handleBlur, handleChange, touched, errors } = props;
        return (
          <>
            <SelectInput
              options={banks}
              displayValue="name"
              actualValue="id"
              name="bankId"
              value={values.bankId}
              label="Bank Name"
              onChange={(event) => {
                setValues({ ...vals, bankId: event.target.value });
                handleChange(event);
              }}
              onBlur={handleBlur}
              loading={loading || !banks.length}
              error={((error || touched.bankId) && errors.bankId) || ''}
            />

            <Input
              type="tel"
              label={accountName || 'Account Number'}
              placeholder="Account Number"
              value={values.accountNumber}
              name="accountNumber"
              onChange={(event) => {
                setValues({ ...vals, accountNumber: event.target.value });
                handleChange(event);
              }}
              onBlur={handleBlur}
              hasError={
                !!err ||
                ((error || touched.accountNumber) && !!errors.accountNumber)
              }
              error={err || errors.accountNumber}
            />
          </>
        );
      }}
    </Formik>
  );
};
