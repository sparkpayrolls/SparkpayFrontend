import { Button } from '@/components/Button/Button.component';
import { DateTimeChip } from '@/components/DateTimeChip/date-time-chip';
import { SingleDetail } from '@/components/Employee/single-detail.component';
import { GroupEmployees } from '@/components/Group/group-employees.component';
import { TaxGroupModal } from '@/components/Modals/TaxGroupModal.component';
import { StatusChip } from '@/components/StatusChip/status-chip.component';
import NiceModal from '@ebay/nice-modal-react';
import { Util } from 'src/helpers/util';
import DashboardLayoutV2 from 'src/layouts/dashboard-layout-v2/DashboardLayoutV2';
import { useAppSelector } from 'src/redux/hooks';

const EmployeeTaxGroupPage = () => {
  const administrator = useAppSelector((state) => state.administrator);
  const currency = Util.getCurrencySymbolFromAdministrator(administrator);

  return (
    <DashboardLayoutV2
      title="Tax Group"
      href="/remittances/nigeria/taxes?tab=groups#"
    >
      <div className="tax-group-details">
        <div className="tax-group-details__header">
          <h5 className="tax-group-details__page-title">Group Details</h5>

          <Button
            className="tax-group-details__edit-button"
            type="button"
            label="Edit details"
            onClick={() => {
              NiceModal.show(TaxGroupModal, {
                id: 'tax-group-id',
                initialValues: {
                  name: 'Tax Group',
                  description: 'An awesome description about this tax group',
                  salaryBreakdown: [
                    { name: 'Basic', value: 40 },
                    { name: 'Housing', value: 30 },
                    { name: 'Transport', value: 30 },
                  ],
                  customTaxRelief: [{ name: 'Health Insurance', amount: 3000 }],
                },
              });
            }}
            primary
          />
        </div>
        {/* <div className="tax-group-details__not-found">
        <NotFound message="Group not found" />
      </div> */}
        <div className="tax-group-details__container">
          <div className="tax-group-details__section">
            <div>
              <SingleDetail title="Name" details="Tax Group" />
            </div>
            <div>
              <SingleDetail
                title="Status"
                details={<StatusChip status="active" />}
              />
            </div>
            <div>
              <SingleDetail title="Date Created" details={<DateTimeChip />} />
            </div>
          </div>

          <div className="tax-group-details__section">
            <div>
              <SingleDetail
                title="Description"
                details="An awesome description about this tax group"
              />
            </div>
          </div>

          <div className="tax-group-details__section">
            <h5 className="tax-group-details__section-title">
              Salary Breakdown
            </h5>
            <div>
              <SingleDetail title="Basic" details="40%" />
            </div>
            <div>
              <SingleDetail title="Housing" details="30%" />
            </div>
            <div>
              <SingleDetail title="Transport" details="30%" />
            </div>
          </div>

          <div className="tax-group-details__section">
            <h5 className="tax-group-details__section-title">
              Custom Tax Relief Items
            </h5>
            <div>
              <SingleDetail
                title="Health Insurance"
                details={`${currency} 3000`}
              />
            </div>
          </div>

          <div className="tax-group-details__section">
            <div className="tax-group-details__employees">
              <GroupEmployees />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayoutV2>
  );
};

export default EmployeeTaxGroupPage;
