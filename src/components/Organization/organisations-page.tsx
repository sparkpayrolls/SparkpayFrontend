import Head from 'next/head';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import { useRef } from 'react';
import withAuth from 'src/helpers/HOC/withAuth';
import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';
import { CreateOrganisationButton } from '../Button/create-organisation-button.component';
import { Tab } from '../Tab/tab.component';
import InvitationTab from './invitation-tab';
import { OrganizationTabPane } from './organization-tabpane';

const validTabs = ['organisations', 'invitations'];
const OrganisationPageUnSecured = () => {
  const trigger = useRef<string>();
  const router = useRouter();

  const tab = router.query.tab as string;
  const activeTab = validTabs.includes(tab) ? tab : validTabs[0];

  const onTabChange = (tab: string) => {
    const { pathname, query } = router;
    const url = stringifyUrl({
      url: pathname,
      query: { ...query, tab },
    });

    router.push(url);
  };

  return (
    <>
      <DashboardLayout pageTitle="Organisations">
        <div className="organisation">
          <Head>
            <title>Organisations</title>
          </Head>
          <div className="employee-section__head">
            <h1 className="employee-section__title">Organisations</h1>

            <CreateOrganisationButton
              onCreate={(org) => (trigger.current = org.id)}
            />
          </div>
          <Tab
            onChange={onTabChange}
            active={activeTab}
            default="organizations"
          >
            <Tab.TabPane tab="Organisations" key="organisations">
              <OrganizationTabPane trigger={trigger.current} />
            </Tab.TabPane>
            <Tab.TabPane tab="Invitations" key="invitations">
              <InvitationTab />
            </Tab.TabPane>
          </Tab>
        </div>
      </DashboardLayout>
    </>
  );
};

export const OrganisationPage = withAuth(OrganisationPageUnSecured);
