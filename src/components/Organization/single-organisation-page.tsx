import NiceModal from '@ebay/nice-modal-react';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { $api } from 'src/api';
import { Company, Country } from 'src/api/types';
import withAuth from 'src/helpers/HOC/withAuth';
import useApiCall from 'src/helpers/hooks/useapicall.hook';
import { Util } from 'src/helpers/util';
import DashboardLayout from 'src/layouts/dashboard-layout/DashBoardLayout';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { refreshCompanies } from 'src/redux/slices/companies/companies.slice';
import { SingleDetail } from '../Employee/single-detail.component';
import { NotFound } from '../Misc/not-found.component';
import { OrganisationDetailsModal } from '../Modals/OrganisationDetailsModal.component';

const OrganisationDetailsUnsecured = () => {
  const administrator = useAppSelector((state) => state.administrator);
  const [loading, apiCallStarted, apiCallDone] = useApiCall();
  const [organization, setOrganization] = useState<Company | null>();
  const dispatch = useAppDispatch();
  const organisationId = (administrator?.company as Company)?.id;
  const canEdit = Util.canActivate([['Company', 'write']], administrator);

  const getOrganization = useCallback(async () => {
    try {
      apiCallStarted();
      if (!organisationId) {
        return;
      }

      const organization = await $api.company.getCompanyById(organisationId);
      setOrganization(organization);
    } catch (error) {
      Util.onNonAuthError(error, (httpError) => {
        if (httpError.status === 404) {
          setOrganization(null);
          return;
        }

        toast.error(httpError.message);
      });
    } finally {
      apiCallDone();
    }
  }, [organisationId, apiCallStarted, apiCallDone]);

  const onEditDetails = async () => {
    if (canEdit) {
      NiceModal.show(OrganisationDetailsModal, {
        organization,
      }).then(() => {
        getOrganization();
        refreshCompanies(dispatch);
      });
    }
  };

  useEffect(() => {
    getOrganization();
  }, [getOrganization]);

  return (
    <DashboardLayout loading={loading} pageTitle="Organisation Details">
      <div className="organisation-details">
        <div className=" organisation-details__organisation-details-container">
          <div className="organisation-details__organisation-details-header">
            <h5 className="organisation-details__organisation-header">
              Organisation Details
            </h5>
          </div>
          <div>
            {!loading && !!organization && canEdit && (
              <button
                className="organisation-details__organisation-button"
                onClick={onEditDetails}
              >
                Edit Details
              </button>
            )}
          </div>
        </div>
        {organization === null && (
          <div className="employee-details__not-found">
            <NotFound message="Organization not found" />
          </div>
        )}
        {!!organization && (
          <>
            <div className="organisation-details__single-details-container">
              <div className="organisation-details__organisation-settings-flex">
                <div>
                  <SingleDetail title="Name" details={organization.name} />
                </div>
                <div>
                  <SingleDetail
                    title="Logo"
                    details={
                      organization.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={organization.logo} alt="company-logo" />
                      ) : (
                        'N/A'
                      )
                    }
                  />
                </div>
                <div>
                  <SingleDetail
                    title="Phone Number"
                    details={organization.phonenumber}
                  />
                </div>
              </div>
              <hr />

              <div className="organisation-details__organisation-settings-flex">
                <div>
                  <SingleDetail
                    title="Email Address"
                    details={organization.email}
                  />
                </div>
                <div>
                  <SingleDetail
                    title="Country"
                    details={(organization.country as Country)?.name}
                  />
                </div>
                <div>
                  <SingleDetail
                    title="Date Created"
                    details={moment(organization.createdAt).format(
                      'MMMM DD, YYYY',
                    )}
                  />
                </div>
              </div>
              {!!organization.salaryBreakdown?.length && (
                <>
                  <hr />
                  <div>
                    <h5 className="organisation-details__organisation-header salary-breakdown">
                      Salary Breakdown
                    </h5>
                    <div className="organisation-details__organisation-settings-flex organisation-details__organisation-settings-flex--salary-breakdown">
                      {organization.salaryBreakdown?.map((breakdown, i) => {
                        return (
                          <div key={i}>
                            <SingleDetail
                              title={breakdown.name}
                              details={`${breakdown.value}%`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export const OrganisationDetail = withAuth(OrganisationDetailsUnsecured, [
  'Company',
  'read',
]);
