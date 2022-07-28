import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import inbox from '../../public/svgs/letter.svg';
import { NextRouter, useRouter } from 'next/router';
import { $api } from 'src/api';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { AppDispatch } from 'src/redux/store';
import Cookies from 'js-cookie';
import { commitUser } from 'src/redux/slices/user/user.slice';
import { useTawkto } from 'src/helpers/hooks/use-tawkto';
import { Title, useUrl } from 'src/layouts/default-layout/DefaultLayout';

type CheckInboxAction = 'verify-email';

const processMessageAndFineprint = (
  action: CheckInboxAction,
  dispatch: AppDispatch,
  router: NextRouter,
) => {
  const logout = () => {
    Cookies.remove('auth_token');
    dispatch(commitUser(null));
    router.replace('/login');
  };

  const resendVerificationLink = async () => {
    try {
      await $api.auth.resendEmailVerification();
      toast.success('Email verification link resent successfully.');
    } catch (error) {
      toast.error('Error triggering resend.');
    }
  };

  switch (action) {
    case 'verify-email':
      return {
        message: 'An email verification link has been sent to your inbox',
        fineprint: (
          <>
            Didn&apos;t get it?{' '}
            <a onClick={resendVerificationLink}>resend now</a> or{' '}
            <a onClick={logout}>logout</a>
          </>
        ),
      };
    default:
      return {
        message: 'A password reset link has been sent to your inbox',
        fineprint: (
          <>
            back to{' '}
            <Link href="/login">
              <a>login</a>
            </Link>
          </>
        ),
      };
  }
};

const CheckInbox: NextPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useAppSelector((state) => state);
  const action = router.query.action as CheckInboxAction;
  const { message, fineprint } = processMessageAndFineprint(
    action,
    dispatch,
    router,
  );
  const { url } = useUrl();

  useTawkto();

  if (action === 'verify-email' && !user) {
    router.replace('/login');
    return null;
  }

  if (action === 'verify-email' && user?.emailVerified) {
    router.replace('/');
    return null;
  }

  return (
    <div className="check-inbox">
      <Title title="SparkPay | Check Inbox" />
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
      <div className="check-inbox__content">
        <h1 className="check-inbox__title">Check Your Inbox</h1>
        <p className="check-inbox__subtext"> {message} </p>
        <Image
          src={inbox}
          alt="Picture of the inbox email"
          className="check-inbox__inbox-img"
        />
        <div>
          {fineprint}
          {/* <p className="check-inbox__resend-now-subtext">Resend Now</p> */}
        </div>
      </div>
    </div>
  );
};
export default CheckInbox;
