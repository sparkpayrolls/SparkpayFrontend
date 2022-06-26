import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { PropsWithChildren } from 'react';
import auth_frame from '../../../public/svgs/auth-frame.svg';
import logo_white from '../../../public/svgs/logo-white.svg';
import logo from '../../../public/svgs/logo.svg';
import { IAuthLayout } from './auth-layout-types';

export const AuthLayout = (props: PropsWithChildren<IAuthLayout>) => {
  return (
    <div className="login">
      <Head>
        <title>{props.title}</title>
        <meta name="description" content={props.description} />
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
