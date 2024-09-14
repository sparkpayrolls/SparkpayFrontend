import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';
import { ChevronBack } from '@/components/svg';
import { useRouter } from 'next/router';
import { Tab } from '@/components/Tab/tab.component';
import { stringifyUrl } from 'query-string';
import { TabPane } from '@/components/Tab/tabpane.component';
import Link from 'next/link';
import { EmployeesTaxViewTab } from '@/components/Organization/employees-tax-view-tab';
import { EmployeesNHFViewTab } from '@/components/Organization/employees-nhf-view-tab';
import { EmployeesPensionViewTab } from '@/components/Organization/employees-pension-view-tab';

import 'react-loading-skeleton/dist/skeleton.css';

const Employees = () => {
  const router = useRouter();
  const { tab } = router.query;

  const onTabChange = (tab: string) => {
    const { pathname, query } = router;
    const url = stringifyUrl({
      url: pathname,
      query: { ...query, tab },
    });

    router.push(url);
  };
  const selectedTab = Array.isArray(tab) ? tab[0] : tab || 'Tax';

  return (
    <DashboardLayout fullWidth pageTitle="Tax Employees">
      <div className="view-employees">
        <div className="view-employees__header">
          <p className="view-employees__header__text">
            <Link href={`/organisations?tab=${selectedTab}`}>
              <a>
                <ChevronBack />
              </a>
            </Link>
            <span style={{ textTransform: 'capitalize' }}>{selectedTab}</span>{' '}
            Employees
          </p>
        </div>

        <Tab onChange={onTabChange} active={selectedTab} default={'tax'}>
          <TabPane key="tax" tab="Tax Employees">
            <EmployeesTaxViewTab />
          </TabPane>
          <TabPane key="nhf" tab="NHF Employees">
            <EmployeesNHFViewTab />
          </TabPane>
          <TabPane key="pension" tab="Pension Employees">
            <EmployeesPensionViewTab />
          </TabPane>
        </Tab>
      </div>
    </DashboardLayout>
  );
};

export default Employees;
