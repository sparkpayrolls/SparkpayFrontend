import Head from 'next/head';
import type { NextPage } from 'next';
import DashboardLayout from '../../src/layouts/dashboard-layout/DashBoardLayout';
import { useRef } from 'react';
import withAuth from 'src/helpers/HOC/withAuth';
import { CreateOrganisationButton } from '@/components/Button/create-organisation-button.component';
import InvitationTab from '../../src/components/Organization/invitation-tab';
import { OrganizationTabPane } from '@/components/Organization/organization-tabpane';
import { Tab } from '@/components/Tab/tab.component';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';

const validTabs = ['organisations', 'invitations'];
const OrganizationSettings: NextPage = () => {
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

            {/* <div className="employee-section__employee-button"> */}
            <CreateOrganisationButton
              onCreate={(org) => (trigger.current = org.id)}
            />
            {/* </div> */}
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

export default withAuth(OrganizationSettings);
