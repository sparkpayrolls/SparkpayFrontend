import { Formik, FormikProps } from 'formik';
import { useEffect } from 'react';
import { EmployeeOnboardingValidationSchema } from 'src/helpers/validation';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { getCountries } from 'src/redux/slices/countries/countries.slice';
import { Button } from '../Button/Button.component';
import { Select } from '../Input/select.component';
import { EmployeeOnboarding, IEmployeeOnboardingForm } from '../types';
import { PayoutDetails } from './payout-details.component';

export const EmployeeOnboardingForm = (props: IEmployeeOnboardingForm) => {
  const { countries } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();

  const { loading, initialValue } = props;

  useEffect(() => {
    getCountries(dispatch);
  }, [dispatch]);

  return (
    <Formik
      key={JSON.stringify(initialValue)}
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
                    setValues({ ...values, country: val }, true);
                  }}
                  value={values.country}
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

              <PayoutDetails
                setTouched={setTouched}
                setValues={setValues}
                touched={touched}
                errors={errors}
                values={values}
                country={values.country}
              />
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
