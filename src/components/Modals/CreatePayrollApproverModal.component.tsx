import NiceModal from '@ebay/nice-modal-react';
import { ModalLayout } from './ModalLayout.component';
import { CreateApproverForm } from '../Form/create-approver.form';

export const CreatePayrollApproverModal = NiceModal.create(
  (props: Parameters<typeof CreateApproverForm>[0]) => {
    return (
      <ModalLayout
        title={
          props.initialValues?.id
            ? 'Edit Approver Index'
            : 'Add Payroll Approver'
        }
      >
        {() => <CreateApproverForm {...props} />}
      </ModalLayout>
    );
  },
);
