import { NextPage } from 'next';
import withAuth from 'src/helpers/HOC/withAuth';
import DashboardLayoutV2 from 'src/layouts/dashboard-layout-v2/DashboardLayoutV2';
import { Tab } from '@/components/Tab/tab.component';
import { Text } from '@/components/Typography/Text';
import { Container } from '@/components/Shared/container.component';
import { TaxSettings } from '@/components/remittances/nigeria/taxpane.component';
import {
  ITaxGroupRef,
  TaxGroup,
} from '@/components/remittances/nigeria/taxgroup.component';
import { Button } from '@/components/Button/Button.component';
import NiceModal from '@ebay/nice-modal-react';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import { TaxGroupModal } from '@/components/Modals/TaxGroupModal.component';
import { useRef } from 'react';

const Tax: NextPage = () => {
  const router = useRouter();
  const groupRef = useRef<ITaxGroupRef>();
  const { tab } = router.query;
  const selectedTab = Array.isArray(tab) ? tab[0] : tab || 'settings';
  const onTabChange = (tab: string) => {
    const { pathname, query } = router;
    const url = stringifyUrl({
      url: pathname,
      query: { ...query, tab },
    });

    router.push(url);
  };

  if (!router.isReady) {
    return null;
  }

  return (
    <DashboardLayoutV2 title="Tax" href="/remittances">
      <Container className="nigerian-tax">
        <div className="nigerian-tax__header">
          <Text
            className="nigerian-tax__page-title text__page-title"
            element="h1"
          >
            Tax
          </Text>

          <Button
            type="button"
            className="nigerian-tax__button"
            onClick={() =>
              NiceModal.show(TaxGroupModal).then(
                groupRef.current?.refreshGroups,
              )
            }
            primary
            label={'Create Tax Group'}
          />
        </div>

        <Tab onChange={onTabChange} active={selectedTab} default="settings">
          <Tab.TabPane tab="Settings" key="settings">
            <TaxSettings />
          </Tab.TabPane>
          <Tab.TabPane key="groups" tab="Groups">
            <TaxGroup getRef={(ref) => (groupRef.current = ref)} />
          </Tab.TabPane>
        </Tab>
      </Container>
    </DashboardLayoutV2>
  );
};

export default withAuth(Tax, ['Remittance', 'read']);
