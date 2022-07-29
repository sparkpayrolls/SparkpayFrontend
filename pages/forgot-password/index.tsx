import { Formik, FormikHelpers } from 'formik';
import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import React from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { useTawkto } from 'src/helpers/hooks/use-tawkto';
import { forgotPasswordValidationSchema } from 'src/helpers/validation';
import { Title, useUrl } from 'src/layouts/default-layout/DefaultLayout';
import { useAppSelector } from 'src/redux/hooks';
import { Button } from '../../src/components/Button/Button.component';
import { Input } from '../../src/components/Input/Input.component';

type IForgotPassword = {
  email: string;
};

const ForgetPassword: NextPage = () => {
  const { user } = useAppSelector((state) => state);
  const router = useRouter();
  const { url } = useUrl();

  useTawkto();

  if (user) {
    router.replace('/');
    return null;
  }
  const onSubmit = async (
    values: IForgotPassword,
    actions: FormikHelpers<IForgotPassword>,
  ) => {
    try {
      actions.setSubmitting(true);
      await $api.auth.forgotPassword(values.email);
      const url = stringifyUrl({
        url: '/check-inbox',
        query: { action: 'forgot-password' },
      });
      router.replace(url);
    } catch (error: any) {
      toast.error(`${error.message}`);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <div className="forget-password">
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
      <div className="forget-password__section">
        <h1 className="forget-password__title">Forget Password</h1>
        <p className="forget-password__subtext">
          Enter your email address to reset password
        </p>
        <Formik
          initialValues={{ email: '' }}
          onSubmit={onSubmit}
          validationSchema={forgotPasswordValidationSchema}
        >
          {(props) => {
            const {
              handleSubmit,
              handleChange,
              values,
              handleBlur,
              errors,
              touched,
            } = props;
            return (
              <form onSubmit={handleSubmit}>
                <div className="forget-password__email-input">
                  <Input
                    type="email"
                    label="Email Address"
                    placeholder="Email Address"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    hasError={errors.email && touched.email}
                    error={errors.email}
                  />
                </div>
                <Button
                  label="Recover Password"
                  onClick={() => {}}
                  className="forget-password__recover-password-btn"
                  primary
                  type="submit"
                />
              </form>
            );
          }}
        </Formik>
        <div>
          <Link href="/login">
            <a className="forget-password__go-back-login">Back to Log In</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
