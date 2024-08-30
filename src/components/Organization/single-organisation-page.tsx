import withAuth from 'src/helpers/HOC/withAuth';
import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';
import { NotFound } from '../Misc/not-found.component';
import OrganizationInfo from './organization-info';
import SalaryBreakdown from './salary-breakdown';
import { useOrganizationDetails } from 'src/helpers/hooks/use-org-details';
import RemittanceInformation from './remittance-information';
import { useState } from 'react';
import { ChevronBack } from '../svg';

const OrganisationDetailsUnsecured = () => {
  const { loading, organization } = useOrganizationDetails();
  const [viewEmployees, setViewEployees] = useState<boolean>(false);

  return viewEmployees ? (
    <DashboardLayout
      customWidth="100%"
      loading={loading}
      pageTitle="Organisation Details"
    >
      <div className="organisation-details">
        <div className=" organisation-details__organisation-details-container">
          <div className="organisation-details__organisation-details-header">
            <h5 className="organisation-details__organisation-header">
              <span onClick={() => setViewEployees(false)}>
                {' '}
                <ChevronBack />{' '}
              </span>{' '}
              Tax Eployees
            </h5>
          </div>
        </div>
        {organization === null && (
          <div className="employee-details__not-found">
            <NotFound message="Organization not found" />
          </div>
        )}
      </div>
    </DashboardLayout>
  ) : (
    <DashboardLayout
      customWidth=""
      loading={loading}
      pageTitle="Organisation Details"
    >
      <div className="organisation-details">
        <div className=" organisation-details__organisation-details-container">
          <div className="organisation-details__organisation-details-header">
            <h5 className="organisation-details__organisation-header">
              Organisation Details
            </h5>
          </div>
        </div>
        {organization === null && (
          <div className="employee-details__not-found">
            <NotFound message="Organization not found" />
          </div>
        )}
        {!!organization && (
          <div className="organization-settings">
            <div className="organization-settings__flex">
              <OrganizationInfo />
              <SalaryBreakdown />
            </div>
            <RemittanceInformation viewEmployees={setViewEployees} />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export const OrganisationDetail = withAuth(OrganisationDetailsUnsecured, [
  'Company',
  'read',
]);
