import {
  AdminManagementSvg,
  AuditTrailSvg,
  DashboardSvg,
  EmployeeSvg,
  OrganizationSettingsSvg,
  PayrollSvg,
  RemittancesSvg,
  WalletBillingsSvg,
} from '@/components/svg';
import {
  IAllowedPermissions,
  IDashboardNavigationListItem,
} from '@/components/types';
import classNames from 'classnames';
import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';
import withPermission from 'src/helpers/HOC/withPermission';

export const DashboardNavigationListItem = (
  props: IDashboardNavigationListItem,
) => {
  const className = classNames('dashboard-navigation__link', {
    active: new RegExp(props.match, 'gi').test(props.router.pathname),
  });

  return (
    <li className="dashboard-navigation__list-item">
      <Link href={props.href}>
        <a className={className}>
          <props.Icon />
          {props.title}
        </a>
      </Link>
    </li>
  );
};

export const navListItems = (
  router: NextRouter,
): (IDashboardNavigationListItem & { permissions: IAllowedPermissions })[] => [
  {
    Icon: OrganizationSettingsSvg,
    href: '/organisations',
    match: '/organisations',
    router,
    title: 'Organisations',
    permissions: [],
  },
  {
    Icon: DashboardSvg,
    href: '/overview',
    match: '(\\/overview|^\\/$)',
    router,
    title: 'Overview',
    permissions: [['Overview', 'read']],
  },
  {
    Icon: EmployeeSvg,
    href: '/employees',
    match: '/employees',
    router,
    title: 'Employees',
    permissions: [['Employee', 'read']],
  },
  {
    Icon: PayrollSvg,
    href: '/payroll',
    match: '/payroll',
    router,
    title: 'Payroll',
    permissions: [['Payroll', 'read']],
  },
  {
    Icon: WalletBillingsSvg,
    href: '/wallet',
    match: '/wallet',
    router,
    title: 'Wallet\xa0&\xa0Billings',
    permissions: [['Wallet & Billing', 'read']],
  },
  {
    Icon: AdminManagementSvg,
    href: '/administrators',
    match: '/administrators',
    router,
    title: 'Admin\xa0Management',
    permissions: [['Admin', 'read']],
  },
  {
    Icon: RemittancesSvg,
    href: '/remittances',
    match: '/remittances',
    router,
    title: 'Remittances',
    permissions: [['Remittance', 'read']],
  },
  {
    Icon: AuditTrailSvg,
    href: '/audit',
    match: '/audit',
    router,
    title: 'Audit\xa0Trail',
    permissions: [['AuditTrail', 'read']],
  },
];

export const NavList = () => {
  const router = useRouter();

  return (
    <ul className="dashboard-navigation__list">
      {navListItems(router).map((item) => {
        const Comp = withPermission(
          DashboardNavigationListItem,
          ...item.permissions,
        );
        return <Comp key={item.href} {...item} />;
      })}
    </ul>
  );
};
