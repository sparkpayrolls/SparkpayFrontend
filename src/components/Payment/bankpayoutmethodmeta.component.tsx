import { Select } from 'antd';
import { Formik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { $api } from 'src/api';
import { Bank } from 'src/api/types';
import { Util } from 'src/helpers/util';
import { bankPayoutMethodMetaValidationSchema } from 'src/helpers/validation';
import { Input } from '../Input/Input.component';
import { InputError } from '../Shared/input-error.component';
import { Label } from '../Shared/label.component';
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
    }, 1000),
    [],
  );

  useEffect(() => {
    validate(method.id, vals);
  }, [method.id, vals, validate]);

  useEffect(() => {
    getBanks();
  }, [getBanks]);

  useEffect(() => {
    if (props.initialValues && !accountName) {
      setValues({ ...props.initialValues });
    }
  }, [props.initialValues, accountName]);

  return (
    <Formik
      initialValues={props.initialValues || vals}
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
            <div>
              <Label htmlFor="banks">Bank Name</Label>
              <Select
                id="banks"
                className={
                  (touched.bankId && !!errors.bankId && 'has-error') || ''
                }
                placeholder="Select Bank Name"
                onBlur={() => setTouched({ ...touched, bankId: true }, true)}
                onChange={(val: string) => {
                  setValues({ ...vals, bankId: val });
                  setVals({ ...values, bankId: val }, true);
                }}
                optionFilterProp="children"
                showSearch
                disabled={!banks.length}
                loading={loading}
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
              <InputError>{touched.bankId && errors.bankId}</InputError>
            </div>

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
