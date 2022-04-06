import NiceModal from '@ebay/nice-modal-react';
import { CustomTaxRelief, SalaryBreakdown } from 'src/api/types';
import { EmployeeTaxGroupForm } from '../Form/employee-tax-group.form';
import { ModalLayout } from './ModalLayout.component';

type ITaxGroupModal = {
  id?: string;
  initialValues?: {
    name: string;
    description?: string;
    salaryBreakdown?: SalaryBreakdown[];
    customTaxRelief?: CustomTaxRelief[];
  };
};

export const TaxGroupModal = NiceModal.create<ITaxGroupModal>((props) => {
  return (
    <ModalLayout title="Create Tax Group">
      {(modal) => {
        return (
          <EmployeeTaxGroupForm
            {...props}
            onDone={(group) => {
              modal.resolve(group);
              setTimeout(modal.hide, 10);
            }}
          />
        );
      }}
    </ModalLayout>
  );
});
