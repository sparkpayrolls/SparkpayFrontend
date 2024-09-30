import React from 'react';
import { SingleDetail } from '../Employee/single-detail.component';
import { useOrganizationDetails } from 'src/helpers/hooks/use-org-details';
import { EditPenSvg } from '../../../src/components/svg/index';
import { Country } from 'src/api/types';
import Skeleton from 'react-loading-skeleton';

type Props = {
  organizationDetails: ReturnType<typeof useOrganizationDetails>;
};

function OrganizationInfo(props: Props) {
  const {
    onEditDetails,
    organization,
    canEdit,
    loading,
    moment,
  } = props.organizationDetails;

  return loading ? (
    <div className="info__left-cont">
      <div className="info__left-cont__top">
        <Skeleton width={200} height={50} />
        <Skeleton width={200} height={50} />
      </div>

      <div className="info__left-cont__bottom">
        <div className="info__left-cont__info-column">
          <Skeleton height={40} width={440} />
          <Skeleton height={40} width={440} />
          <Skeleton height={40} width={440} />
          <Skeleton height={40} width={440} />
        </div>
      </div>
    </div>
  ) : (
    <div className="info__left-cont">
      <div className="info__left-cont__top">
        <p className="info__hero-text">Information</p>
        <div>
          {' '}
          {!loading && !!organization && canEdit && (
            <button onClick={onEditDetails} className="info__edit-button">
              Edit Details
              <EditPenSvg />
            </button>
          )}
        </div>
      </div>

      <div className="info__left-cont__bottom">
        <div className="info__left-cont__info-column">
          <SingleDetail title="name" details={organization?.name} />
          <SingleDetail title="Email Address" details={organization?.email} />
          <SingleDetail
            title="RC Number"
            details={organization?.rcNumber || 'N/A'}
          />
        </div>
        <div className="info__left-cont__info-column">
          <SingleDetail
            title="Phone Number"
            details={organization?.phonenumber}
          />
          <SingleDetail
            title="Country"
            details={(organization?.country as Country)?.name}
          />{' '}
          <SingleDetail
            title="Date Created"
            details={moment(organization?.createdAt).format('MMMM DD, YYYY')}
          />
        </div>
      </div>

      <div className="info__left-cont__logo">
        <SingleDetail
          title="Logo"
          details={
            organization?.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={organization.logo} alt="company-logo" />
            ) : (
              'N/A'
            )
          }
        />
      </div>
    </div>
  );
}

export default OrganizationInfo;
