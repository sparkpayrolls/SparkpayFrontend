import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { PropsWithChildren } from 'react';
import { useTawkto } from 'src/helpers/hooks/use-tawkto';
import auth_frame from '../../../public/svgs/auth-frame.svg';
import logo_white from '../../../public/svgs/logo-white.svg';
import logo from '../../../public/svgs/logo.svg';
import { Title, useUrl } from '../default-layout/DefaultLayout';
import { IAuthLayout } from './auth-layout-types';

export const AuthLayout = (props: PropsWithChildren<IAuthLayout>) => {
  const { url } = useUrl();
  useTawkto();

  return (
    <div className="login">
      <Title title={props.title || 'SparkPay | Payroll with ease'} />
      <Head>
        <meta
          name="description"
          content={
            props.description ||
            'SparkPay is a payroll software as a service solution geared towards bringing ease to the process of processing, creating and running payrolls.'
          }
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
      <div className="login__side-info">
        <Link href="/">
          <a className="login__side-info--logo">
            <Image src={logo_white} alt="logo" />
          </a>
        </Link>

        <div className="login__side-info--graphics">
          <Image src={auth_frame} alt="graphics svg" />
        </div>

        <div className="login__side-info--txt-area">
          <h3 className="login__side-info--text">
            Simple and Effective Payroll Management
          </h3>
          <p className="login__side-info--subtext">
            Ease from payroll stress and manual computation through a
            synchronised and automated payroll system.
          </p>
        </div>
        <div className="login__side-info--gradient"></div>
        <div className="login__side-info--ellipse"></div>
      </div>

      <div className="login__container">
        <div className="login__section">
          <Link href="/">
            <a className="login__section--logo">
              <Image src={logo} alt="logo" />
            </a>
          </Link>

          {props.children}
        </div>
      </div>
    </div>
  );
};
