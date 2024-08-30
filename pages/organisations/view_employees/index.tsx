import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';
import { useOrganizationDetails } from 'src/helpers/hooks/use-org-details';
import { ChevronBack } from '@/components/svg';
import { useRouter } from 'next/router';
import { Tab } from '@/components/Tab/tab.component';
import { stringifyUrl } from 'query-string';
import { TabPane } from '@/components/Tab/tabpane.component';
import Link from 'next/link';
import EmployeesTaxViewTab from '@/components/Organization/employees-tax-view-tab';

const Employees = () => {
  const router = useRouter();
  const { loading } = useOrganizationDetails();
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
    <DashboardLayout
      customWidth="100%"
      loading={loading}
      pageTitle="Tax Employees"
    >
      <div className="view-employees">
        <div className="view-employees__header">
          <p className="view-employees__header__text">
            <Link href={'/organisations'}>
              <a>
                <ChevronBack />
              </a>
            </Link>
            {selectedTab} Employees
          </p>
        </div>

        <Tab onChange={onTabChange} active={selectedTab} default={'Tax'}>
          <TabPane key="Tax" tab="Tax Employees">
            <EmployeesTaxViewTab />
          </TabPane>
          <TabPane key="NHF" tab="NHF Employees"></TabPane>
          <TabPane key="Pension" tab="Pension Employees"></TabPane>
        </Tab>
      </div>
    </DashboardLayout>
  );
};

export default Employees;
