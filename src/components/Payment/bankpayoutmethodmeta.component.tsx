import { Formik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { $api } from 'src/api';
import { Bank } from 'src/api/types';
import { Util } from 'src/helpers/util';
import { bankPayoutMethodMetaValidationSchema } from 'src/helpers/validation';
import { Input } from '../Input/Input.component';
import { Select } from '../Input/select.component';
import { IBankPayoutMethodMeta } from '../types';

let callId = 0;

export const BankPayoutMethodMeta = (props: IBankPayoutMethodMeta) => {
  const { method, error, setMeta } = props;
  const [banks, setBanks] = useState<Bank[]>([]);
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
      if (meta.accountNumber && meta.accountNumber.length >= 6 && meta.bankId) {
        callId += 1;
        const id = callId;
        try {
          setAccountName('');
          setMeta(null);
          setErr('');
          setLoading(true);

          const res = await $api.payout.validatePayoutMethod(methodId, meta);
          if (id === callId) {
            setAccountName((res as { accountName: string })?.accountName);
            setMeta(meta);
          }
        } catch (error) {
          if (id === callId) {
            setErr('invalid bank details provided');
          }
        } finally {
          setLoading(false);
        }
      }
    }, 1000),
    [],
  );

  useEffect(() => {
    getBanks();
  }, [getBanks]);

  return (
    <Formik
      initialValues={
        props.initialValues || {
          bankId: '',
          accountNumber: '',
        }
      }
      onSubmit={() => {}}
      validationSchema={bankPayoutMethodMetaValidationSchema}
    >
      {(props) => {
        const {
          values,
          handleBlur,
          handleChange,
          touched,
          errors,
          setTouched,
          setValues: setVals,
        } = props;

        return (
          <>
            <Select
              label="Bank Name"
              className={
                (touched.bankId && !!errors.bankId && 'has-error') || ''
              }
              placeholder="Select Bank Name"
              onBlur={() => setTouched({ ...touched, bankId: true }, true)}
              onChange={(val: string) => {
                const newVals = { ...values, bankId: val };
                setVals(newVals, true);
                validate(method.id, newVals);
              }}
              optionFilterProp="children"
              showSearch
              disabled={!banks.length}
              loading={loading}
              error={(touched.bankId && errors.bankId) || ''}
            >
              {banks.map((bank) => {
                const { Option } = Select;

                return (
                  <Option value={bank.id} key={bank.id}>
                    {bank.name}
                  </Option>
                );
              })}
            </Select>

            <Input
              type="tel"
              label={accountName || 'Account Number'}
              placeholder="Account Number"
              value={values.accountNumber}
              name="accountNumber"
              onChange={(event) => {
                handleChange(event);
                validate(method.id, {
                  ...values,
                  accountNumber: event.target.value,
                });
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
