import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import DashboardLayout from '../../src/layouts/dashboard-layout/DashBoardLayout';
import BackIcon from '../../public/svgs/backicon.svg';
import { SingleDetail } from '@/components/Employee/single-detail.component';
import { OrganisationDetailsModal } from '@/components/Modals/OrganisationDetailsModal.component';
import NiceModal from '@ebay/nice-modal-react';

const OrganisationDetails: NextPage = () => {
   const onAddEmployee = () => {
     NiceModal.show(OrganisationDetailsModal);
   };
  return (
    <DashboardLayout pageTitle="Organisation Details">
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
            <button
              className="organisation-details__organisation-button"
              onClick={onAddEmployee}
            >
              Edit Details
            </button>
          </div>
        </div>
        <div className="organisation-details__single-details-container">
          <div className="organisation-details__organisation-settings-flex">
            <div>
              <SingleDetail title="Name" details="Credpal" />
            </div>
            <div>
              <SingleDetail title="Phone Number" details="+234 703 321 8457" />
            </div>
            <div>
              <SingleDetail title="Email Address" details="hello@credpal.com" />
            </div>
            <div>
              <SingleDetail title="Date Created" details="July 20, 2021" />
            </div>
          </div>
          <hr />

          <div className="organisation-details__organisation-settings-flex">
            <div>
              <SingleDetail title="Country" details="Nigeria" />
            </div>
            <div>
              <SingleDetail title="RC Number" details="AP 703 321 AAA" />
            </div>
            <div>
              <SingleDetail title="RC Number" details="AP 703 321 AAA" />
            </div>
            <div>
              <SingleDetail title="Status" details="Active" />
            </div>
          </div>
          <hr />
          <div className="organisation-details__organisation-settings-flex">
            <div>
              <SingleDetail title="Name" details="Credpal" />
            </div>
            <div>
              <SingleDetail title="Phone Number" details="+234 703 321 8457" />
            </div>
            <div>
              <SingleDetail title="Date Created" details="July 20, 2021" />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrganisationDetails;
