import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';
import { ChevronBack } from '@/components/svg';
import { Tab } from '@/components/Tab/tab.component';
import { TabPane } from '@/components/Tab/tabpane.component';
import Link from 'next/link';
import { EmployeesTaxViewTab } from '@/components/Organization/employees-tax-view-tab';
import { EmployeesNHFViewTab } from '@/components/Organization/employees-nhf-view-tab';
import { EmployeesPensionViewTab } from '@/components/Organization/employees-pension-view-tab';
import { useSelectedTab } from 'src/helpers/hooks/use-selected-tab';

import 'react-loading-skeleton/dist/skeleton.css';
import CountryDropdown from '@/components/Organization/organization-country-dropdown';
import { useAppSelector } from 'src/redux/hooks';

const EmployeesByCountry = (props: ReturnType<typeof useSelectedTab>) => {
  const { onTabChange, selectedTab } = props;
  const selectedCountry = useAppSelector((state) => state.selectedCountry);

  if (selectedCountry?.iso2 === 'NG') {
    return (
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
    );
  }

  return null;
};

const Employees = () => {
  const { selectedTab, onTabChange } = useSelectedTab('tax');

  return (
    <DashboardLayout fullWidth pageTitle="Tax Employees">
      <div className="view-employees">
        <div className="view-employees__header">
          <p className="view-employees__header__text">
            <Link href={`/organisations?tab=${selectedTab}`}>
              <a href={`/organisations?tab=${selectedTab}`}>
                <ChevronBack />
              </a>
            </Link>
            <span style={{ textTransform: 'capitalize' }}>{selectedTab}</span>{' '}
            Employees
          </p>

          <CountryDropdown />
        </div>

        <EmployeesByCountry
          selectedTab={selectedTab}
          onTabChange={onTabChange}
        />
      </div>
    </DashboardLayout>
  );
};

export default Employees;
