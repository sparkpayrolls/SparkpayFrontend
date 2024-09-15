import React from 'react';
import { Tab } from '../Tab/tab.component';
import { TabPane } from '../Tab/tabpane.component';
import TaxTab from './tax-tab';
import { NhfTab } from './nhf-tab';
import { PensionTab } from './pension-tab';
import { useOrganizationDetails } from 'src/helpers/hooks/use-org-details';
import Skeleton from 'react-loading-skeleton';
import { useSelectedTab } from 'src/helpers/hooks/use-selected-tab';

export type RemittanceInformationProps = {
  organizationDetails: ReturnType<typeof useOrganizationDetails>;
};

function RemittanceInformation(props: RemittanceInformationProps) {
  const { selectedTab, onTabChange } = useSelectedTab('tax');

  return (
    <div className="info__remittance">
      <div>
        <div className="info__remittance__form__header">
          <p>Remittance Information</p>
        </div>

        {!props.organizationDetails.organization && (
          <Skeleton width="100%" height={334} />
        )}
        {props.organizationDetails.organization && (
          <Tab default={'tax'} active={selectedTab} onChange={onTabChange}>
            <TabPane key="tax" tab="Tax">
              <TaxTab organizationDetails={props.organizationDetails} />
            </TabPane>
            <TabPane key="nhf" tab="NHF">
              <NhfTab organizationDetails={props.organizationDetails} />
            </TabPane>
            <TabPane key="pension" tab="Pension">
              <PensionTab organizationDetails={props.organizationDetails} />
            </TabPane>
          </Tab>
        )}
      </div>
    </div>
  );
}

export default RemittanceInformation;
