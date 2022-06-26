import { Button } from '@/components/Button/Button.component';
import { InputV2 } from '@/components/Input/Input.component';
import { Formik } from 'formik';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRequestAccessPageLogic } from 'src/helpers/hooks/use-request-access-page-logic.hook';
import { RequestAccessValidation } from 'src/helpers/validation';
import { AuthLayout } from 'src/layouts/auth-layout/auth-layout';

const RequestAccess: NextPage = () => {
  const { initialValues, onSubmit } = useRequestAccessPageLogic();

  return (
    <AuthLayout
      title="Request Access"
      description="Request for access to SparkPay"
    >
      <h1 className="login__title">Request Access</h1>
      <p className="login__subtext">
        Enter your name &amp; email to request access
      </p>

      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={RequestAccessValidation}
      >
        {(props) => {
          const {
            handleSubmit,
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
          } = props;

          return (
            <form onSubmit={handleSubmit}>
              <div className="login__form-input-section">
                <div className="login__form-grid">
                  <InputV2
                    label="Name"
                    error={touched.name && errors.name}
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    name="name"
                  />
                </div>

                <InputV2
                  label="Email"
                  type="email"
                  error={touched.email && errors.email}
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>

              <Button
                type="submit"
                className="login__submit-btn"
                primary
                label="Request Access"
                showSpinner={isSubmitting}
                disabled={isSubmitting}
              />
            </form>
          );
        }}
      </Formik>
      <div className="login__sign-up">
        <p className="login__sign-up-text">
          Already have an account?
          <Link href="/login">
            <a className="login__span-text"> Log In</a>
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RequestAccess;
