import Image from 'next/image';
import NiceModal from '@ebay/nice-modal-react';
import { useEffect } from 'react';
import removeicon from '../../../public/svgs/remove-icon.svg';
import { DateTimeChip } from '../DateTimeChip/date-time-chip';
import { EmployeeAutocompleteForm } from '../Form/employee-autocomplete.form';
import { StatusChip } from '../StatusChip/status-chip.component';
import { SingleDetail } from './single-detail.component';
import { CreateEmployeeGroupModal } from '../Modals/CreateEmployeeGroupModal.component';
import { Container } from '../Shared/container.component';

interface IGroupDetails {
  // eslint-disable-next-line no-unused-vars
  onEditDetails?(f: () => void): any;
}

export const GroupDetails = (props: IGroupDetails) => {
  const { onEditDetails } = props;

  useEffect(() => {
    if (onEditDetails) {
      onEditDetails(() => {
        NiceModal.show(CreateEmployeeGroupModal, {
          id: 'some-id',
          initialValues: {
            name: 'Sales Team',
            description:
              'Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis laboriosam labore sit fuga veniam necessitatibus, ratione voluptatem nesciunt culpa? Expedita quo provident voluptatibus, ut magni laudantium recusandae ratione assumenda error?',
            commonSalary: 10000,
          },
        });
      });
    }
  }, [onEditDetails]);

  return (
    <div className="group-details__group-details-property">
      <div className="group-details__group-details-property-section">
        <div className="group-details__group-details-flex-body">
          <div>
            <SingleDetail
              title="Group Name"
              details="Sales Team"
              loading={false}
            />
          </div>
          <div>
            <SingleDetail
              title="Common Salary"
              details={<>&#8358; 10,000</>}
              loading={false}
            />
          </div>
          <div>
            <SingleDetail
              title="Status"
              details={<StatusChip status="disabled" />}
              loading={false}
            />
          </div>
          <div>
            <SingleDetail
              title="Date Created"
              details={<DateTimeChip />}
              loading={false}
            />
          </div>
        </div>
        <hr />
        <div className="group-details__group-details-flex-body">
          <div className="full-width">
            <SingleDetail
              title="Description"
              details="Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis laboriosam labore sit fuga veniam necessitatibus, ratione voluptatem nesciunt culpa? Expedita quo provident voluptatibus, ut magni laudantium recusandae ratione assumenda error?"
              loading={false}
            />
          </div>
        </div>
      </div>

      {/* add employee section */}

      <div className="group-details__group-details-property-section">
        <div className="group-details__add-employee-section">
          <div className="group-details__employee-header">
            <p className="group-details__employee-number">12 Employees</p>
          </div>
          <Container
            loading={false}
            showContent
            className="group-details__parent-container"
          >
            <EmployeeAutocompleteForm />

            <div className="items">
              <div className="group-details__user">
                <p className="group-details__name">Opeyemi</p>
                <div className="group-details__image-container">
                  <Image
                    src={removeicon}
                    className="group-details__remove-icon"
                    alt="group-details-image"
                  />
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
    </div>
  );
};
