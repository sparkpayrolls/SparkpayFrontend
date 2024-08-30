import React from 'react';
import { SingleDetail } from '../Employee/single-detail.component';
import { useOrganizationDetails } from 'src/helpers/hooks/use-org-details';
import { EditPenSvg, UploadFile } from '../../../src/components/svg/index';
import { Country } from 'src/api/types';

function OrganizationInfo() {
  const {
    onEditDetails,
    organization,
    canEdit,
    loading,
    moment,
  } = useOrganizationDetails();
  return (
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
          <SingleDetail title="name" details="Credpal" />
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
        />{' '}
        <div className="info__upload">
          <label htmlFor="logoUpload">
            {' '}
            <UploadFile /> Upload Logo
          </label>
          <input type="file" id="logoUpload" />
        </div>
      </div>
    </div>
  );
}

export default OrganizationInfo;
