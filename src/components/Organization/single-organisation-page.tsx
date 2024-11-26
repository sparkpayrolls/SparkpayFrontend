import withAuth from 'src/helpers/HOC/withAuth';
import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';
import { NotFound } from '../Misc/not-found.component';
import OrganizationInfo from './organization-info';
import SalaryBreakdown from './salary-breakdown';
import { useOrganizationDetails } from 'src/helpers/hooks/use-org-details';
import RemittanceInformation from './remittance-information';
import CountryDropdown from './organization-country-dropdown';

const OrganisationDetailsUnsecured = () => {
  const organizationDetails = useOrganizationDetails();
  const { loading, organization } = organizationDetails;

  return (
    <DashboardLayout loading={loading} pageTitle="Organisation Details">
      <div className="organisation-details">
        <div className=" organisation-details__organisation-details-container">
          <div className="organisation-details__organisation-details-header">
            <h5 className="organisation-details__organisation-header">
              Organisation Details
            </h5>
            <CountryDropdown />
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
              <OrganizationInfo organizationDetails={organizationDetails} />
              <SalaryBreakdown organizationDetails={organizationDetails} />
            </div>
            <RemittanceInformation organizationDetails={organizationDetails} />
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
