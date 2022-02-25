import Image from 'next/image';
import removeicon from '../../../public/svgs/remove-icon.svg';
import { DateTimeChip } from '../DateTimeChip/date-time-chip';
import { EmployeeAutocompleteForm } from '../Form/employee-autocomplete.form';
import { StatusChip } from '../StatusChip/status-chip.component';
import { SingleDetail } from './single-detail.component';

export const GroupDetails = () => {
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
          <div>
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
          <div className="group-details__parent-container">
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
          </div>
        </div>
      </div>
    </div>
  );
};
