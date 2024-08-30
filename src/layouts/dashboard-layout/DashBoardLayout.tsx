import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { ReactNode, useState } from 'react';
import {
  OrganizationsMenu,
  ProfileMenu,
} from '@/components/KebabMenu/KebabMenu.component';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { IImageLoader } from '@/components/types';
import { Administrator, Company, Role } from 'src/api/types';
import { HttpError } from 'src/api/repo/http.error';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { logOut } from 'src/redux/slices/user/user.slice';
import { NavList } from './dashboard-navigation-list';
import { useRouter } from 'next/router';
import { Util } from 'src/helpers/util';
import { MenuOutlined } from '@ant-design/icons';
import { Drawer } from 'antd';
import Logo from '../../../public/svgs/logo.svg';
import close from '../../../public/svgs/Close.svg';
import classNames from 'classnames';
import { getCurrentAdministrator } from 'src/redux/slices/administrator/administrator.slice';
import { Title, useUrl } from '../default-layout/DefaultLayout';

interface Props {
  children?: ReactNode;
  pageTitle: string;
  customWidth?: string;
  loading?: boolean;
}

const DashboardHeader = ({ pageTitle }: { pageTitle: string }) => {
  const { url } = useUrl();
  return (
    <>
      <Title title={pageTitle || 'SparkPay | Payroll with ease'} />
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

// eslint-disable-next-line no-undef
const DashboardLayout: React.FC<Props> = ({
  children,
  pageTitle,
  customWidth,
  loading,
}: Props) => {
  const { user, companies, administrator } = useAppSelector((state) => state);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loadingCompanySelect, setLoadingCompanySelect] = useState('');
  const [visibleDrawer, setVisibleDrawer] = useState<boolean>(false);
  const topBarClassName = classNames('dashboardLayout__top-bar', {
    'line-loader': loading,
  });

  const selectedCompany = companies.find((company) => company.selected);
  const userRole = selectedCompany?.isRoot
    ? 'Owner'
    : (selectedCompany?.role as Role)?.name;
  const profileMenuActions = [
    { name: 'Profile', href: '/profile' },
    {
      name: 'Logout',
      action() {
        logOut(dispatch);
        Util.redirectToLogin(router);
      },
    },
  ];

  const handleSelect = async (_administrator: Administrator) => {
    try {
      const company = _administrator.company as Company;
      setLoadingCompanySelect(company.id);
      if (_administrator.id === administrator?.id) {
        await $api.company.unselectCompany(company.id);
      } else {
        await $api.company.selectCompany(company.id);
      }
      await getCurrentAdministrator(dispatch);
    } catch (error) {
      const err = error as HttpError;
      toast.error(`error toggling company - ${err.message}`);
    } finally {
      setLoadingCompanySelect('');
    }
  };

  const showDrawer = () => {
    setVisibleDrawer(true);
  };

  const onClose = () => {
    setVisibleDrawer(false);
  };

  if (typeof window === 'undefined') {
    return <DashboardHeader pageTitle={pageTitle} />;
  }

  return (
    <>
      <DashboardHeader pageTitle={pageTitle} />
      <div className="dashboardLayout">
        <nav className="dashboard-navigation">
          <Link href="/">
            <a className="dashboard-navigation__brand">
              <Image src={Logo} alt="logo" />
            </a>
          </Link>

          <NavList />

          <div className="dashboard-navigation__profile">
            <ProfileMenu
              name={`${user?.firstname} ${user?.lastname}`}
              role={userRole}
              avatar={user?.avatar}
              actions={profileMenuActions}
            />
          </div>
        </nav>

        <div className="dashboardLayout__logo">
          <Link href="/">
            <a>
              <Image src={Logo} alt="logo" />
            </a>
          </Link>
        </div>

        <div className={topBarClassName}>
          {/* <div
            style={{ display: 'flex', alignItems: 'center', columnGap: '1rem' }}
          > */}
          <button
            className="dashboardLayout__top-bar--menu-btn"
            onClick={showDrawer}
          >
            <MenuOutlined />
          </button>

          {/* </div> */}

          {/* <div>Hello</div> */}

          <OrganizationsMenu
            companies={companies}
            onSelect={handleSelect}
            loading={loadingCompanySelect}
            administrator={administrator}
          />
        </div>

        <main
          style={{ maxWidth: `${customWidth}` }}
          className="dashboardLayout__body"
        >
          {children}
        </main>
      </div>

      <Drawer
        placement="left"
        closable
        onClose={onClose}
        closeIcon={<CustomClose />}
        visible={visibleDrawer}
        key="left"
        className="drawer-menu"
      >
        <nav className="dashboard-navigation">
          <NavList />

          <div className="dashboard-navigation__profile">
            <ProfileMenu
              name={`${user?.firstname} ${user?.lastname}`}
              role={userRole}
              avatar={user?.avatar}
              actions={profileMenuActions}
            />
          </div>
        </nav>
      </Drawer>
    </>
  );
};

const CustomClose = () => <Image src={close} alt="close icon" />;

export default DashboardLayout;

export const ImageLoader = (props: IImageLoader) => {
  return (
    <Image
      loader={(props) => `${props.src}?width=${props.width}`}
      src={props.src}
      alt={props.alt}
      width={props.width}
      height={props.height}
    />
  );
};
