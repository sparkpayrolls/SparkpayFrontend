import React from 'react';
import { Tab } from '../Tab/tab.component';
import { useRouter } from 'next/router';
import { stringifyUrl } from 'query-string';
import { TabPane } from '../Tab/tabpane.component';
import TaxTab from './tax-tab';
import { NhfTab } from './nhf-tab';
import { PensionTab } from './pension-tab';
type InfoProp = {
  viewEmployees: any;
};
function RemittanceInformation(props: InfoProp) {
  const { viewEmployees } = props;
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

  const selectedTab = Array.isArray(tab) ? tab[0] : tab || 'tax';

  return (
    <div className="info__remittance">
      <div>
        <div className="info__remittance__header">
          <p> Remittance Information</p>
        </div>
        <div className="info__remittance__cont">
          <Tab default={'tax'} active={selectedTab} onChange={onTabChange}>
            <TabPane key="tax" tab="Tax">
              <TaxTab viewEmployees={viewEmployees} />
            </TabPane>
            <TabPane key="nhf" tab="NHF">
              <NhfTab viewEmployees={viewEmployees} />
            </TabPane>
            <TabPane key="pension" tab="Pension">
              <PensionTab viewEmployees={viewEmployees} />
            </TabPane>
          </Tab>
        </div>
      </div>
    </div>
  );
}

export default RemittanceInformation;
