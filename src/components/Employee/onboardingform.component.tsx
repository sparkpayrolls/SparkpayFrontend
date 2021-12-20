import { Formik, FormikProps } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { $api } from 'src/api';
import { PayoutMethod } from 'src/api/types';
import { EmployeeOnboardingValidationSchema } from 'src/helpers/validation';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { getCountries } from 'src/redux/slices/countries/countries.slice';
import { Button } from '../Button/Button.component';
import { SelectInput } from '../Input/seletct-input';
import { IF } from '../Misc/if.component';
import { PayoutMethodMeta } from '../Payment/payoutmethodmeta.component';
import { EmployeeOnboarding, IEmployeeOnboardingForm } from '../types';

export const EmployeeOnboardingForm = (props: IEmployeeOnboardingForm) => {
  const { countries } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const [country, setCountry] = useState('');
  const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([]);
  const [payoutMethod, setPayoutMethod] = useState<PayoutMethod | null>(null);

  const { loading, initialValue } = props;

  const getPayoutMethods = useCallback(async () => {
    try {
      setPayoutMethods([]);
      if (country) {
        const payoutMethods = await $api.payout.getSupportedPayoutMethods(
          country,
        );
        setPayoutMethods(payoutMethods);
      }
    } catch (error) {
      // ....
    }
  }, [country]);

  useEffect(() => {
    getCountries(dispatch);
  }, [dispatch]);

  useEffect(() => {
    getPayoutMethods();
  }, [getPayoutMethods]);

  useEffect(() => {
    setCountry(initialValue.country);

    const payoutMethod = payoutMethods.find(
      (p) => p.id === initialValue.payoutMethod,
    );
    if (payoutMethod) {
      setPayoutMethod(payoutMethod);
    }
  }, [initialValue, payoutMethods]);

  return (
    <Formik
      initialValues={initialValue}
      validationSchema={EmployeeOnboardingValidationSchema}
      onSubmit={props.onSubmit}
    >
      {(props: FormikProps<EmployeeOnboarding>) => {
        const {
          handleChange,
          handleSubmit,
          handleBlur,
          values,
          errors,
          touched,
          setValues,
          isSubmitting,
        } = props;

        return (
          <form
            onSubmit={handleSubmit}
            className="create-organization-form"
            autoComplete="off"
          >
            <div className="employee-onboard__form-input-section">
              <div className="employee-onboard__form-grid">
                <SelectInput
                  options={countries}
                  displayValue="name"
                  actualValue="id"
                  name="country"
                  value={values.country}
                  label="Country"
                  onChange={(event) => {
                    setCountry(event.target.value);
                    handleChange(event);
                  }}
                  selected={{ id: values.country }}
                  onBlur={handleBlur}
                  loading={!countries.length || loading}
                  error={(touched.country && errors.country) || ''}
                />
              </div>

              <SelectInput
                options={payoutMethods}
                displayValue="name"
                actualValue="id"
                name="payoutMethod"
                value={values.payoutMethod}
                label="Payout Method"
                selected={{ id: values.payoutMethod }}
                onChange={(event) => {
                  const selected = payoutMethods.find(
                    (p) => p.id === event.target.value,
                  );
                  setPayoutMethod(selected ?? null);
                  handleChange(event);
                }}
                onBlur={handleBlur}
                loading={(!!country && !payoutMethods.length) || loading}
                error={(touched.payoutMethod && errors.payoutMethod) || ''}
              />
              <IF condition={!!payoutMethod}>
                <PayoutMethodMeta
                  method={payoutMethod}
                  setMeta={(payoutMethodMeta) =>
                    setValues({ ...values, payoutMethodMeta })
                  }
                  error={touched.payoutMethodMeta && !!errors.payoutMethodMeta}
                  initialValues={values.payoutMethodMeta}
                />
              </IF>
            </div>
            <Button
              label="Submit"
              type="submit"
              disabled={isSubmitting || loading}
              showSpinner={isSubmitting || loading}
              onClick={() => {}}
              className="employee-onboard__submit-btn"
              primary
            />
          </form>
        );
      }}
    </Formik>
  );
};
