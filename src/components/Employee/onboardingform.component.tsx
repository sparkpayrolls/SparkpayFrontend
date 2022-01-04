import { Formik, FormikProps } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { $api } from 'src/api';
import { PayoutMethod } from 'src/api/types';
import { EmployeeOnboardingValidationSchema } from 'src/helpers/validation';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { getCountries } from 'src/redux/slices/countries/countries.slice';
import { Button } from '../Button/Button.component';
import { Select } from '../Input/select.component';
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
    const payoutMethod = payoutMethods.find(
      (p) => p.id === initialValue.payoutMethod,
    );
    if (payoutMethod) {
      setPayoutMethod(payoutMethod);
    }
  }, [initialValue, payoutMethods]);

  useEffect(() => {
    setCountry(initialValue.country);
  }, [initialValue]);

  return (
    <Formik
      initialValues={initialValue}
      validationSchema={EmployeeOnboardingValidationSchema}
      onSubmit={props.onSubmit}
    >
      {(props: FormikProps<EmployeeOnboarding>) => {
        const {
          handleSubmit,
          setTouched,
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
                <Select
                  label="Country"
                  onBlur={() => setTouched({ ...touched, country: true }, true)}
                  onChange={(val: string) => {
                    setCountry(val);
                    setValues({ ...values, country: val }, true);
                  }}
                  optionFilterProp="children"
                  placeholder="Select Country"
                  showSearch
                  disabled={!countries.length}
                  loading={!countries.length}
                  error={(touched.country && errors.country) || ''}
                >
                  {countries.map((country) => {
                    const { Option } = Select;

                    return (
                      <Option value={country.id} key={country.id}>
                        {country.name}
                      </Option>
                    );
                  })}
                </Select>
              </div>

              <div>
                <Select
                  label="Payout Method"
                  placeholder="Select Payout Method"
                  onBlur={() =>
                    setTouched({ ...touched, payoutMethod: true }, true)
                  }
                  onChange={(val: string) => {
                    const selected = payoutMethods.find((p) => p.id === val);
                    setPayoutMethod(selected ?? null);
                    setValues({ ...values, payoutMethod: val }, true);
                  }}
                  optionFilterProp="children"
                  showSearch
                  disabled={!country || !payoutMethods.length}
                  loading={(!!country && !payoutMethods.length) || loading}
                  error={(touched.payoutMethod && errors.payoutMethod) || ''}
                >
                  {payoutMethods.map((payoutMethod) => {
                    const { Option } = Select;

                    return (
                      <Option value={payoutMethod.id} key={payoutMethod.id}>
                        {payoutMethod.name}
                      </Option>
                    );
                  })}
                </Select>
              </div>
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
