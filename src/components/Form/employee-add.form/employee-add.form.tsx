import { useState } from 'react';
import { Formik, FormikProps } from 'formik';
import { Util } from 'src/helpers/util';
import { singleEmployeeUploadValidationSchema } from 'src/helpers/validation';
import { Button } from '../../Button/Button.component';
import { InputV2 } from '../../Input/Input.component';
import { AddEmployee, IEmployeeAddForm } from '../../types';
import { $api } from 'src/api';
import { PayoutDetails } from '../../Employee/payout-details.component';

const emailExists = Util.debounce(
  // eslint-disable-next-line no-unused-vars
  (email: string, callback: (_exists: boolean) => any) => {
    $api.employee
      .findEmployeeByEmail(email)
      .then(() => callback(true))
      .catch(() => callback(false));
  },
  500,
);
const lastEmail: string[] = [];

export const EmployeeAddForm = (props: IEmployeeAddForm) => {
  const { initialValues, onSubmit, currency, country } = props;
  const isEditing =
    initialValues.firstname ||
    initialValues.lastname ||
    initialValues.email ||
    initialValues.salary;
  const [showPayoutDetails, setShowPayoutDetails] = useState(false);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={singleEmployeeUploadValidationSchema}
      onSubmit={onSubmit}
    >
      {(props: FormikProps<AddEmployee>) => {
        const {
          handleChange,
          handleSubmit,
          handleBlur,
          values,
          errors,
          touched,
          isSubmitting,
          setErrors,
          setSubmitting,
          setTouched,
          setValues,
        } = props;
        if (
          !errors.email &&
          touched.email &&
          values.email &&
          !isSubmitting &&
          !lastEmail.includes(values.email)
        ) {
          setSubmitting(true);
          emailExists(values.email, (exists) => {
            setSubmitting(false);
            if (exists) {
              setErrors({
                ...errors,
                email: 'Employee with email already exists.',
              });
            } else lastEmail.push(values.email);
          });
        }

        return (
          <form
            onSubmit={handleSubmit}
            className="edit-details-form"
            autoComplete="off"
          >
            <div className="form__grid single-employee-upload-form__section">
              <div className="form__grid__col--6 padding-right-space-1">
                <InputV2
                  label="First Name"
                  placeholder="First Name"
                  name="firstname"
                  value={values.firstname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.firstname && errors.firstname}
                />
              </div>

              <div className="form__grid__col--6 padding-left-space-1">
                <InputV2
                  label="Last Name"
                  placeholder="Last Name"
                  name="lastname"
                  value={values.lastname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.lastname && errors.lastname}
                />
              </div>
            </div>

            <div className="single-employee-upload-form__section">
              <InputV2
                type="number"
                label={`Salary Amount (${currency})`}
                placeholder={`Salary Amount (${currency})`}
                name="salary"
                value={values.salary}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.salary && errors.salary}
                transformValue={(val) => {
                  const valTransformed = +`${val}`.replace(/[^0-9.]/gi, '');
                  if (isNaN(valTransformed) || val === '') return '';

                  return `${currency} ${valTransformed.toLocaleString()}`;
                }}
              />

              {!showPayoutDetails && (
                <button
                  className="single-employee-upload-form__linklike-button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPayoutDetails(true);
                  }}
                >
                  Set payment information
                </button>
              )}
            </div>

            {showPayoutDetails && (
              <div className="single-employee-upload-form__payout-details">
                <PayoutDetails
                  setTouched={setTouched}
                  setValues={setValues}
                  touched={touched}
                  errors={errors}
                  values={values}
                  country={country}
                />
              </div>
            )}

            <div className="single-employee-upload-form__section">
              <InputV2
                type="email"
                label="Email Address"
                placeholder="Email Address"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && errors.email}
                loading={isSubmitting}
              />
            </div>

            <div className="single-employee-upload-form__section">
              <InputV2
                type="tel"
                label="Phone Number"
                placeholder="Phone Number"
                name="phoneNumber"
                value={values.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phoneNumber && errors.phoneNumber}
              />
            </div>

            <div className="form__submit-button">
              <Button
                type="submit"
                label={isEditing ? 'Save Details' : 'Save Employee'}
                className="form__submit-button form__submit-button--full-width"
                primary
                disabled={
                  isSubmitting || Util.deepEquals(values, initialValues)
                }
                showSpinner={isSubmitting}
              />
            </div>
          </form>
        );
      }}
    </Formik>
  );
};
