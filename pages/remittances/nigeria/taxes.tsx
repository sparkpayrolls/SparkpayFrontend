import { NextPage } from 'next';
import withAuth from 'src/helpers/HOC/withAuth';
import DashboardLayoutV2 from 'src/layouts/dashboard-layout-v2/DashboardLayoutV2';
import { Tab } from '@/components/Tab/tab.component';
import { Text } from '@/components/Typography/Text';
import { Container } from '@/components/Shared/container.component';
import { TaxPane } from '@/components/remittances/nigeria/taxpane.component';

const Tax: NextPage = () => {
  return (
    <DashboardLayoutV2 title="Tax" href="/remittances">
      <Container className="nigerian-tax">
        <Text
          className="nigerian-tax__page-title text__page-title"
          element="h1"
          text="Tax"
        />

        <Tab>
          <Tab.TabPane tab="Settings" key="settings">
            <TaxPane />
          </Tab.TabPane>
          <Tab.TabPane key="groups" tab="Groups"></Tab.TabPane>
        </Tab>
      </Container>
    </DashboardLayoutV2>
  );
};

export default withAuth(Tax, ['Remittance', 'read']);
