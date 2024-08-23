import { useEffect } from 'react';
import { Container } from '@/components/Shared/container.component';
import { BackSVG } from '@/components/svg';
import Head from 'next/head';
import Link from 'next/link';
import { PropsWithChildren } from 'react';
import { Title, useUrl } from '../default-layout/DefaultLayout';
import PayrollScrollState from '../../components/Payroll/payroll-scroll-state';


const DashboardHeader = (props: { title: string }) => {
  const { url } = useUrl();



  return (
    <>
      <Title title={props.title || 'SparkPay | Payroll with ease'} />
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
    </>
  );
};

const DashboardLayoutV2 = (
  props: PropsWithChildren<{
    title: string;
    href?: string;
    action?(): any;
    loading?: boolean;
    getScroll?:any,
  }>,
) => {
  if (typeof window === 'undefined') {
    return <DashboardHeader title={props.title} />;
  }

  useEffect(() => {
    if (props.getScroll) {
      console.log('Adding scroll event listener');
      window.addEventListener('scroll', props.getScroll);

      return () => {
        console.log('Removing scroll event listener');
        window.removeEventListener('scroll', props.getScroll);
      };
    }
  }, [props.getScroll]);

  return (
    <>
      <DashboardHeader title={props.title} />

      <Container loading={props.loading} className="dashboard-layout-v2">
        <div className="dashboard-layout-v2__body">
          <Container>
            {props.href && !props.action && (
              <Link href={props.href}>
                <a className="dashboard-layout-v2__back-button">
                  <BackSVG />
                </a>
              </Link>
            )}
            {props.action && (
              <button
                onClick={props.action}
                className="dashboard-layout-v2__back-button"
              >
                <BackSVG />
              </button>
            )}
          </Container>
          <div className="dashboard-layout-v2__content" onScroll={props.getScroll}>
            {props.children} 
          </div>
        </div>
      </Container>
    </>
  );
};

export default DashboardLayoutV2;
