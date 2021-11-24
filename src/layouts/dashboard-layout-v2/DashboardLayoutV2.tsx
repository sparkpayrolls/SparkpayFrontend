import { BackSVG } from '@/components/svg';
import Head from 'next/head';
import Link from 'next/link';
import { PropsWithChildren } from 'react';

const DashboardLayoutV2 = (
  props: PropsWithChildren<{ title: string; href?: string; action?(): any }>,
) => {
  return (
    <>
      <Head>
        <title>{props.title}</title>
      </Head>

      <div className="dashboard-layout-v2">
        <div className="dashboard-layout-v2__content">
          {props.href && !props.action && (
            <Link href={props.href}>
              <a href="" className="dashboard-layout-v2__content__back-button">
                <BackSVG />
              </a>
            </Link>
          )}
          {props.action && (
            <button
              onClick={props.action}
              className="dashboard-layout-v2__content__back-button"
            >
              <BackSVG />
            </button>
          )}
          {props.children}
        </div>
      </div>
    </>
  );
};

export default DashboardLayoutV2;
