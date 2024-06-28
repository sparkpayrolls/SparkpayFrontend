import {
  AdminManagementSvg,
  AuditTrailSvg,
  DashboardSvg,
  EmployeeSvg,
  OrganizationSettingsSvg,
  PayrollSvg,
  // RemittancesSvg,
  WalletBillingsSvg,
} from '@/components/svg';
import {
  IAllowedPermissions,
  IDashboardNavigationListItem,
} from '@/components/types';
import classNames from 'classnames';
import Link from 'next/link';
import { NextRouter, useRouter } from 'next/router';
import { Administrator } from 'src/api/types';
import withPermission from 'src/helpers/HOC/withPermission';
import { useAppSelector } from 'src/redux/hooks';

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
  administrator: Administrator | null,
): (IDashboardNavigationListItem & { permissions: IAllowedPermissions })[] => [
  {
    Icon: DashboardSvg,
    href: '/overview',
    match: '(\\/overview|^\\/$)',
    router,
    title: 'Overview',
    permissions: [['Overview', 'read']],
  },
  {
    Icon: OrganizationSettingsSvg,
    href: '/organisations',
    match: '/organisations',
    router,
    title: administrator ? 'Organisation' : 'Organisations',
    permissions: administrator ? [['Company', 'read']] : [],
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
    href: '/transactions',
    match: '/transactions',
    router,
    title: 'Transactions',
    permissions: [['Transaction', 'read']],
  },
  {
    Icon: AdminManagementSvg,
    href: '/administrators',
    match: '/administrators',
    router,
    title: 'Admin\xa0Management',
    permissions: [['Admin', 'read']],
  },
  // {
  //   Icon: RemittancesSvg,
  //   href: '/remittances',
  //   match: '/remittances',
  //   router,
  //   title: 'Remittances',
  //   permissions: [['Remittance', 'read']],
  // },
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
  const administrator = useAppSelector((state) => state.administrator);

  return (
    <ul className="dashboard-navigation__list">
      {navListItems(router, administrator).map((item) => {
        const Comp = withPermission(
          DashboardNavigationListItem,
          ...item.permissions,
        );
        return <Comp key={item.href} {...item} />;
      })}
    </ul>
  );
};
