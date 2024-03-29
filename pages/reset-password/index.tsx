import { Formik, FormikHelpers, FormikErrors } from 'formik';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { useTawkto } from 'src/helpers/hooks/use-tawkto';
import { Util } from 'src/helpers/util';
import { resetPasswordValidationSchema } from 'src/helpers/validation';
import { Title, useUrl } from 'src/layouts/default-layout/DefaultLayout';
import { useAppSelector } from 'src/redux/hooks';
import { Button } from '../../src/components/Button/Button.component';
import { Input } from '../../src/components/Input/Input.component';

type IResetPassword = {
  password: string;
  confirmPassword: string;
};

const ResetPassword: NextPage = () => {
  const { user } = useAppSelector((state) => state);
  const router = useRouter();
  const { url } = useUrl();

  useTawkto();

  if (user) {
    router.replace('/');
    return null;
  }

  const validateConfirmPassword = Util.debounce((
    values: IResetPassword,
    // eslint-disable-next-line no-unused-vars
    setErrors: (errors: FormikErrors<IResetPassword>) => void,
  ) => {
    const doesNotMatch =
      values.confirmPassword && values.confirmPassword !== values.password;
    if (doesNotMatch) {
      setErrors({ confirmPassword: 'does not match password' });
    }
  }, 500);

  const onSubmit = async (
    values: IResetPassword,
    actions: FormikHelpers<IResetPassword>,
  ) => {
    try {
      actions.setSubmitting(true);
      const code = router.query.code as string;

      await $api.auth.resetPassword(code, values.password);
      router.replace('/login');
      toast.success('Password reset successful');
    } catch (error: any) {
      toast.error(`${error.message}`);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div className="reset-password">
      <Title title="SparkPay | Forgot Password" />
      <Head>
        <meta
          name="description"
          content="SparkPay is a payroll software as a service solution geared towards bringing ease to the process of processing, creating and running payrolls."
        />
        <meta
          name="keywords"
          content="sparkpay, payroll online, online payroll, payroll, payroll processor, payroll saas, process payroll online, payroll software as a service"
        />
        <meta name="robots" content="all" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta
          property="og:description"
          content="SparkPay is a payroll software as a service solution geared towards bringing ease to the process of processing, creating and running payrolls."
        />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/djhmpr0bv/image/upload/v1658836812/Frame_34099_pyt6ha.png"
        />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={url} />
        <meta
          property="twitter:description"
          content="SparkPay is a payroll software as a service solution geared towards bringing ease to the process of processing, creating and running payrolls."
        />
        <meta
          property="twitter:image"
          content="https://res.cloudinary.com/djhmpr0bv/image/upload/v1658836812/Frame_34099_pyt6ha.png"
        />
      </Head>
      <div className="reset-password__section">
        <h1 className="reset-password__title">Reset Password</h1>
        <p className="reset-password__subtext">
          {' '}
          Enter a new password to proceed{' '}
        </p>
        <Formik
          initialValues={{ password: '', confirmPassword: '' }}
          onSubmit={onSubmit}
          validationSchema={resetPasswordValidationSchema}
        >
          {(props) => {
            const {
              handleSubmit,
              handleChange,
              values,
              handleBlur,
              errors,
              touched,
              setErrors,
            } = props;

            return (
              <form onSubmit={handleSubmit}>
                <div className="reset-password__form-input-section">
                  <div className="reset-password__form-grid">
                    <Input
                      type="password"
                      label="Password"
                      placeholder="password"
                      name="password"
                      value={values.password}
                      onChange={(event: any) => {
                        validateConfirmPassword(
                          { ...values, password: event.target.value },
                          setErrors,
                        );
                        handleChange(event);
                      }}
                      onBlur={(event: any) => {
                        validateConfirmPassword(
                          { ...values, password: event.target.value },
                          setErrors,
                        );
                        handleBlur(event);
                      }}
                      hasError={errors.password && touched.password}
                      error={errors.password}
                    />
                  </div>
                  <Input
                    type="password"
                    label="Confirm Password"
                    placeholder="password"
                    name="confirmPassword"
                    value={values.confirmPassword}
                    onChange={(event: any) => {
                      validateConfirmPassword(
                        { ...values, confirmPassword: event.target.value },
                        setErrors,
                      );
                      handleChange(event);
                    }}
                    onBlur={(event: any) => {
                      validateConfirmPassword(
                        { ...values, confirmPassword: event.target.value },
                        setErrors,
                      );
                      handleBlur(event);
                    }}
                    hasError={errors.confirmPassword && touched.confirmPassword}
                    error={errors.confirmPassword}
                  />
                </div>
                <Button
                  label="Reset Password"
                  className="reset-password__reset-password-btn"
                  primary
                  type="submit"
                />
              </form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default ResetPassword;
