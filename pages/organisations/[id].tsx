import type { NextPage } from 'next';
import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import useApiCall from 'src/helpers/hooks/useapicall.hook';
import { useAppDispatch } from 'src/redux/hooks';
import DashboardLayout from '../../src/layouts/dashboard-layout/DashBoardLayout';
import BackIcon from '../../public/svgs/backicon.svg';
import { Company, Country } from 'src/api/types';
import withAuth from 'src/helpers/HOC/withAuth';
import { HttpError } from 'src/api/repo/http.error';
import { $api } from 'src/api';
import { ISingleDetail } from '@/components/Employee/single-detail.component';
import { refreshCompanies } from 'src/redux/slices/companies/companies.slice';

// @ts-ignore
const NotFound = dynamic<any>(() => {
  return import('@/components/Misc/not-found.component').then(
    (mod) => mod.NotFound,
  );
});
// @ts-ignore
const SingleDetail = dynamic<ISingleDetail>(() => {
  return import('@/components/Employee/single-detail.component').then(
    (mod) => mod.SingleDetail,
  );
});
// @ts-ignore
const OrganisationDetailsModal = dynamic(() => {
  return import('@/components/Modals/OrganisationDetailsModal.component').then(
    (mod) => mod.OrganisationDetailsModal,
  );
});

const OrganisationDetails: NextPage = () => {
  const router = useRouter();
  const [loading, apiCallStarted, apiCallDone] = useApiCall();
  const [organization, setOrganization] = useState<Company | null>();
  const [createdDateFormatted, setCreatedDateFormatted] = useState('');
  const dispatch = useAppDispatch();
  const organisationId = router.query.id as string;

  const getOrganization = useCallback(async () => {
    try {
      apiCallStarted();
      if (!organisationId) {
        return;
      }

      const organization = await $api.company.getCompanyById(organisationId);
      setOrganization(organization);
    } catch (error) {
      const httpError = error as HttpError;
      if (httpError.status === 404) {
        setOrganization(null);
        return;
      }

      const toast = await import('react-toastify').then((mod) => mod.toast);
      toast.error(httpError.message);
    } finally {
      apiCallDone();
    }
  }, [organisationId, apiCallStarted, apiCallDone]);

  const onEditDetails = async () => {
    const NiceModal = (await import('@ebay/nice-modal-react')).default;
    NiceModal.show(OrganisationDetailsModal as any, {
      organization,
    }).then(() => {
      getOrganization();
      refreshCompanies(dispatch);
    });
  };

  useEffect(() => {
    getOrganization();
  }, [getOrganization]);

  useEffect(() => {
    if (organization) {
      import('moment').then((mod) => {
        const moment = mod.default;
        setCreatedDateFormatted(
          moment(organization.createdAt).format('MMMM DD, YYYY'),
        );
      });
    }
  }, [organization]);

  return (
    <DashboardLayout loading={loading} pageTitle="Organisation Details">
      <div className="organisation-details">
        <div className=" organisation-details__organisation-details-container">
          <div className="organisation-details__organisation-details-header">
            <Link href="/organisations">
              <a>
                <Image
                  src={BackIcon}
                  alt="back-icon"
                  className="organisation-details__back-icon"
                />
              </a>
            </Link>
            <h5 className="organisation-details__organisation-header">
              Organisation Details
            </h5>
          </div>
          <div>
            {!loading && !!organization && (
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
                    details={createdDateFormatted}
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

export default withAuth(OrganisationDetails);
