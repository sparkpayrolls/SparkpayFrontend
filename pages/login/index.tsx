import { Button } from '@/components/Button/Button.component';
import { InputV2 } from '@/components/Input/Input.component';
import { Formik } from 'formik';
import { NextPage } from 'next';
import Link from 'next/link';
import { useLoginPageLogic } from 'src/helpers/hooks/use-login-page-logic.hook';
import { loginValidationSchema } from 'src/helpers/validation';
import { AuthLayout } from 'src/layouts/auth-layout/auth-layout';

const Login: NextPage = () => {
  const context = useLoginPageLogic();
  if (!context) {
    return null;
  }

  const { initialValues, onSubmit } = context;

  return (
    <AuthLayout title="SparkPay | Log In">
      <h1 className="login__title">Log In</h1>
      <p className="login__subtext">Enter your email &amp; password to login</p>

      <Formik
        initialValues={initialValues}
        onSubmit={onSubmit}
        validationSchema={loginValidationSchema}
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
          } = props;

          return (
            <form onSubmit={handleSubmit}>
              <div className="login__form-input-section">
                <div className="login__form-grid">
                  <InputV2
                    type="email"
                    label="Email Address"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.email && errors.email}
                  />
                </div>

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
              </div>
              <div className="login__forgot-password">
                <Link href="/forgot-password">
                  <a className="login__forgot-password-title">
                    Forgot Password?
                  </a>
                </Link>
              </div>

              <Button
                label="Log In"
                type="submit"
                className="login__submit-btn"
                primary
                showSpinner={isSubmitting}
                disabled={isSubmitting}
              />
            </form>
          );
        }}
      </Formik>
      <div className="login__sign-up">
        <p className="login__sign-up-text">
          Don’t have an account?
          <Link href={context.createAccountUrl}>
            <a className="login__span-text"> Create Account</a>
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default Login;
