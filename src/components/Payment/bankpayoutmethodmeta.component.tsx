import { Formik } from 'formik';
import { useBanks } from 'src/helpers/hooks/use-banks.hook';
import { usePayoutDetailsValidation } from 'src/helpers/hooks/use-payout-details-validation.hook';
import { bankPayoutMethodMetaValidationSchema } from 'src/helpers/validation';
import { InputV2 } from '../Input/Input.component';
import { Select } from '../Input/select.component';
import { IBankPayoutMethodMeta } from '../types';

export const BankPayoutMethodMeta = (props: IBankPayoutMethodMeta) => {
  const { method, error, setMeta } = props;
  const country =
    typeof method.country === 'string' ? method.country : method.country.id;
  const { banks, loading: loadingBanks } = useBanks({ country, all: true });
  const {
    result = {},
    loading: loadingPayoutValidation,
    error: payoutValidationError,
  } = usePayoutDetailsValidation({
    method: method.id,
    meta: props.initialValues,
  });
  const { accountName } = result as { accountName: string };
  const err = payoutValidationError ? 'invalid bank details' : '';

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
          touched,
          errors,
          setTouched,
          setValues: setVals,
        } = props;

        const setValue = (val: string, name: keyof typeof values) => {
          const newVals = { ...values, [name]: val };
          setVals(newVals, true);
          if (newVals.bankId && newVals.accountNumber?.length >= 6) {
            setMeta(newVals);
          }
        };

        return (
          <>
            <Select
              label="Bank Name"
              className={
                (touched.bankId && !!errors.bankId && 'has-error') || ''
              }
              placeholder="Select Bank Name"
              onBlur={() => setTouched({ ...touched, bankId: true }, true)}
              onChange={(val) => setValue(val, 'bankId')}
              value={values.bankId}
              optionFilterProp="children"
              showSearch
              disabled={!banks.length}
              loading={loadingPayoutValidation || loadingBanks}
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

            <InputV2
              type="tel"
              label={'Account Number'}
              helper={accountName}
              placeholder="Account Number"
              value={values.accountNumber}
              name="accountNumber"
              onChange={(event) =>
                setValue(event.target.value, 'accountNumber')
              }
              onBlur={handleBlur}
              error={
                (!!err ||
                  ((!!error || touched.accountNumber) &&
                    !!errors.accountNumber)) &&
                (err || errors.accountNumber)
              }
            />
          </>
        );
      }}
    </Formik>
  );
};
