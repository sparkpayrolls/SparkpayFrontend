import { Button } from '@/components/Button/Button.component';
import { InputV2 } from '@/components/Input/Input.component';
import { Select } from '@/components/Input/select.component';
import { Formik } from 'formik';
import { NextPage } from 'next';
import Link from 'next/link';
import { useCreateAccountPageContext } from 'src/helpers/hooks/use-create-account-page-context.hook';
import { signupValidationSchema } from 'src/helpers/validation';
import { AuthLayout } from 'src/layouts/auth-layout/auth-layout';

const CreateAccount: NextPage = () => {
  const context = useCreateAccountPageContext();
  if (!context) {
    return null;
  }

  const { countries, initialValues, onSubmit, validateEmail } = context;

  return (
    <AuthLayout title="SparkPay | Create Account">
      <h1 className="create-account__title">Create Account</h1>
      <p className="create-account__subtext">
        Enter your details to create a free account
      </p>

      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={signupValidationSchema}
      >
        {(props) => {
          const {
            values,
            touched,
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            setErrors,
            setSubmitting,
            setTouched,
            setValues,
          } = props;

          return (
            <form onSubmit={handleSubmit}>
              <div className="create-account__form-input-area">
                <div className="create-account__form-grid">
                  <InputV2
                    type="text"
                    label="First Name"
                    name="firstname"
                    value={values.firstname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.firstname && errors.firstname}
                  />

                  <InputV2
                    type="text"
                    label="Last Name"
                    name="lastname"
                    value={values.lastname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.lastname && errors.lastname}
                  />
                </div>

                <InputV2
                  type="email"
                  label="Email Address"
                  name="email"
                  value={values.email}
                  loading={isSubmitting}
                  onChange={(event: any) => {
                    validateEmail(event.target.value, setErrors, setSubmitting);
                    handleChange(event);
                  }}
                  onBlur={(event: any) => {
                    validateEmail(event.target.value, setErrors, setSubmitting);
                    handleBlur(event);
                  }}
                  error={touched.email && errors.email}
                />

                <Select
                  onBlur={() => setTouched({ ...touched, country: true }, true)}
                  onChange={(val: string) =>
                    setValues({ ...values, country: val }, true)
                  }
                  optionFilterProp="children"
                  showSearch
                  loading={!countries.length}
                  disabled={!countries.length}
                  label="Select Country"
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

                <InputV2
                  type="password"
                  label="Password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  showVisibilityToggle
                  hideValue
                  error={touched.password && errors.password}
                />

                <InputV2
                  type="checkbox"
                  checkbox
                  id="subscribe"
                  labelFor="subscribe"
                  label="Subscribe to hearing about exciting new features and offers"
                  name="subcribeToMailList"
                  checked={values.subcribeToMailList}
                  onChange={() => {
                    setValues({
                      ...values,
                      subcribeToMailList: !values.subcribeToMailList,
                    });
                  }}
                />
              </div>

              <Button
                type="submit"
                label="Create Account"
                className="create-account__submit-btn"
                primary
                disabled={isSubmitting || !countries.length}
                showSpinner={isSubmitting || !countries.length}
              />
            </form>
          );
        }}
      </Formik>

      <p className="create-account__have-an-account-text">
        Already have an account?{' '}
        <Link href="/login">
          <a className="create-account__span-text"> Log In</a>
        </Link>
      </p>

      <p className="create-account__terms-and-conditions">
        By creating an account, you have agreed to our <br />{' '}
        <Link href="#">
          <a className="create-account__span-text underline-text">terms</a>
        </Link>{' '}
        and{' '}
        <Link href="#">
          <a className="create-account__span-text underline-text">conditions</a>
        </Link>
      </p>
    </AuthLayout>
  );
};
export default CreateAccount;
